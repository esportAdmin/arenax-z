# 🤝 Guide de Contribution - Esport Arena

Merci de votre intérêt pour contribuer à Esport Arena ! Ce guide vous aidera à comprendre comment participer efficacement au projet.

---

## 📋 Table des Matières

- [Code de Conduite](#-code-de-conduite)
- [Comment Contribuer](#-comment-contribuer)
- [Configuration du Projet](#-configuration-du-projet)
- [Standards de Code](#-standards-de-code)
- [Commits et Branches](#-commits-et-branches)
- [Pull Requests](#-pull-requests)
- [Tests](#-tests)
- [Signaler un Bug](#-signaler-un-bug)
- [Proposer une Fonctionnalité](#-proposer-une-fonctionnalité)
- [Sécurité](#-sécurité)
- [Communauté](#-communauté)

---

## 📜 Code de Conduite

### Nos Engagements

En tant que contributeurs et mainteneurs, nous nous engageons à rendre la participation à ce projet une expérience sans harcèlement pour tous, indépendamment de l'âge, la taille, le handicap, l'ethnicité, l'identité de genre, le niveau d'expérience, la nationalité, l'apparence personnelle, la race, la religion ou l'orientation sexuelle.

### Comportements Attendus

- ✅ Utiliser un langage accueillant et inclusif
- ✅ Respecter les différents points de vue et expériences
- ✅ Accepter gracieusement les critiques constructives
- ✅ Se concentrer sur ce qui est le mieux pour la communauté
- ✅ Faire preuve d'empathie envers les autres membres

### Comportements Inacceptables

- ❌ Trolling, commentaires insultants ou désobligeants
- ❌ Harcèlement public ou privé
- ❌ Publication d'informations privées sans permission
- ❌ Toute conduite inappropriée dans un cadre professionnel

Tout comportement inacceptable peut être signalé aux mainteneurs du projet.

---

## 🚀 Comment Contribuer

### Types de Contributions Bienvenues

| Type                 | Description                          | Label GitHub    |
| -------------------- | ------------------------------------ | --------------- |
| 🐛 **Bug fixes**     | Corriger des bugs existants          | `bug`           |
| ✨ **Features**      | Ajouter de nouvelles fonctionnalités | `enhancement`   |
| 📚 **Documentation** | Améliorer la documentation           | `documentation` |
| 🎨 **Design**        | Améliorer l'UI/UX                    | `design`        |
| ⚡ **Performance**   | Optimisations de performance         | `performance`   |
| 🧪 **Tests**         | Ajouter ou améliorer les tests       | `testing`       |
| 🌍 **Traduction**    | Traduire l'application               | `i18n`          |
| 🔧 **Maintenance**   | Refactoring, dépendances             | `chore`         |

### Processus de Contribution

```
┌─────────────────┐
│   1. Fork       │
│   le repository │
└────────┬────────┘
         ↓
┌─────────────────┐
│  2. Créer une   │
│     branche     │
└────────┬────────┘
         ↓
┌─────────────────┐
│  3. Développer  │
│    & Tester     │
└────────┬────────┘
         ↓
┌─────────────────┐
│  4. Commit avec │
│   convention    │
└────────┬────────┘
         ↓
┌─────────────────┐
│  5. Push & PR   │
└────────┬────────┘
         ↓
┌─────────────────┐
│ 6. Review &     │
│    Merge        │
└─────────────────┘
```

---

## ⚙️ Configuration du Projet

### Prérequis

| Outil   | Version  | Téléchargement                                          |
| ------- | -------- | ------------------------------------------------------- |
| Node.js | v18+     | [nodejs.org](https://nodejs.org/)                       |
| npm     | v9+      | Inclus avec Node.js                                     |
| Git     | v2.30+   | [git-scm.com](https://git-scm.com/)                     |
| VS Code | Dernière | [code.visualstudio.com](https://code.visualstudio.com/) |

### Installation

```bash
# 1. Fork le repository sur GitHub

# 2. Cloner votre fork
git clone https://github.com/VOTRE-USERNAME/esport-arena.git
cd esport-arena

# 3. Ajouter le remote upstream
git remote add upstream https://github.com/esport-arena/esport-arena.git

# 4. Installer les dépendances
npm install

# 5. Copier les variables d'environnement
cp .env.example .env.local
# Éditer .env.local avec vos valeurs

# 6. Lancer le serveur de développement
npm run dev
```

### Extensions VS Code Recommandées

Créez un fichier `.vscode/extensions.json` :

```json
{
  "recommendations": [
    "dbaeumer.vscode-eslint",
    "esbenp.prettier-vscode",
    "bradlc.vscode-tailwindcss",
    "dsznajder.es7-react-js-snippets",
    "formulahendry.auto-rename-tag",
    "usernamehw.errorlens",
    "eamodio.gitlens",
    "christian-kohler.path-intellisense"
  ]
}
```

### Configuration VS Code

Créez un fichier `.vscode/settings.json` :

```json
{
  "editor.formatOnSave": true,
  "editor.defaultFormatter": "esbenp.prettier-vscode",
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": "explicit"
  },
  "tailwindCSS.experimental.classRegex": [
    ["cva\\(([^)]*)\\)", "[\"'`]([^\"'`]*).*?[\"'`]"]
  ],
  "typescript.preferences.importModuleSpecifier": "non-relative"
}
```

---

## 📏 Standards de Code

### TypeScript

```typescript
// ✅ CORRECT : Typage explicite avec interfaces
interface PredictionCardProps {
  prediction: Prediction;
  onEdit?: (id: string) => void;
  className?: string;
}

export const PredictionCard = ({
  prediction,
  onEdit,
  className
}: PredictionCardProps) => {
  // ...
};

// ❌ ÉVITER : any ou typage implicite
const data: any = fetchData();
const UserCard = (props) => { ... }; // Props non typées

// ✅ CORRECT : Types stricts
const data: Prediction[] = await fetchPredictions();
```

### React / Composants

```tsx
// ✅ CORRECT : Composants fonctionnels avec hooks
export const UserStats = ({ userId }: { userId: string }) => {
  const { data, isLoading, error } = useUserStats(userId);

  if (isLoading) return <Skeleton className="h-32" />;
  if (error) return <ErrorMessage error={error} />;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Statistiques</CardTitle>
      </CardHeader>
      <CardContent>
        {/* Contenu */}
      </CardContent>
    </Card>
  );
};

// ✅ CORRECT : Mémoisation quand nécessaire
const expensiveCalculation = useMemo(() => {
  return computeStats(data);
}, [data]);

// ✅ CORRECT : Callbacks stables
const handleClick = useCallback((id: string) => {
  updateItem(id);
}, [updateItem]);

// ✅ CORRECT : Composants petits et focalisés
// Divisez les gros composants (>200 lignes) en sous-composants
```

### Tailwind CSS

```tsx
// ✅ CORRECT : Utiliser les tokens du design system
<div className="bg-background text-foreground border-border">
  <Button variant="default">Action</Button>
</div>

// ❌ ÉVITER : Couleurs hardcodées
<div className="bg-white text-black border-gray-200">
<div className="bg-[#1a1a2e] text-[#ffffff]">

// ✅ CORRECT : Classes organisées (layout → spacing → style)
<button className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90">

// ✅ CORRECT : Responsive design mobile-first
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">

// ✅ CORRECT : Utiliser cn() pour les classes conditionnelles
<div className={cn(
  "p-4 rounded-lg",
  isActive && "bg-primary",
  disabled && "opacity-50 cursor-not-allowed"
)}>
```

### Imports

```typescript
// ✅ CORRECT : Ordre des imports
// 1. React et bibliothèques externes
import { useState, useEffect, useMemo } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { format } from "date-fns";

// 2. Composants UI (shadcn)
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardContent } from "@/components/ui/card";

// 3. Composants internes
import { UserAvatar } from "@/components/UserAvatar";
import { PredictionCard } from "@/components/predictions/PredictionCard";

// 4. Hooks personnalisés
import { useAuth } from "@/contexts/AuthContext";
import { useProfile } from "@/hooks/useProfile";

// 5. Utilitaires et types
import { cn } from "@/lib/utils";
import { supabase } from "@/integrations/supabase/client";
import type { User, Prediction } from "@/types";
```

### Naming Conventions

| Type             | Convention                | Exemple                             |
| ---------------- | ------------------------- | ----------------------------------- |
| Composants       | PascalCase                | `UserProfile.tsx`                   |
| Hooks            | camelCase avec "use"      | `useAuth.ts`, `useProfile.ts`       |
| Contextes        | PascalCase avec "Context" | `AuthContext.tsx`                   |
| Utilitaires      | camelCase                 | `formatDate.ts`, `utils.ts`         |
| Types/Interfaces | PascalCase                | `interface UserData`, `type Status` |
| Props interfaces | PascalCase + "Props"      | `interface UserCardProps`           |
| Variables        | camelCase                 | `const userName`, `let isLoading`   |
| Constantes       | UPPER_SNAKE_CASE          | `const MAX_ITEMS = 10`              |
| CSS variables    | kebab-case                | `--primary-color`, `--spacing-lg`   |

---

## 🌿 Commits et Branches

### Convention de Nommage des Branches

```bash
main                          # Production (protégée)
├── develop                   # Développement (optionnel)
├── feature/nom-feature       # Nouvelle fonctionnalité
├── fix/description-bug       # Correction de bug
├── docs/sujet-documentation  # Documentation
├── refactor/ce-qui-change    # Refactoring
├── style/changements-ui      # Changements visuels
├── test/ajout-de-tests       # Ajout de tests
└── chore/maintenance         # Maintenance, dépendances
```

### Créer une Branche

```bash
# Synchroniser avec upstream
git fetch upstream
git checkout main
git merge upstream/main

# Créer une nouvelle branche
git checkout -b feature/nouvelle-fonctionnalite

# Pousser la branche
git push -u origin feature/nouvelle-fonctionnalite
```

### Garder sa Branche à Jour

```bash
# Rebaser sur main
git fetch upstream
git rebase upstream/main

# En cas de conflits
git rebase --continue  # Après résolution
git rebase --abort     # Pour annuler
```

### Convention de Commits (Conventional Commits)

```
<type>(<scope>): <description>

[body optionnel]

[footer optionnel]
```

#### Types de Commits

| Type       | Description                             | Exemple                                     |
| ---------- | --------------------------------------- | ------------------------------------------- |
| `feat`     | Nouvelle fonctionnalité                 | `feat(clubs): add club war system`          |
| `fix`      | Correction de bug                       | `fix(auth): resolve login redirect loop`    |
| `docs`     | Documentation uniquement                | `docs(readme): update installation guide`   |
| `style`    | Formatage, sans changement de code      | `style(button): fix alignment`              |
| `refactor` | Refactoring sans changement fonctionnel | `refactor(hooks): simplify useProfile`      |
| `perf`     | Amélioration de performance             | `perf(queries): optimize leaderboard fetch` |
| `test`     | Ajout ou correction de tests            | `test(auth): add login unit tests`          |
| `chore`    | Maintenance, dépendances, config        | `chore(deps): update react to v18.3`        |
| `ci`       | Configuration CI/CD                     | `ci(github): add deploy workflow`           |

#### Exemples de Bons Commits

```bash
# Fonctionnalité
git commit -m "feat(predictions): add match filtering by game type"

# Bug fix avec référence à une issue
git commit -m "fix(auth): resolve token refresh loop

Fixes #123"

# Breaking change
git commit -m "feat(api)!: change prediction response format

BREAKING CHANGE: The prediction endpoint now returns
an array instead of an object. Update your frontend code."

# Avec scope multiple
git commit -m "feat(clubs,notifications): add war challenge notifications"
```

#### Règles des Commits

- ✅ Utiliser l'impératif présent ("add" pas "added")
- ✅ Première lettre en minuscule
- ✅ Pas de point à la fin de la description
- ✅ Limiter la description à 72 caractères
- ✅ Référencer les issues dans le footer (`Fixes #123`, `Closes #456`)
- ❌ Ne pas commit du code qui ne compile pas
- ❌ Ne pas commit des secrets ou credentials

---

## 🔄 Pull Requests

### Avant de Soumettre

- [ ] Le code compile sans erreurs (`npm run build`)
- [ ] Le linting passe (`npm run lint`)
- [ ] Les fonctionnalités existantes ne sont pas cassées
- [ ] Le code suit les standards définis ci-dessus
- [ ] La documentation est mise à jour si nécessaire
- [ ] Les commits suivent la convention
- [ ] Les tests passent (si applicables)

### Template de Pull Request

```markdown
## Description

Décrivez brièvement les changements effectués.

## Type de Changement

- [ ] 🐛 Bug fix (changement non-breaking qui corrige un bug)
- [ ] ✨ Nouvelle fonctionnalité (changement non-breaking qui ajoute une feature)
- [ ] 💥 Breaking change (fix ou feature qui casserait l'existant)
- [ ] 📚 Documentation
- [ ] 🎨 Style/UI
- [ ] ♻️ Refactoring
- [ ] ⚡ Performance

## Changements Effectués

- Liste des changements principaux
- ...

## Screenshots (si applicable)

| Avant | Après |
| ----- | ----- |
| image | image |

## Tests Effectués

Décrivez comment vous avez testé vos changements.

## Checklist

- [ ] Mon code suit les conventions du projet
- [ ] J'ai effectué une self-review de mon code
- [ ] J'ai commenté mon code si nécessaire
- [ ] J'ai mis à jour la documentation
- [ ] Mes changements ne génèrent pas de warnings
- [ ] J'ai ajouté des tests (si nécessaire)

## Issues Liées

Closes #123
Related to #456
```

### Processus de Review

```
1. Auto-review     → Relisez votre propre PR avant de soumettre
        ↓
2. CI checks       → Attendez que les checks passent
        ↓
3. Reviewer        → Un mainteneur examine votre PR
   feedback        → Des modifications peuvent être demandées
        ↓
4. Corrections     → Adressez les commentaires
        ↓
5. Approval        → Minimum 1 approbation requise
        ↓
6. Merge           → Squash and merge (recommandé)
```

### Tips pour une PR Réussie

- **Petites PRs** : Préférez plusieurs petites PRs à une grosse
- **Description claire** : Expliquez le "pourquoi", pas juste le "quoi"
- **Screenshots** : Pour tout changement UI
- **Tests** : Démontrez que votre code fonctionne
- **Réactivité** : Répondez rapidement aux commentaires

---

## 🧪 Tests

### Structure des Tests

```
src/
├── components/
│   └── UserCard/
│       ├── UserCard.tsx
│       └── UserCard.test.tsx    # Test unitaire du composant
├── hooks/
│   └── __tests__/
│       └── useProfile.test.ts   # Test du hook
└── __tests__/
    ├── integration/             # Tests d'intégration
    └── e2e/                     # Tests end-to-end
```

### Écrire des Tests

```typescript
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { vi, describe, it, expect, beforeEach } from 'vitest';
import { UserCard } from './UserCard';

describe('UserCard', () => {
  const mockUser = {
    id: '1',
    name: 'John Doe',
    email: 'john@example.com',
    avatar_url: null,
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders user name correctly', () => {
    render(<UserCard user={mockUser} />);
    expect(screen.getByText('John Doe')).toBeInTheDocument();
  });

  it('renders user email correctly', () => {
    render(<UserCard user={mockUser} />);
    expect(screen.getByText('john@example.com')).toBeInTheDocument();
  });

  it('calls onEdit when edit button is clicked', async () => {
    const onEdit = vi.fn();
    render(<UserCard user={mockUser} onEdit={onEdit} />);

    fireEvent.click(screen.getByRole('button', { name: /edit/i }));

    await waitFor(() => {
      expect(onEdit).toHaveBeenCalledWith('1');
    });
  });

  it('shows default avatar when avatar_url is null', () => {
    render(<UserCard user={mockUser} />);
    expect(screen.getByRole('img')).toHaveAttribute('src', expect.stringContaining('default'));
  });
});
```

### Tester les Hooks

```typescript
import { renderHook, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useProfile } from '@/hooks/useProfile';

const createWrapper = () => {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  });
  return ({ children }) => (
    <QueryClientProvider client={queryClient}>
      {children}
    </QueryClientProvider>
  );
};

describe('useProfile', () => {
  it('fetches user profile successfully', async () => {
    const { result } = renderHook(() => useProfile('user-123'), {
      wrapper: createWrapper(),
    });

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });

    expect(result.current.data).toHaveProperty('username');
  });
});
```

### Commandes de Test

```bash
# Lancer tous les tests
npm test

# Mode watch (développement)
npm test -- --watch

# Avec couverture de code
npm test -- --coverage

# Fichier spécifique
npm test -- UserCard.test.tsx

# Verbose output
npm test -- --reporter=verbose
```

---

## 🐛 Signaler un Bug

### Avant de Signaler

1. **Recherchez** dans les issues existantes
2. **Vérifiez** que vous utilisez la dernière version
3. **Testez** sur différents navigateurs si applicable

### Template de Bug Report

Créez une issue avec ce format :

```markdown
## 🐛 Description du Bug

Description claire et concise du bug.

## 📋 Étapes pour Reproduire

1. Aller sur '...'
2. Cliquer sur '...'
3. Scroller jusqu'à '...'
4. Voir l'erreur

## ✅ Comportement Attendu

Ce qui devrait se passer.

## ❌ Comportement Actuel

Ce qui se passe réellement.

## 📸 Screenshots

Si applicable, ajoutez des screenshots pour illustrer le problème.

## 🔧 Environnement

- **OS** : [ex: Windows 11, macOS 14, Ubuntu 22.04]
- **Navigateur** : [ex: Chrome 120, Firefox 121, Safari 17]
- **Version du projet** : [ex: 1.0.0]
- **Résolution écran** : [ex: 1920x1080, mobile]

## 📝 Logs Console
```

Collez ici les erreurs de la console du navigateur

```

## ℹ️ Informations Additionnelles

Contexte supplémentaire sur le problème.
```

---

## 💡 Proposer une Fonctionnalité

### Avant de Proposer

1. **Recherchez** dans les issues existantes
2. **Réfléchissez** à la valeur ajoutée pour le projet
3. **Considérez** les impacts sur l'existant

### Template de Feature Request

Créez une issue avec ce format :

```markdown
## 💡 Résumé

Description courte de la fonctionnalité en une phrase.

## 🎯 Motivation

Pourquoi cette fonctionnalité serait-elle utile ?
Quel problème résout-elle ?

## 📝 Description Détaillée

Description complète de ce que vous proposez.
Comment imaginez-vous le fonctionnement ?

## 🎨 Maquettes / Wireframes

Si applicable, ajoutez des visuels (même des croquis simples).

## 🔄 Alternatives Considérées

Autres solutions que vous avez envisagées et pourquoi celle-ci est meilleure.

## ✅ Critères d'Acceptation

- [ ] Critère 1
- [ ] Critère 2
- [ ] Critère 3

## 💭 Questions Ouvertes

Des points sur lesquels vous souhaitez avoir l'avis de l'équipe.
```

---

## 🔒 Sécurité

### Signaler une Vulnérabilité

⚠️ **Ne créez PAS d'issue publique pour les vulnérabilités de sécurité.**

1. Envoyez un email à : **security@esportarena.com**
2. Incluez :
   - Description de la vulnérabilité
   - Étapes pour reproduire
   - Impact potentiel
   - Suggestion de correction (si possible)

### Délais de Réponse

| Sévérité | Accusé de réception | Correction        |
| -------- | ------------------- | ----------------- |
| Critique | 24h                 | < 7 jours         |
| Haute    | 48h                 | < 14 jours        |
| Moyenne  | 72h                 | < 30 jours        |
| Basse    | 1 semaine           | Prochaine release |

### Bonnes Pratiques

Consultez notre [Guide de Sécurité](./SECURITY.md) pour les bonnes pratiques à suivre.

---

## 👥 Communauté

### Obtenir de l'Aide

- **Issues GitHub** : Pour les bugs et demandes de fonctionnalités
- **Discussions GitHub** : Pour les questions générales
- **Discord** : Pour les discussions en temps réel (si disponible)

### Reconnaissance

Les contributeurs sont reconnus dans :

- 📜 Le fichier `CONTRIBUTORS.md`
- 📋 Les release notes du `CHANGELOG.md`
- 🏆 Le `README.md` (contributeurs majeurs)

### Devenir Mainteneur

Les contributeurs réguliers et de qualité peuvent être invités à devenir mainteneurs. Critères :

- ✅ Contributions régulières sur 3+ mois
- ✅ Respect des standards du projet
- ✅ Participation active aux reviews
- ✅ Attitude positive et collaborative
- ✅ Bonne compréhension de l'architecture

---

## 📁 Structure du Projet

```
esport-arena/
├── 📂 docs/                     # Documentation
│   ├── INSTALLATION.md          # Guide d'installation
│   ├── CONTRIBUTING.md          # Ce fichier
│   ├── SECURITY.md              # Guide de sécurité
│   ├── CHANGELOG.md             # Historique des versions
│   └── supabase-schema.sql      # Schéma de la BDD
├── 📂 public/                   # Assets statiques
├── 📂 src/                      # Code source
│   ├── 📂 assets/               # Images, fonts
│   ├── 📂 components/           # Composants React
│   │   ├── 📂 ui/               # Composants shadcn
│   │   ├── 📂 layout/           # Navbar, Footer
│   │   └── 📂 [feature]/        # Par fonctionnalité
│   ├── 📂 contexts/             # React Contexts
│   ├── 📂 hooks/                # Custom hooks
│   ├── 📂 lib/                  # Utilitaires
│   ├── 📂 pages/                # Pages/Routes
│   └── 📂 integrations/         # Supabase, etc.
├── 📂 supabase/                 # Backend
│   ├── 📂 functions/            # Edge functions
│   └── config.toml              # Configuration
├── .env.example                 # Template des variables
├── LICENSE                      # Licence MIT
└── README.md                    # Documentation principale
```

---

## ❓ FAQ

### Ma PR est bloquée, que faire ?

1. Vérifiez les checks CI
2. Répondez aux commentaires des reviewers
3. Demandez une re-review après corrections
4. Mentionnez un mainteneur si bloqué depuis > 1 semaine

### Comment puis-je aider sans coder ?

- 📚 Améliorer la documentation
- 🐛 Tester et signaler des bugs
- 💬 Répondre aux questions d'autres utilisateurs
- 🌍 Traduire l'application
- 🎨 Proposer des améliorations UI/UX

### Le build échoue localement, que faire ?

```bash
# Nettoyer et réinstaller
rm -rf node_modules
npm install

# Vérifier la version Node
node --version  # Doit être >= 18

# Reconstruire
npm run build
```

---

## 📚 Ressources Utiles

- [Documentation React](https://react.dev/)
- [Documentation TypeScript](https://www.typescriptlang.org/docs/)
- [Documentation Tailwind CSS](https://tailwindcss.com/docs)
- [Documentation shadcn/ui](https://ui.shadcn.com/)
- [Documentation Supabase](https://supabase.com/docs)
- [Conventional Commits](https://www.conventionalcommits.org/)
- [Keep a Changelog](https://keepachangelog.com/)

---

**Merci de contribuer à Esport Arena ! 🎮🏆**

Chaque contribution, grande ou petite, aide à améliorer le projet pour toute la communauté.

_Dernière mise à jour : Janvier 2026_
