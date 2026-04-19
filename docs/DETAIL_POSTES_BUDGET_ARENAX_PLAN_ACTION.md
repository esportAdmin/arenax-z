# Detail Des Postes Budgetaires Arena-X

Document complementaire au budget de publication  
Marche cible : Etats-Unis  
Produit : plateforme de retention pour communautes gaming structurees  
Audience : admins Discord, createurs Twitch, operateurs de communautes gaming  
Date : 11 avril 2026

## Objectif

Ce document explique chaque poste de budget en rapport direct avec Arena-X : a quoi il sert, pourquoi il existe, quand l'activer, quels risques il couvre, et quelles actions mener.

Arena-X doit etre finance comme un outil SaaS de retention communautaire, pas comme une application de betting. Le budget sert donc a rendre fiables :

- la connexion Discord/Twitch
- le dashboard communautaire
- les clubs
- la war map
- les live calls non financiers
- les rewards non cash
- les profils
- les analytics de retention
- le support admins

## Synthese Prioritaire

| Priorite | Poste | Role pour Arena-X | Moment d'activation |
|---|---|---|---|
| P0 | Vercel | Publier l'application Next.js | Preview privee |
| P0 | Supabase | Auth, profils, clubs, donnees produit | Preview privee |
| P0 | OAuth Discord/Twitch | Point d'entree principal | Preview privee |
| P0 | Lemon Squeezy | Abonnements SaaS et merchant of record | Avant premier client payant |
| P1 | Domaine + email pro | Credibilite commerciale | Avant outreach serieux |
| P1 | Legal non-betting | Eviter toute confusion avec jeux d'argent | Avant lancement public |
| P1 | Monitoring | Detecter erreurs auth/API | Preview avancee |
| P1 | Analytics retention | Mesurer activation et retour | Preview avancee |
| P2 | Marketing | Acquerir admins Discord/Twitch | Apres preview stable |

## 1. Infrastructure Et Outils Mensuels

### En quoi cela consiste

Ce poste regroupe les outils qui permettent a Arena-X d'etre disponible, fiable, mesurable et exploitable chaque mois :

- hebergement applicatif
- backend
- base de donnees
- authentification
- monitoring
- analytics
- email transactionnel
- email professionnel
- marge de securite pour les pics d'usage

### Role concret dans Arena-X

Ce budget finance :

- la landing page
- la page login Discord/Twitch
- le dashboard
- les clubs
- la war map
- le leaderboard
- les profils
- les rewards
- les routes API
- les callbacks OAuth
- la persistance des profils et clubs

### Budget recommande

| Etape | Budget mensuel |
|---|---:|
| Preview privee | 70 a 150 dollars |
| Lancement public propre | 180 a 300 dollars |
| Croissance early | 400 a 1,000 dollars |

### Plan d'action

1. Activer Vercel Pro.
2. Activer Supabase Pro.
3. Garder Resend, Sentry et PostHog en free au debut.
4. Ajouter une marge de 50 a 150 dollars pour usage imprevu.
5. Revoir les couts chaque semaine pendant les 30 premiers jours apres lancement.

### Risques si on sous-budgete

- site lent ou indisponible
- erreurs OAuth non detectees
- base de donnees limitee
- impossible de comprendre pourquoi les utilisateurs partent
- mauvaise impression pour les premiers clients

## 2. Vercel

### En quoi cela consiste

Vercel heberge l'application Next.js. C'est le service qui rend accessibles :

- la landing page
- le login
- les pages dashboard
- les routes App Router
- les routes API Next.js
- les previews de deploiement

### Role concret dans Arena-X

Arena-X utilise Next.js. Vercel permet :

- de deployer rapidement
- d'avoir des previews a chaque branche
- de tester avant production
- de connecter le domaine final
- de gerer le SSL automatiquement

### Budget

| Cas | Budget |
|---|---:|
| 1 personne qui deploie | 20 dollars / mois |
| 2 personnes qui deploient | 40 dollars / mois |
| Usage plus important | 20 dollars + overages |

