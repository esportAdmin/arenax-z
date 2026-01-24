# 🔒 Sécurité - Esport Arena

Ce document décrit les bonnes pratiques de sécurité implémentées dans Esport Arena et les recommandations pour maintenir un niveau de sécurité élevé.

## Table des matières

- [Architecture de sécurité](#architecture-de-sécurité)
- [Authentification](#authentification)
- [Autorisation et RLS](#autorisation-et-rls)
- [Validation des entrées](#validation-des-entrées)
- [Protection des API](#protection-des-api)
- [Gestion des secrets](#gestion-des-secrets)
- [Sécurité des paiements](#sécurité-des-paiements)
- [Checklist de sécurité](#checklist-de-sécurité)
- [Signaler une vulnérabilité](#signaler-une-vulnérabilité)

---

## Architecture de sécurité

### Vue d'ensemble

```
┌─────────────────┐     ┌─────────────────┐     ┌─────────────────┐
│    Frontend     │────▶│  Edge Functions │────▶│    Supabase     │
│   (React/Vite)  │     │     (Deno)      │     │   (PostgreSQL)  │
└─────────────────┘     └─────────────────┘     └─────────────────┘
        │                       │                       │
        ▼                       ▼                       ▼
   Validation             JWT Verify              RLS Policies
   côté client            + Secrets               + Triggers
```

### Principes fondamentaux

1. **Défense en profondeur** : Plusieurs couches de sécurité
2. **Principe du moindre privilège** : Accès minimal nécessaire
3. **Validation à chaque niveau** : Client, Edge Function, Base de données
4. **Secrets isolés** : Jamais exposés côté client

---

## Authentification

### Système d'authentification

Esport Arena utilise Supabase Auth avec les méthodes suivantes :

- **Email/Mot de passe** : Authentification standard
- **Magic Link** : Connexion sans mot de passe
- **OAuth** : Providers tiers (optionnel)

### Bonnes pratiques implémentées

```typescript
// ✅ CORRECT : Utiliser le contexte d'authentification
import { useAuth } from '@/contexts/AuthContext';

const { user, session, signOut } = useAuth();

// ✅ CORRECT : Vérifier l'authentification avant les actions sensibles
if (!user) {
  toast.error("Vous devez être connecté");
  return;
}
```

### ⚠️ À ne jamais faire

```typescript
// ❌ INTERDIT : Stocker des tokens dans localStorage manuellement
localStorage.setItem('auth_token', token);

// ❌ INTERDIT : Vérifier les rôles côté client uniquement
if (localStorage.getItem('isAdmin') === 'true') {
  // Facilement manipulable !
}

// ❌ INTERDIT : Credentials en dur dans le code
const adminPassword = "admin123";
```

---

## Autorisation et RLS

### Système de rôles

Les rôles sont stockés dans une table séparée pour éviter les attaques d'escalade de privilèges :

```sql
-- Enum des rôles
CREATE TYPE public.app_role AS ENUM ('admin', 'moderator', 'user');

-- Table des rôles (séparée des profiles !)
CREATE TABLE public.user_roles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    role app_role NOT NULL,
    UNIQUE (user_id, role)
);

-- Fonction sécurisée pour vérifier les rôles
CREATE FUNCTION public.has_role(_user_id UUID, _role app_role)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_id = _user_id AND role = _role
  )
$$;
```

### Politiques RLS

Chaque table sensible a des politiques RLS activées :

```sql
-- Exemple : Table des prédictions
ALTER TABLE public.predictions ENABLE ROW LEVEL SECURITY;

-- Les utilisateurs voient uniquement leurs prédictions
CREATE POLICY "Users can view own predictions"
ON public.predictions FOR SELECT
USING (auth.uid() = user_id);

-- Les utilisateurs créent uniquement pour eux-mêmes
CREATE POLICY "Users can create own predictions"
ON public.predictions FOR INSERT
WITH CHECK (auth.uid() = user_id);

-- Seuls les admins peuvent tout voir
CREATE POLICY "Admins can view all predictions"
ON public.predictions FOR SELECT
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));
```

### ⚠️ Erreurs courantes RLS

```sql
-- ❌ DANGEREUX : user_id nullable permet de contourner RLS
CREATE TABLE predictions (
    user_id UUID -- Sans NOT NULL !
);

-- ✅ CORRECT : user_id obligatoire
CREATE TABLE predictions (
    user_id UUID NOT NULL REFERENCES auth.users(id)
);
```

---

## Validation des entrées

### Validation côté client avec Zod

```typescript
import { z } from 'zod';

// Schéma de validation
const predictionSchema = z.object({
  match_id: z.string().uuid(),
  selected_team: z.string().min(1).max(100),
  stake_amount: z.number().min(10).max(10000),
});

// Utilisation
const validatePrediction = (data: unknown) => {
  const result = predictionSchema.safeParse(data);
  if (!result.success) {
    throw new Error(result.error.errors[0].message);
  }
  return result.data;
};
```

### Validation des formulaires

```typescript
// ✅ CORRECT : Validation complète
const contactSchema = z.object({
  name: z.string()
    .trim()
    .min(1, "Le nom est requis")
    .max(100, "Nom trop long"),
  email: z.string()
    .trim()
    .email("Email invalide")
    .max(255),
  message: z.string()
    .trim()
    .min(10, "Message trop court")
    .max(1000, "Message trop long"),
});
```

### Encodage des URLs

```typescript
// ✅ CORRECT : Encoder les paramètres utilisateur
const shareUrl = `https://wa.me/?text=${encodeURIComponent(userMessage)}`;

// ❌ DANGEREUX : Injection possible
const shareUrl = `https://wa.me/?text=${userMessage}`;
```

### Sanitisation HTML

```typescript
// ❌ DANGEREUX : XSS possible
<div dangerouslySetInnerHTML={{ __html: userContent }} />

// ✅ CORRECT : Utiliser DOMPurify si HTML nécessaire
import DOMPurify from 'dompurify';
<div dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(userContent) }} />

// ✅ MIEUX : Éviter dangerouslySetInnerHTML
<div>{userContent}</div>
```

---

## Protection des API

### Edge Functions sécurisées

```typescript
// supabase/functions/my-function/index.ts

import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Gestion CORS
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // ✅ Vérifier l'authentification
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      throw new Error('Non authentifié');
    }

    const supabase = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_ANON_KEY')!,
      { global: { headers: { Authorization: authHeader } } }
    );

    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      throw new Error('Token invalide');
    }

    // ✅ Valider les entrées
    const body = await req.json();
    const validated = mySchema.parse(body);

    // Logique métier...

    return new Response(JSON.stringify({ success: true }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error:', error.message);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
```

### Configuration JWT

```toml
# supabase/config.toml

# ✅ Fonctions protégées par JWT (par défaut)
[functions.create-checkout]
verify_jwt = true

# ⚠️ Fonctions publiques (webhooks uniquement)
[functions.stripe-webhook]
verify_jwt = false  # Valide sa propre signature
```

### Rate Limiting

Implémenter côté Edge Function si nécessaire :

```typescript
// Simple rate limiting en mémoire (pour demo)
const rateLimits = new Map<string, { count: number; resetAt: number }>();

function checkRateLimit(userId: string, limit = 100, windowMs = 60000): boolean {
  const now = Date.now();
  const userLimit = rateLimits.get(userId);

  if (!userLimit || now > userLimit.resetAt) {
    rateLimits.set(userId, { count: 1, resetAt: now + windowMs });
    return true;
  }

  if (userLimit.count >= limit) {
    return false;
  }

  userLimit.count++;
  return true;
}
```

---

## Gestion des secrets

### Variables d'environnement

| Variable                        | Exposition | Usage                     |
| ------------------------------- | ---------- | ------------------------- |
| `VITE_SUPABASE_URL`             | ✅ Client  | URL publique Supabase     |
| `VITE_SUPABASE_PUBLISHABLE_KEY` | ✅ Client  | Clé anon publique         |
| `VITE_STRIPE_PUBLISHABLE_KEY`   | ✅ Client  | Clé Stripe publique       |
| `STRIPE_SECRET_KEY`             | ❌ Serveur | Edge Functions uniquement |
| `STRIPE_WEBHOOK_SECRET`         | ❌ Serveur | Webhooks uniquement       |
| `PANDASCORE_API_KEY`            | ❌ Serveur | Edge Functions uniquement |

### Règles strictes

```bash
# ✅ CORRECT : Configurer les secrets via CLI
supabase secrets set STRIPE_SECRET_KEY=sk_live_...

# ❌ INTERDIT : Secrets dans le code
const stripeKey = "sk_live_xxx"; // JAMAIS !

# ❌ INTERDIT : Secrets avec préfixe VITE_
VITE_STRIPE_SECRET_KEY=sk_live_... # Exposé au client !
```

### Accès aux secrets dans Edge Functions

```typescript
// ✅ CORRECT : Accès sécurisé
const stripeKey = Deno.env.get('STRIPE_SECRET_KEY');
if (!stripeKey) {
  throw new Error('STRIPE_SECRET_KEY not configured');
}
```

---

## Sécurité des paiements

### Webhooks Stripe

```typescript
// supabase/functions/stripe-webhook/index.ts

import Stripe from 'https://esm.sh/stripe@14.21.0';

const stripe = new Stripe(Deno.env.get('STRIPE_SECRET_KEY')!, {
  apiVersion: '2023-10-16',
});

serve(async (req) => {
  const signature = req.headers.get('stripe-signature');
  const body = await req.text();

  // ✅ Vérifier la signature du webhook
  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature!,
      Deno.env.get('STRIPE_WEBHOOK_SECRET')!
    );
  } catch (err) {
    console.error('Webhook signature verification failed');
    return new Response('Invalid signature', { status: 400 });
  }

  // Traiter l'événement vérifié
  switch (event.type) {
    case 'checkout.session.completed':
      // Logique de traitement...
      break;
  }

  return new Response(JSON.stringify({ received: true }));
});
```

### Bonnes pratiques paiements

1. **Ne jamais faire confiance aux montants côté client**
2. **Toujours vérifier les signatures webhook**
3. **Utiliser des clés de test en développement**
4. **Logger les événements de paiement pour audit**

---

## Checklist de sécurité

### Avant chaque déploiement

- [ ] Aucun secret dans le code source
- [ ] RLS activé sur toutes les tables sensibles
- [ ] Validation des entrées côté client ET serveur
- [ ] JWT vérifié sur les Edge Functions sensibles
- [ ] Rôles stockés dans `user_roles` (pas dans `profiles`)
- [ ] Pas de `console.log` avec données sensibles
- [ ] CORS configuré correctement
- [ ] Webhooks vérifient leurs signatures

### Audit régulier

- [ ] Vérifier les politiques RLS
- [ ] Auditer les accès admin
- [ ] Revoir les logs d'authentification
- [ ] Tester les scénarios d'escalade de privilèges
- [ ] Vérifier les dépendances (npm audit)

---

## Signaler une vulnérabilité

Si vous découvrez une vulnérabilité de sécurité :

1. **Ne pas** créer d'issue publique
2. Envoyer un email à : security@esportarena.com
3. Inclure :
   - Description de la vulnérabilité
   - Étapes pour reproduire
   - Impact potentiel
   - Suggestion de correction (si possible)

### Délai de réponse

- Accusé de réception : 24h
- Évaluation initiale : 72h
- Correction : selon sévérité (critique < 7 jours)

---

## Ressources

- [OWASP Top 10](https://owasp.org/www-project-top-ten/)
- [Supabase Security](https://supabase.com/docs/guides/auth/row-level-security)
- [Stripe Security Best Practices](https://stripe.com/docs/security/guide)
- [Deno Security](https://deno.land/manual/basics/permissions)

---

_Dernière mise à jour : Janvier 2026_
