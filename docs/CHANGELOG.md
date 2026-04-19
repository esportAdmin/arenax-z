# 📋 Changelog - Esport Arena

Toutes les modifications notables de ce projet sont documentées dans ce fichier.

Le format est basé sur [Keep a Changelog](https://keepachangelog.com/fr/1.1.0/),
et ce projet adhère au [Semantic Versioning](https://semver.org/lang/fr/).

---

## [Unreleased]

### 🔜 À Venir

- Intégration API PandaScore pour matchs live
- Système de notifications push
- Mode sombre/clair amélioré
- Application mobile (PWA)

---

## [1.0.0] - 2025-01-03

### ✨ Ajouté

#### Core Features

- **Système de prédictions** : Parier des Arena Points sur les matchs esport
- **Profils utilisateurs** : Niveaux, XP, statistiques, badges
- **Classements** : Hebdomadaires avec récompenses automatiques
- **Système de clubs** : Créer/rejoindre des clubs, chat en temps réel

#### Gamification

- **30+ badges** : Prédictions, victoires, séries, précision, engagement
- **Défis quotidiens** : 10 défis avec récompenses XP
- **Récompenses de niveau** : 11 paliers de récompenses
- **Récompenses hebdomadaires** : Top 100 récompensé

#### Clubs

- **Gestion des membres** : Rôles (owner, admin, moderator, member)
- **Chat en temps réel** : Messages, réactions, mentions, épingles
- **Sondages** : Créer des sondages dans les clubs
- **Guerres de clubs** : Défis entre clubs avec récompenses
- **Défis collectifs** : 10 templates de défis d'équipe
- **Modération** : Mute, ban, logs de modération, appels

#### Monétisation

- **Arena Store** : 12 prix échangeables contre des Arena Points
- **Abonnements Lemon Squeezy** : Plans communautaires Free, Starter, Pro, Elite
- **Webhook Lemon Squeezy** : Renouvellement automatique des abonnements communautaires

#### Administration

- **Dashboard admin** : Gestion utilisateurs, prix, analytics
- **Audit logs** : Traçabilité des actions admin
- **Support** : Gestion des tickets de support

#### Technique

- **Edge Functions + API billing** : check-subscription, app/api/billing/checkout, lemon-squeezy-webhook, pandascore-matches, send-support-status
- **35+ tables** avec RLS policies
- **20+ fonctions PostgreSQL**
- **Données de seed complètes** : Badges, clubs, utilisateurs démo

### 🔒 Sécurité

- Row Level Security (RLS) sur toutes les tables
- Authentification Supabase
- Secrets gérés via Supabase Secrets
- Validation des entrées utilisateur

---

## [0.9.0] - 2024-12-20

### ✨ Ajouté

- Système de modération avancé (mute, ban, appels)
- Notifications pour guerres de clubs
- Logs de modération avec historique
- Détection des récidivistes

### 🔧 Modifié

- Amélioration des performances du chat
- Refactoring des hooks de clubs

### 🐛 Corrigé

- Fix du compteur de membres lors du ban
- Fix des notifications de mention

---

## [0.8.0] - 2024-12-15

### ✨ Ajouté

- Guerres de clubs (défis entre clubs)
- Défis collectifs pour les clubs
- Contributions aux défis par membre
- Classements hebdomadaires des clubs

### 🔧 Modifié

- Amélioration du système XP des clubs
- Refactoring des récompenses

---

## [0.7.0] - 2024-12-10

### ✨ Ajouté

- Sondages dans les clubs
- Votes multiples et anonymes
- Fermeture automatique des sondages
- Notifications de nouveaux sondages

### 🐛 Corrigé

- Fix de l'affichage des réactions
- Fix du scroll du chat

---

## [0.6.0] - 2024-12-05

### ✨ Ajouté

- Chat de club en temps réel
- Réactions aux messages (emojis)
- Réponses aux messages
- Messages épinglés
- Mentions (@utilisateur)

### 🔧 Modifié

- Migration vers Supabase Realtime
- Optimisation des requêtes

---

## [0.5.0] - 2024-11-28

### ✨ Ajouté

- Système de clubs complet
- Demandes d'adhésion pour clubs privés
- Rôles et permissions
- Activités de club

### 🔧 Modifié

- Refactoring de l'authentification
- Amélioration du dashboard

---

## [0.4.0] - 2024-11-20

### ✨ Ajouté

- Arena Store avec prix échangeables
- Système d'échange de prix
- Historique des échanges
- Gestion admin des prix

### 🐛 Corrigé

- Fix du calcul du solde Arena Points

---

## [0.3.0] - 2024-11-15

### ✨ Ajouté

- Intégration Lemon Squeezy pour abonnements
- Edge functions pour paiements
- Gestion client Lemon Squeezy
- Webhook pour renouvellements

### 🔒 Sécurité

- Validation des webhooks Lemon Squeezy
- Gestion sécurisée des secrets

---

## [0.2.0] - 2024-11-08

### ✨ Ajouté

- Système de badges (30+ badges)
- Défis quotidiens
- Récompenses de niveau
- Classements hebdomadaires
- Notifications in-app

### 🔧 Modifié

- Amélioration du calcul XP
- Refactoring des hooks

---

## [0.1.0] - 2024-11-01

### ✨ Ajouté

- Setup initial du projet
- Authentification Supabase
- Système de prédictions basique
- Profils utilisateurs
- Dashboard principal
- Landing page
- Pages légales (CGU, Confidentialité)

### 🔧 Technique

- Configuration Vite + React + TypeScript
- Setup Tailwind CSS + shadcn/ui
- Intégration Supabase
- Structure de projet

---

## Légende

- ✨ **Ajouté** : Nouvelles fonctionnalités
- 🔧 **Modifié** : Changements dans les fonctionnalités existantes
- 🗑️ **Supprimé** : Fonctionnalités supprimées
- 🐛 **Corrigé** : Corrections de bugs
- 🔒 **Sécurité** : Corrections de vulnérabilités
- ⚠️ **Déprécié** : Fonctionnalités qui seront supprimées

---

## Liens

- [Documentation](./INSTALLATION.md)
- [Guide de contribution](./CONTRIBUTING.md)
- [Schéma de base de données](./supabase-schema.sql)