### Plan d'action

1. Importer le repo dans Vercel.
2. Configurer les variables Preview.
3. Configurer les variables Production.
4. Faire un premier deploiement Preview.
5. Tester OAuth Discord/Twitch sur la preview.
6. Ajouter le domaine final seulement apres validation.

### A surveiller

- erreurs de build
- variables manquantes
- callbacks OAuth non alignes
- usage qui depasse les credits
- plusieurs seats qui augmentent la facture

## 3. Supabase

### En quoi cela consiste

Supabase est le backend principal :

- base PostgreSQL
- authentification
- OAuth Discord/Twitch
- profils
- clubs
- leaderboard
- progression
- rewards
- edge functions
- realtime si utilise

### Role concret dans Arena-X

Supabase porte les elements critiques :

- creation de session apres login Discord/Twitch
- creation ou mise a jour du profil
- stockage des clubs
- progression utilisateur
- donnees de war map
- donnees de leaderboard
- statut d'abonnement si synchronise

### Budget

| Etape | Supabase |
|---|---:|
| Dev local | Free possible |
| Preview serieuse | Pro recommande |
| Production | Pro minimum |
| Croissance | Pro + overages |

### Plan d'action

1. Verifier le projet Supabase de production.
2. Configurer Auth URL avec le domaine preview.
3. Ajouter les Redirect URLs localhost, preview et production.
4. Activer Discord.
5. Activer Twitch.
6. Verifier les policies RLS.
7. Tester `bootstrap-profile`.
8. Tester un compte Discord complet.
9. Tester un compte Twitch complet.

### Risques si mal configure

- boucle de login
- session creee mais profil absent
- dashboard inaccessible
- page profile/rewards qui renvoie vers auth
- donnees invisibles a cause des RLS

## 4. OAuth Discord Et Twitch

### En quoi cela consiste

OAuth Discord/Twitch est le systeme d'entree principal. Les futurs clients sont deja dans Discord et Twitch, donc l'app doit utiliser ces identites comme entree naturelle.

### Role concret dans Arena-X

Discord sert surtout pour :

- admins de serveurs
- communautes gaming structurees
- roles, clubs, clans, staffs

Twitch sert surtout pour :

- createurs
- audiences live
- communautes autour du stream
- operators qui veulent augmenter le retour apres live

### Budget

Pas de cout direct majeur, mais c'est un poste critique en temps de configuration et QA.

### Plan d'action

1. Creer ou verifier l'app Discord Developer.
2. Ajouter les redirect URLs preview et prod.
3. Creer ou verifier l'app Twitch Developer.
4. Ajouter les redirect URLs preview et prod.
5. Configurer les providers dans Supabase.
6. Tester Discord sur preview.
7. Tester Twitch sur preview.
8. Tester les retours vers `/dashboard`.
9. Tester une URL avec redirect, par exemple `/login?redirect=/clubs`.

### Critere de validation

Un utilisateur doit pouvoir :

1. arriver sur `/login`
2. cliquer Discord ou Twitch
3. autoriser l'app
4. revenir dans Arena-X
5. arriver sur `/dashboard`
6. ouvrir `/clubs`, `/war-map`, `/profile`, `/rewards`

## 5. Lemon Squeezy

### En quoi cela consiste

Lemon Squeezy gere les paiements et peut agir comme merchant of record. Cela simplifie :

- paiement
- taxes
- VAT
- sales tax
- facturation
- abonnements
- certains risques de paiement

### Role concret dans Arena-X

Lemon Squeezy doit vendre des abonnements aux admins et operateurs de communautes, pas aux joueurs individuels.

Exemples de clients :

- serveur Discord gaming avec 500 membres
- createur Twitch avec communaute active
- club esport amateur
- communaute competitive
- reseau de serveurs gaming

### Budget

Hypothese prudente pour abonnements :

