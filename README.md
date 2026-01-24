<p align="center">
  <img src="https://img.shields.io/badge/React-18.3-61DAFB?style=for-the-badge&logo=react&logoColor=white" alt="React" />
  <img src="https://img.shields.io/badge/TypeScript-5.0-3178C6?style=for-the-badge&logo=typescript&logoColor=white" alt="TypeScript" />
  <img src="https://img.shields.io/badge/Tailwind-3.4-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white" alt="Tailwind" />
  <img src="https://img.shields.io/badge/Supabase-Cloud-3FCF8E?style=for-the-badge&logo=supabase&logoColor=white" alt="Supabase" />
  <img src="https://img.shields.io/badge/Stripe-Payments-635BFF?style=for-the-badge&logo=stripe&logoColor=white" alt="Stripe" />
</p>

<h1 align="center">🎮 Esport Arena</h1>

<p align="center">
  <strong>Plateforme de prédictions esport gamifiée avec système de clubs et récompenses</strong>
</p>

<p align="center">
  <a href="#-fonctionnalités">Fonctionnalités</a> •
  <a href="#-démo">Démo</a> •
  <a href="#-installation">Installation</a> •
  <a href="#-documentation">Documentation</a> •
  <a href="#-contribuer">Contribuer</a>
</p>

---

## 🎯 À Propos

**Esport Arena** est une plateforme de prédictions esport complète où les utilisateurs peuvent :

- 🎲 **Prédire** les résultats des matchs esport (LoL, CS2, Valorant, Dota2...)
- 🏆 **Gagner** des Arena Points et grimper dans les classements
- 👥 **Rejoindre** des clubs et participer à des guerres de clubs
- 🎖️ **Collectionner** des badges et débloquer des récompenses
- 💎 **Échanger** ses points contre des prix dans l'Arena Store

---

## ✨ Fonctionnalités

### 🎮 Prédictions

- Pariez sur les matchs esport en temps réel
- Cotes dynamiques et gains potentiels
- Historique complet des prédictions

### 🏅 Gamification

- **30+ badges** à débloquer (prédictions, victoires, séries, précision)
- **Système de niveaux** avec XP et récompenses
- **Défis quotidiens** pour des bonus XP
- **Classements hebdomadaires** avec récompenses

### 👥 Clubs

- Créez ou rejoignez un club
- **Chat en temps réel** avec réactions et mentions
- **Sondages** et votes communautaires
- **Guerres de clubs** : défiez d'autres clubs
- **Défis collectifs** : atteignez des objectifs en équipe
- **Modération** : mute, ban, logs, appels

### 💳 Monétisation

- **Arena Store** : échangez vos points contre des prix
- **Abonnements** : plans Free, Pro, Premium via Stripe
- **Renouvellement automatique** des avantages

### 🛡️ Administration

- Dashboard admin complet
- Gestion des utilisateurs et rôles
- Logs d'audit pour traçabilité
- Gestion des tickets support

---

## 🚀 Démo

> 🔗 **[Voir la démo en ligne](https://esport-arena.lovable.app)**

### Comptes de démonstration

| Utilisateur | Niveau | Spécialité               |
| ----------- | ------ | ------------------------ |
| DarkPhoenix | 30     | Top player, 70% win rate |
| FrostQueen  | 25     | Experte précision        |
| ThunderLord | 28     | Leader de club           |
| NeonBlade   | 22     | Prédicteur actif         |
| CyberWolf   | 8      | Débutant                 |

---

## 📦 Installation

### Prérequis

- Node.js v18+
- npm ou bun
- Compte Supabase (ou Docker pour local)

### Installation rapide

```bash
# Cloner le repository
git clone https://github.com/votre-username/esport-arena.git
cd esport-arena

# Installer les dépendances
npm install

# Configurer l'environnement
cp .env.example .env.local

# Lancer le serveur
npm run dev
```

### Configuration Supabase

1. Créez un projet sur [supabase.com](https://supabase.com)
2. Exécutez le script `docs/supabase-schema.sql` dans le SQL Editor
3. Configurez les variables d'environnement

> 📖 **[Guide d'installation complet](./docs/INSTALLATION.md)**

---

## 🛠️ Technologies

| Catégorie     | Technologies                           |
| ------------- | -------------------------------------- |
| **Frontend**  | React 18, TypeScript, Vite             |
| **Styling**   | Tailwind CSS, shadcn/ui, Framer Motion |
| **Backend**   | Supabase (PostgreSQL, Auth, Realtime)  |
| **Paiements** | Stripe (Subscriptions, Webhooks)       |
| **State**     | TanStack Query, React Context          |
| **Forms**     | React Hook Form, Zod                   |

---

## 📁 Structure du Projet

```
esport-arena/
├── docs/                    # Documentation
│   ├── INSTALLATION.md      # Guide d'installation
│   ├── CONTRIBUTING.md      # Guide de contribution
│   ├── CHANGELOG.md         # Historique des versions
│   └── supabase-schema.sql  # Schéma complet BDD
├── src/
│   ├── components/          # Composants React
│   ├── contexts/            # Contextes (Auth, Notifications)
│   ├── hooks/               # Custom hooks
│   ├── pages/               # Pages de l'application
│   └── lib/                 # Utilitaires
├── supabase/
│   ├── functions/           # Edge functions
│   └── config.toml          # Configuration
└── LICENSE                  # Licence MIT
```

---

## 📚 Documentation

| Document                                    | Description                         |
| ------------------------------------------- | ----------------------------------- |
| [📖 Installation](./docs/INSTALLATION.md)   | Guide d'installation locale complet |
| [🤝 Contribution](./docs/CONTRIBUTING.md)   | Guidelines pour contribuer          |
| [📋 Changelog](./docs/CHANGELOG.md)         | Historique des versions             |
| [🗄️ Schéma BDD](./docs/supabase-schema.sql) | Script SQL complet avec seed data   |

---

## 🤝 Contribuer

Les contributions sont les bienvenues ! Consultez notre [guide de contribution](./docs/CONTRIBUTING.md).

```bash
# Fork le repo
# Créez votre branche
git checkout -b feature/ma-feature

# Committez vos changements
git commit -m "feat: ajout de ma feature"

# Push et créez une PR
git push origin feature/ma-feature
```

---

## 📊 Statistiques du Projet

- **35+ tables** PostgreSQL avec RLS
- **20+ fonctions** database
- **6 Edge Functions** Supabase
- **30+ badges** à débloquer
- **10 défis** quotidiens
- **5 clubs** de démonstration
- **100+ prédictions** de seed data

---

## 📄 Licence

Ce projet est sous licence MIT. Voir le fichier [LICENSE](./LICENSE) pour plus de détails.

---

## 🙏 Remerciements

- [Supabase](https://supabase.com) - Backend as a Service
- [shadcn/ui](https://ui.shadcn.com) - Composants UI
- [Tailwind CSS](https://tailwindcss.com) - Framework CSS
- [Stripe](https://stripe.com) - Paiements
- [Lovable](https://lovable.dev) - Plateforme de développement

---

<p align="center">
  Made with ❤️ by the Esport Arena Team
</p>
