# 🎮 Esport Arena - Guide d'Installation Locale

Guide complet pour installer et configurer Esport Arena en local avec VS Code et Supabase CLI.

---

## 📋 Prérequis

Avant de commencer, assurez-vous d'avoir installé :

- **Node.js** (v18 ou supérieur) - [Télécharger](https://nodejs.org/)
- **Git** - [Télécharger](https://git-scm.com/)
- **VS Code** (recommandé) - [Télécharger](https://code.visualstudio.com/)
- **Supabase CLI** - [Documentation](https://supabase.com/docs/guides/cli)
- **Docker** (pour Supabase local) - [Télécharger](https://www.docker.com/)

---

## 🚀 Installation Rapide

```bash
# 1. Cloner le repository
git clone https://github.com/votre-username/esport-arena.git
cd esport-arena

# 2. Installer les dépendances
npm install

# 3. Copier le fichier d'environnement
cp .env.example .env.local

# 4. Lancer le serveur de développement
npm run dev
```

---

## 📦 Installation Détaillée

### 1. Cloner le Repository

```bash
git clone https://github.com/votre-username/esport-arena.git
cd esport-arena
```

### 2. Installer les Dépendances

```bash
# Avec npm
npm install

# Ou avec bun (plus rapide)
bun install
```

### 3. Configuration Supabase

#### Option A : Utiliser un projet Supabase Cloud (Recommandé)

1. Créez un compte sur [supabase.com](https://supabase.com)
2. Créez un nouveau projet
3. Récupérez vos clés dans **Settings > API**

#### Option B : Supabase en Local avec Docker

```bash
# Installer Supabase CLI
npm install -g supabase

# Démarrer Supabase en local
supabase start

# Afficher les credentials
supabase status
```

### 4. Variables d'Environnement

Créez un fichier `.env.local` à la racine du projet :

```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://votre-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

# Pour le développement local avec Supabase CLI
# NEXT_PUBLIC_SUPABASE_URL=http://localhost:54321
# NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

---

## 🗄️ Configuration de la Base de Données

### Initialiser le Schéma

1. Ouvrez le **SQL Editor** dans votre dashboard Supabase
2. Copiez le contenu de `docs/supabase-schema.sql`
3. Exécutez le script

Ou via Supabase CLI :

```bash
# Si vous utilisez Supabase local
supabase db reset

# Pour appliquer les migrations
supabase db push
```

### Structure du Schéma

Le fichier `docs/supabase-schema.sql` contient :

- ✅ **Enums** : app_role, arena_source, badge_category, badge_rarity
- ✅ **35+ Tables** : profiles, badges, clubs, predictions, etc.
- ✅ **RLS Policies** : Sécurité Row Level Security
- ✅ **Fonctions** : add_xp, claim_reward, create_club, etc.
- ✅ **Triggers** : Auto-création profil, notifications, etc.
- ✅ **Données de Seed** : Badges, challenges, rewards, clubs de démo

---

## ⚡ Edge Functions

### Déploiement des Edge Functions

Le projet contient les edge functions suivantes dans `supabase/functions/` :

| Fonction              | Description                               |
| --------------------- | ----------------------------------------- |
| `check-subscription`  | Vérifier le statut d'abonnement           |
| `api/billing/checkout`| Créer une session Lemon Squeezy           |
| `lemon-squeezy-webhook` | Webhook pour renouvellements automatiques |
| `pandascore-matches`  | API pour récupérer les matchs esport      |
| `send-support-status` | Envoi d'emails de support                 |

### Déployer toutes les fonctions

```bash
# Déployer toutes les edge functions
supabase functions deploy

# Déployer une fonction spécifique
supabase functions deploy check-subscription
supabase functions deploy pandascore-matches
supabase functions deploy send-support-status
```

### Configurer les Secrets

```bash
# Secrets Lemon Squeezy (obligatoires pour les paiements)
LEMONSQUEEZY_API_KEY=...
LEMONSQUEEZY_STORE_ID=...

# Secret PandaScore (optionnel, pour les matchs esport live)
supabase secrets set PANDASCORE_API_KEY=...

# Secret Resend (optionnel, pour les emails)
supabase secrets set RESEND_API_KEY=re_...
```

### Vérifier les secrets configurés

```bash
supabase secrets list
```

---

## 🔐 Configuration Authentification

### Activer l'auto-confirmation des emails (Développement)

Dans le dashboard Supabase :

1. Allez dans **Authentication > Providers**
2. Sous **Email**, activez **Confirm email** ou désactivez pour le dev local
3. Configurez l'URL de redirection : `http://localhost:3000`

Ou via CLI :

```bash
# Dans supabase/config.toml, ajoutez :
[auth]
enable_signup = true
double_confirm_changes = false

[auth.email]
enable_confirmations = false  # Désactiver pour le dev local
```

---

## Configuration Lemon Squeezy

### 1. Créer un compte Lemon Squeezy

1. Créez le store RallyGuild dans Lemon Squeezy
2. Activez le mode test pour la preview si nécessaire

### 2. Créer les produits et variants

Créez les plans communautaires :

- Starter monthly et yearly
- Pro monthly et yearly
- Elite monthly et yearly

Prix annuel recommandé :

- yearly = 10 x monthly
- cela équivaut à 2 mois offerts

### 3. Configurer les variables

Mettez à jour les IDs dans :

- `src/lib/subscriptionTiers.ts`
- Vercel Environment Variables

---

## 🧪 Lancer le Projet

### Développement

```bash
# Démarrer le serveur de développement
npm run dev

# Le site sera accessible sur http://localhost:3000
```

### Build de Production

```bash
# Créer le build de production
npm run build

# Prévisualiser le build
npm run preview
```

---

## 📁 Structure du Projet

```
esport-arena/
├── docs/
│   ├── INSTALLATION.md          # Ce fichier
│   └── supabase-schema.sql      # Schéma complet de la BDD
├── public/                      # Assets statiques
├── src/
│   ├── components/              # Composants React
│   │   ├── admin/               # Dashboard admin
│   │   ├── clubs/               # Fonctionnalités clubs
│   │   ├── dashboard/           # Dashboard utilisateur
│   │   ├── engagement/          # Challenges, welcome screen
│   │   ├── features/            # Landing page sections
│   │   ├── layout/              # Navbar, Footer
│   │   ├── leaderboard/         # Classements
│   │   ├── predictions/         # Système de prédictions
│   │   ├── profile/             # Profil utilisateur
│   │   ├── rewards/             # Récompenses
│   │   └── ui/                  # Composants UI (shadcn)
│   ├── contexts/                # Contextes React (Auth, Notifications)
│   ├── hooks/                   # Custom hooks
│   ├── integrations/supabase/   # Client et types Supabase (auto-générés)
│   ├── lib/                     # Utilitaires
│   └── pages/                   # Pages de l'application
├── supabase/
│   ├── config.toml              # Configuration Supabase
│   └── functions/               # Edge functions
│       ├── check-subscription/
│       ├── pandascore-matches/
│       ├── send-support-status/
│       └── lemon-squeezy-webhook/
├── .env.example                 # Template des variables d'environnement
├── package.json
├── tailwind.config.ts
├── tsconfig.json
└── vite.config.ts
```

---

## 🔧 Scripts Disponibles

| Script            | Description                         |
| ----------------- | ----------------------------------- |
| `npm run dev`     | Démarre le serveur de développement |
| `npm run build`   | Build de production                 |
| `npm run preview` | Prévisualise le build               |
| `npm run lint`    | Vérifie le code avec ESLint         |

---

## 🐛 Dépannage

### Erreur "CORS" sur les Edge Functions

Vérifiez que vos fonctions incluent les headers CORS :

```typescript
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};
```

### Erreur "Invalid JWT"

- Vérifiez que `NEXT_PUBLIC_SUPABASE_ANON_KEY` est correct
- Assurez-vous que l'utilisateur est bien authentifié

### Erreur de connexion à la base de données

```bash
# Vérifier le statut Supabase local
supabase status

# Redémarrer si nécessaire
supabase stop
supabase start
```

### Les Edge Functions ne se déploient pas

```bash
# Vérifier les logs
supabase functions logs nom-de-la-fonction

# Redéployer
supabase functions deploy nom-de-la-fonction --no-verify-jwt
```

---

## 📚 Ressources

- [Documentation Supabase](https://supabase.com/docs)
- [Documentation Lemon Squeezy](https://docs.lemonsqueezy.com)
- [Documentation React](https://react.dev)
- [Documentation Tailwind CSS](https://tailwindcss.com/docs)
- [Documentation shadcn/ui](https://ui.shadcn.com)

---

## 🤝 Support

Pour toute question ou problème :

1. Consultez la [documentation officielle](https://supabase.com/docs)
2. Ouvrez une issue sur le repository
3. Contactez l'équipe via la page Contact de l'application

---

**Bon développement ! 🚀**