```text
5.5% + 0.50 dollar par paiement mensuel
```

### Plans recommandes

| Plan | Cible | Prix |
|---|---|---:|
| Starter | petit serveur structure | 29 dollars / mois |
| Growth | serveur actif ou createur mid-size | 79 dollars / mois |
| Pro | communaute serieuse avec staff | 149 dollars / mois |
| Elite | organisation ou gros serveur | 299 dollars / mois |

### Plan d'action

1. Creer le compte Lemon Squeezy.
2. Configurer la boutique US.
3. Creer les produits Starter, Growth, Pro, Elite.
4. Creer les variantes mensuelles.
5. Creer eventuellement les variantes annuelles.
6. Configurer les webhooks.
7. Relier le statut d'abonnement a Arena-X.
8. Tester achat sandbox.
9. Tester annulation.
10. Tester paiement echoue.

### Risques

- mauvais positionnement percu comme cash game
- plans trop bas qui attirent des clients peu rentables
- absence de lien clair entre abonnement et valeur admin
- webhook mal configure
- statut premium non synchronise

## 6. Email Transactionnel

### En quoi cela consiste

Email transactionnel = messages automatiques ou semi-automatiques envoyes par l'application.

Pour Arena-X :

- support
- confirmations
- messages admin
- alertes critiques
- onboarding client
- facturation si necessaire

### Role concret dans Arena-X

Comme le produit est Discord/Twitch-first, l'email n'est pas le coeur de l'auth. Mais il reste utile pour :

- support client
- emails aux admins
- relances commerciales
- onboarding B2B
- alertes compte

### Budget

| Etape | Budget |
|---|---:|
| Preview | 0 dollar |
| Lancement | 0 a 20 dollars |
| Croissance | 20 dollars et plus |

### Plan d'action

1. Garder Resend Free au depart.
2. Configurer un domaine email propre.
3. Ajouter SPF, DKIM, DMARC.
4. Creer `support@domaine.com`.
5. Creer des templates sobres.
6. Ne pas envoyer de spam marketing au debut.

## 7. Monitoring Erreurs

### En quoi cela consiste

Le monitoring detecte les erreurs que les utilisateurs rencontrent.

Pour Arena-X, les erreurs critiques sont :

- echec login Discord
- echec login Twitch
- boucle auth
- dashboard inaccessible
- profil absent
- rewards casses
- API qui renvoie 500
- war map qui ne charge pas

### Budget

| Etape | Outil | Budget |
|---|---|---:|
| Preview | logs Vercel + Sentry Free | 0 dollar |
| Public launch | Sentry Free ou Team | 0 a 29 dollars |
| Croissance | Sentry Team | 29 dollars et plus |

### Plan d'action

1. Demarrer avec logs Vercel.
2. Ajouter Sentry avant lancement public.
3. Taguer les erreurs auth.
4. Taguer les erreurs payment.
5. Taguer les erreurs profile bootstrap.
6. Verifier tous les jours pendant la premiere semaine.

## 8. Analytics Produit

### En quoi cela consiste

Les analytics produit mesurent si Arena-X augmente vraiment la retention.

### Role concret dans Arena-X

Il faut mesurer :

- arrivees sur landing
- ouvertures de `/login`
- login Discord/Twitch termine
- arrivees dashboard
- ouvertures clubs
- consultation war map
- retour J1
- retour J7
- ouverture rewards
- creation ou configuration communaute

### Budget

| Etape | Budget |
|---|---:|
| Preview | 0 dollar |
| Lancement | 0 dollar |
| Croissance | 50 a 300 dollars selon volume |

### Plan d'action

1. Installer analytics apres preview stable.
2. Ne pas tout tracker.
3. Tracker les evenements de retention :
   - `login_started`
   - `login_completed`
   - `dashboard_viewed`
   - `club_viewed`
   - `war_map_viewed`
   - `reward_viewed`
   - `return_day_1`
   - `return_day_7`
4. Creer un dashboard activation.
5. Creer un dashboard retention.

## 9. Domaine

### En quoi cela consiste

Le domaine est l'adresse officielle du produit.

Exemples :

- arenax.gg
- arena-x.gg
- arenax.community
- arenax.app

### Role concret dans Arena-X

Le domaine est important pour :

- credibilite
- OAuth callbacks
- emails pro
- landing commerciale
- support
- confiance admins

### Budget

| Type domaine | Budget annuel |
|---|---:|
| .com classique | 12 a 30 dollars |
| .app | 15 a 40 dollars |
| .gg | souvent plus cher |
| .io | souvent plus cher |

### Plan d'action

1. Choisir un domaine simple.
2. Eviter les noms trop proches d'une marque existante.
3. Acheter le domaine.
4. Connecter a Vercel.
5. Mettre le domaine dans Supabase Site URL.
6. Ajouter callbacks Discord/Twitch.

## 10. Email Professionnel

### En quoi cela consiste

Email pro = adresses de contact officielles.

Pour Arena-X :

- support@domaine.com
- hello@domaine.com
- billing@domaine.com
- founder@domaine.com

### Role concret dans Arena-X

Les admins Discord/Twitch vont juger la credibilite. Un email domaine inspire plus confiance qu'un email personnel.

### Budget

| Outil | Budget |
|---|---:|
| Google Workspace Starter | environ 7 dollars / utilisateur / mois |
| Alternative email pro | 5 a 15 dollars / utilisateur / mois |

### Plan d'action

1. Creer `support@...`.
2. Creer `hello@...`.
3. Configurer SPF/DKIM/DMARC.
4. Utiliser cet email pour Lemon Squeezy, Vercel, Supabase et support client.

## 11. Legal Et Conformite

### En quoi cela consiste

Ce poste couvre les documents et la relecture pour eviter une mauvaise interpretation du produit.

Pour Arena-X, c'est important parce que certains mots peuvent faire penser a :

- betting
- gambling
- wager
- cash prize
- odds
- payout
- stake

### Role concret dans Arena-X

Il faut proteger le positionnement :

- outil de retention
- outil de communaute
- progression non financiere
- rewards non cash
- pas de pari
- pas de gain d'argent

### Budget

| Poste | Budget |
|---|---:|
| Terms simples | 300 a 1,500 dollars |
| Privacy Policy | 300 a 1,500 dollars |
| Cookie Policy | 100 a 500 dollars |
| Relecture non-betting | 500 a 3,000 dollars |
| Package legal US plus serieux | 2,000 a 7,500 dollars et plus |

### Plan d'action

1. Finaliser le wording non-betting dans l'app.
2. Faire relire Terms et Privacy.
3. Ajouter un paragraphe clair :
   - pas de wagering
   - pas de cash prize
   - pas de betting
   - rewards = perks/progression/community benefits
4. Verifier les pages publiques.
5. Verifier les textes Lemon Squeezy.

## 12. Marketing Initial

### En quoi cela consiste

Marketing initial = acquisition des premiers admins de communautes.

Pour Arena-X, je ne conseille pas de commencer par du paid ads massif. La meilleure approche est la vente directe et l'outreach qualifie.

### Cibles

- serveurs Discord gaming de 500 a 10,000 membres
- createurs Twitch mid-size
- communautes competitives
- clans/guildes
- clubs esport amateurs
- community managers gaming

### Budget

| Action | Budget |
|---|---:|
| Outreach manuel | 0 a 300 dollars |
| Video demo courte | 0 a 500 dollars |
| Sponsoring micro-createurs | 100 a 1,000 dollars |
| Paid ads test | 300 a 1,500 dollars |

### Plan d'action

1. Ne pas lancer de grosses pubs tout de suite.
2. Faire une liste de 100 serveurs Discord cibles.
3. Identifier 30 createurs Twitch mid-size.
4. Contacter manuellement 10 prospects par jour.
5. Proposer une preview privee.
6. Offrir 30 jours gratuits aux 10 premiers serveurs.
7. Mesurer l'usage et les retours.
8. Transformer les meilleurs en clients payants.

## 13. Support Client

### En quoi cela consiste

Le support client couvre les questions et problemes des admins.

Pour Arena-X, les sujets probables :

- connexion Discord
- connexion Twitch
- configuration serveur
- comprehension des clubs
- abonnement Lemon Squeezy
- rewards
- suppression de compte

### Budget

| Etape | Budget |
|---|---:|
| Preview | 0 dollar |
| Lancement | 0 a 50 dollars |
| Croissance | 50 a 200 dollars |

### Plan d'action

1. Creer une adresse support.
2. Ajouter une FAQ.
3. Creer un canal Discord support prive.
4. Documenter les 10 questions recurrentes.
5. Ne pas acheter un gros outil support au depart.

## 14. Reserve Usage Et Imprevus

### En quoi cela consiste

Ce poste couvre les depassements :

- Vercel usage
- Supabase usage
- emails
- monitoring
- analytics
- outils supplementaires

### Budget

```text
50 a 150 dollars par mois au lancement
100 a 250 dollars par mois en croissance
```

### Plan d'action

1. Definir un plafond de depense Vercel.
2. Suivre Supabase chaque semaine.
3. Mettre une alerte budget.
4. Eviter les features realtime trop couteuses avant validation client.

## 15. Plan D'Action Global 90 Jours

| Periode | Objectif | Actions |
|---|---|---|
| Jours 1 a 15 | Preview technique | Vercel preview, variables, Supabase redirects, OAuth Discord/Twitch, dashboard, clubs, war map, profile, rewards |
| Jours 16 a 30 | Preview produit | Inviter 5 a 10 admins, observer blocages, corriger onboarding, verifier wording non-betting |
| Jours 31 a 45 | Paiement | Lemon Squeezy, plans, webhooks, abonnement, annulation, statut premium |
| Jours 46 a 60 | Legal et confiance | Terms, Privacy, cookies, relecture non-betting, domaine, email pro |
| Jours 61 a 90 | Acquisition | 100 communautes cibles, 10 prospects par jour, calls demo, premiers clients payants |

## 16. Ordre De Priorite Recommande

### A payer maintenant

- Vercel Pro
- Supabase Pro
- domaine
- email pro minimum

### A activer apres preview stable

- Lemon Squeezy
- monitoring avance
- analytics produit
- legal review

### A activer apres premiers signaux clients

- paid ads
- outil support avance
- monitoring payant
- analytics payant
- videos marketing plus produites

## Conclusion

Le budget de Arena-X doit etre pense comme celui d'un outil SaaS B2B/prosumer pour operateurs de communautes.

Le vrai levier de rentabilite n'est pas le volume gratuit. Le vrai levier est d'obtenir des communautes structurees qui paient parce que Arena-X augmente :

- l'activite
- la retention
- la fidelite
- le prestige
- la participation
- la valeur percue du serveur

La sequence la plus saine :

1. preview privee
2. OAuth solide
3. premiers admins testeurs
4. Lemon Squeezy
5. legal non-betting
6. lancement public limite
7. acquisition manuelle
8. paid ads seulement apres validation

## Sources A Reverifier

- Lemon Squeezy pricing: https://www.lemonsqueezy.com/pricing
- Lemon Squeezy fees: https://docs.lemonsqueezy.com/help/getting-started/fees
- Lemon Squeezy subscriptions: https://docs.lemonsqueezy.com/help/products/subscriptions
- Vercel pricing: https://vercel.com/pricing
- Vercel Pro plan: https://vercel.com/docs/plans/pro
- Supabase billing: https://supabase.com/docs/guides/platform/billing-on-supabase
- Supabase Edge Functions pricing: https://supabase.com/docs/guides/functions/pricing
- Resend pricing: https://resend.com/pricing
