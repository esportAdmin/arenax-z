# Budget De Publication Arena-X

Marche cible : Etats-Unis  
Produit : plateforme de retention pour communautes gaming structurees  
Audience principale : admins de serveurs Discord, createurs Twitch, operateurs de communautes gaming  
Paiement : Lemon Squeezy, Etats-Unis  
Date : 10 avril 2026

## Resume Executif

Arena-X peut etre publie avec un budget mensuel lean mais serieux d'environ **180 a 300 dollars par mois**, hors marketing payant.

Pour un premier lancement public, l'enveloppe recommandee est :

| Poste | Fourchette recommandee |
|---|---:|
| Infrastructure et outils mensuels | 180 a 300 dollars / mois |
| Budget operationnel des 3 premiers mois | 500 a 900 dollars |
| Setup legal et conformite | 1,000 a 3,000 dollars |
| Tests marketing initiaux | 500 a 1,500 dollars |
| Total recommande sur 3 mois | 2,300 a 5,300 dollars |
| Budget cash 12 mois lean | 12,000 a 15,000 dollars |
| Budget cash 12 mois realiste | 18,000 a 25,000 dollars |

Le point business le plus important : Arena-X ne doit pas etre positionne comme un produit de prediction, fantasy, betting ou gain d'argent. Le positionnement le plus solide est :

> Arena-X est une plateforme de retention pour communautes gaming structurees.

Arena-X aide les communautes Discord et Twitch a augmenter l'activite, la fidelite, le retour utilisateur, le prestige et la participation structuree.

## Hypotheses De Positionnement Produit

Arena-X est :

- une plateforme de retention communautaire
- une couche d'operation pour serveurs gaming structures
- un produit Discord-first et Twitch-second
- un systeme de progression, prestige, clubs et engagement
- un outil pour admins et operateurs, pas une application de betting grand public

Arena-X n'est pas :

- un produit de jeu d'argent
- un produit de pari
- une plateforme de prediction avec argent reel
- une plateforme fantasy avec cash prize
- une plateforme de cotes de paris

Cette distinction est importante pour :

- l'exposition legale
- le wording
- le pricing
- les clients cibles
- la validation par le prestataire de paiement
- les canaux marketing
- la defensabilite long terme

## Budget Mensuel Operationnel Recommande

| Service | Recommandation lancement | Cout mensuel estime |
|---|---:|---:|
| Hebergement Vercel | Plan Pro | 20 dollars |
| Supabase backend, auth, base de donnees | Plan Pro | 25 dollars minimum |
| Lemon Squeezy | Pas de frais fixe ecommerce | 0 dollar + frais de transaction |
| Email transactionnel | Resend Free, puis Pro | 0 a 20 dollars |
| Monitoring erreurs | Sentry Free, puis Team | 0 a 29 dollars |
| Analytics produit | PostHog Free au lancement | 0 dollar |
| Email professionnel | Google Workspace Starter ou equivalent | 7 a 15 dollars par utilisateur |
| Domaine | Cout annuel reparti au mois | 1 a 5 dollars |
| Buffer usage et securite | Reserve recommandee | 50 a 150 dollars |

Budget mensuel recommande :

| Etape | Budget mensuel |
|---|---:|
| Preview privee | 70 a 150 dollars |
| Lancement public serieux | 180 a 300 dollars |
| Croissance early | 400 a 1,000 dollars et plus |

Budget de depart conseille :

> Prevoir **250 dollars par mois** avant marketing payant.

## Modele De Cout Lemon Squeezy

Lemon Squeezy est utile parce qu'il peut agir comme merchant of record. Cela simplifie la gestion des taxes, VAT et sales tax par rapport a une gestion directe.

Pour la planification, utiliser :

```text
5.5% + 0.50 dollar par paiement mensuel d'abonnement
```

Cette hypothese inclut le cout ecommerce public plus une hypothese prudente de frais d'abonnement.

Des frais additionnels peuvent s'appliquer pour :

- cartes internationales
- PayPal
- conversion de devise
- certains moyens de paiement specifiques

### Revenu Net Par Plan

| Plan | Prix client | Frais Lemon estimes | Net avant infrastructure |
|---|---:|---:|---:|
| Starter | 29 dollars / mois | 2.10 dollars | 26.90 dollars |
| Growth | 79 dollars / mois | 4.85 dollars | 74.15 dollars |
| Pro | 149 dollars / mois | 8.70 dollars | 140.30 dollars |
| Elite | 299 dollars / mois | 16.95 dollars | 282.05 dollars |

Lemon Squeezy coute plus cher qu'un processeur carte brut, mais pour une petite equipe il peut valoir le cout parce qu'il reduit la complexite operationnelle.

## Pricing SaaS Recommande

Arena-X doit etre vendu aux operateurs de communautes, pas aux joueurs individuels.

| Plan | Client cible | Prix recommande |
|---|---|---:|
| Starter | Petit serveur gaming structure | 29 dollars / mois |
| Growth | Serveur actif ou createur Twitch mid-size | 79 dollars / mois |
| Pro | Communaute serieuse avec staff et evenements recurrents | 149 dollars / mois |
| Elite | Organisation, reseau de createurs ou communaute multi-serveurs | 299 dollars / mois |
| Setup | Onboarding premium optionnel | 199 a 499 dollars one-shot |

Je ne conseille pas de descendre sous 29 dollars par mois. En dessous, les frais de paiement, le support et l'onboarding rendent le modele plus difficile a tenir.

## Analyse Du Seuil De Rentabilite

En supposant un cout mensuel operationnel d'environ **250 dollars** :

| Plan moyen | Net apres Lemon | Clients necessaires pour couvrir 250 dollars |
|---|---:|---:|
| Starter a 29 dollars | 26.90 dollars | 10 clients |
| Growth a 79 dollars | 74.15 dollars | 4 clients |
| Pro a 149 dollars | 140.30 dollars | 2 clients |
| ARPA mixte autour de 90 dollars | Environ 84 dollars | 3 clients |

Avec marketing leger et outils autour de **750 dollars de cout mensuel total** :

- environ 10 clients Growth couvrent le mois
- environ 6 clients Pro couvrent le mois
- une base mixte de 12 a 15 communautes serieuses peut devenir viable

## Scenario A : Preview Privee

Budget pour une preview non publique avec testeurs selectionnes.

| Poste | Cout estime |
|---|---:|
| Vercel Pro | 20 dollars |
| Supabase Pro | 25 dollars |
| Lemon Squeezy | 0 dollar fixe |
| Email | 0 dollar |
| Sentry | 0 dollar |
| PostHog | 0 dollar |
| Domaine moyenne mensuelle | 2 dollars |
| Buffer usage | 25 dollars |
| Total | Environ 72 dollars / mois |

Cette etape sert a valider :

- login Discord
- login Twitch
- bootstrap profil
- onboarding
- dashboard
- clubs
- war map
- leaderboard
- rewards
- wording conforme

## Scenario B : Lancement Public Propre

| Poste | Cout estime |
|---|---:|
| Vercel Pro | 20 dollars |
| Supabase Pro et premier usage | 25 a 75 dollars |
| Resend Pro ou equivalent | 0 a 20 dollars |
| Sentry Team ou equivalent | 0 a 29 dollars |
| PostHog Free | 0 dollar |
| Email professionnel | 7 a 15 dollars |
| Domaine moyenne mensuelle | 2 dollars |
| Buffer usage | 50 dollars |
| Total | Environ 104 a 211 dollars / mois |

Nombre de planification recommande :

> **200 a 250 dollars par mois**

## Scenario C : Croissance Early

| Poste | Cout estime |
|---|---:|
| Vercel | 20 a 100 dollars |
| Supabase | 75 a 300 dollars |
| Email | 20 a 50 dollars |
| Monitoring | 29 a 80 dollars |
| Analytics | 0 a 150 dollars |
| Support et outils | 20 a 100 dollars |
| Buffer usage | 100 a 250 dollars |
| Total | Environ 264 a 1,030 dollars / mois |

Cette etape commence quand :

- plusieurs communautes sont actives chaque semaine
- OAuth Discord/Twitch est utilise quotidiennement
- war map et pages clubs ont du trafic reel
- les demandes support apparaissent
- les abonnements sont actifs

## Projection 12 Mois : Scenario Realiste

Hypotheses :

- Starter : 29 dollars
- Growth : 79 dollars
- Pro : 149 dollars
- frais Lemon Squeezy estimes a 5.5% + 0.50 dollar
- marketing progressif
- infrastructure qui augmente avec l'usage

| Mois | Mix clients | MRR brut | Frais Lemon | Infra/Ops | Marketing | Resultat mensuel |
|---:|---|---:|---:|---:|---:|---:|
| M1 | 0 client | 0 dollar | 0 dollar | 175 dollars | 0 dollar | -175 dollars |
| M2 | 0 client | 0 dollar | 0 dollar | 200 dollars | 200 dollars | -400 dollars |
| M3 | 5 Starter | 145 dollars | 10 dollars | 225 dollars | 300 dollars | -390 dollars |
| M4 | 8 Starter, 2 Growth | 390 dollars | 26 dollars | 250 dollars | 400 dollars | -286 dollars |
| M5 | 10 Starter, 5 Growth, 1 Pro | 834 dollars | 54 dollars | 275 dollars | 500 dollars | +5 dollars |
| M6 | 15 Starter, 8 Growth, 2 Pro | 1,365 dollars | 88 dollars | 300 dollars | 600 dollars | +377 dollars |
| M7 | 20 Starter, 12 Growth, 3 Pro | 1,975 dollars | 126 dollars | 350 dollars | 800 dollars | +699 dollars |
| M8 | 25 Starter, 16 Growth, 5 Pro | 2,734 dollars | 173 dollars | 400 dollars | 1,000 dollars | +1,161 dollars |
| M9 | 30 Starter, 20 Growth, 7 Pro | 3,493 dollars | 221 dollars | 500 dollars | 1,200 dollars | +1,572 dollars |
| M10 | 35 Starter, 25 Growth, 10 Pro | 4,480 dollars | 281 dollars | 600 dollars | 1,500 dollars | +2,099 dollars |
| M11 | 40 Starter, 30 Growth, 12 Pro | 5,318 dollars | 333 dollars | 700 dollars | 1,800 dollars | +2,485 dollars |
| M12 | 50 Starter, 35 Growth, 15 Pro | 6,450 dollars | 405 dollars | 800 dollars | 2,200 dollars | +3,045 dollars |

Lecture :

- rentabilite mensuelle autour de M5
- rentabilite cumulee autour de M8
- sortie M12 autour de 6,450 dollars de MRR
- resultat operationnel mensuel M12 autour de 3,000 dollars avant impots, salaires, support lourd et legal/compta avances

## Projection 12 Mois : Scenario Prudent

| Mois | MRR brut | Resultat mensuel |
|---:|---:|---:|
| M1 | 0 dollar | -100 dollars |
| M2 | 0 dollar | -250 dollars |
| M3 | 87 dollars | -319 dollars |
| M4 | 224 dollars | -316 dollars |
| M5 | 390 dollars | -286 dollars |
| M6 | 664 dollars | -156 dollars |
| M7 | 1,087 dollars | +91 dollars |
| M8 | 1,510 dollars | +362 dollars |
| M9 | 1,962 dollars | +635 dollars |
| M10 | 2,414 dollars | +908 dollars |
| M11 | 2,945 dollars | +1,256 dollars |
| M12 | 3,476 dollars | +1,503 dollars |

Lecture :

- meme une trajectoire plus lente peut devenir rentable mensuellement pendant la premiere annee
- le vrai challenge n'est pas le cout infrastructure
- le vrai challenge est d'acquerir des communautes structurees qui comprennent la valeur retention

## Frais Ponctuels Avant Lancement

| Poste | Lean | Recommande |
|---|---:|---:|
| Domaine | 15 a 80 dollars | 30 a 100 dollars |
| Relecture legale positionnement non-betting | 500 dollars | 1,500 a 5,000 dollars |
| Terms, Privacy, Cookie Policy | 300 dollars | 1,000 a 3,000 dollars |
| Branding, video demo, assets lancement | 0 a 300 dollars | 500 a 1,500 dollars |
| Setup Vercel, Supabase, OAuth | temps interne | 0 a 500 dollars |
| Tests marketing initiaux | 300 dollars | 1,000 a 3,000 dollars |

Budget ponctuel recommande :

```text
Publication lean : 800 a 1,500 dollars
Lancement public propre : 2,500 a 6,000 dollars
Lancement tres serieux : 7,500 dollars et plus
```

## Budget Recommande Pour Les 3 Premiers Mois

| Categorie | Budget recommande |
|---|---:|
| Infrastructure et outils | 500 a 800 dollars |
| Legal et conformite | 1,000 a 2,500 dollars |
| Tests marketing | 500 a 1,500 dollars |
| Buffer divers | 300 a 500 dollars |
| Total | 2,300 a 5,300 dollars |

## Budget Recommande Sur 12 Mois

| Scenario | Budget |
|---|---:|
| Lean | 12,000 a 15,000 dollars |
| Realiste | 18,000 a 25,000 dollars |
| Ambitieux | 35,000 dollars et plus |

## Objectifs Commerciaux

Viabilite court terme :

```text
10 clients a 79 dollars / mois = 790 dollars de MRR
```

Base SaaS early saine :

```text
30 clients a 79 a 149 dollars / mois = environ 2,500 a 4,500 dollars de MRR
```

Petit SaaS serieux :

```text
100 clients avec ARPA mixte autour de 99 dollars / mois = environ 9,900 dollars de MRR
```

La priorite ne doit pas etre une grosse base d'utilisateurs gratuits au depart. La priorite doit etre des communautes structurees qui voient Arena-X comme un outil de retention utile.

## Strategie De Lancement Recommandee

1. Commencer avec une preview privee.
2. Valider OAuth Discord et Twitch.
3. Valider le bootstrap profil et le dashboard.
4. Vendre manuellement a 10 a 30 communautes Discord/Twitch structurees.
5. Eviter les campagnes paid ads larges tant que l'activation et la retention ne sont pas prouvees.
6. Utiliser Lemon Squeezy subscriptions pour simplifier la gestion merchant of record.
7. Garder tout le wording loin des termes betting, wagering, payout, stake et cash-prize.

## Risques Cles

| Risque | Mitigation |
|---|---|
| Produit percu comme du betting | Garder un wording centre sur retention, engagement, live calls, progression et prestige communautaire |
| Echec OAuth qui casse la confiance | Tester Discord et Twitch en preview avant production |
| Trop d'usage gratuit | Vendre aux admins, pas aux joueurs individuels |
| Support trop lourd | Simplifier l'onboarding et ajouter une option setup payante |
| Infrastructure surdimensionnee | Demarrer lean avec Vercel Pro et Supabase Pro |
| Ambiguite legale | Budgeter une relecture non-betting avant lancement public large |

## Recommandation D'Associe

Demarrer avec :

- Vercel Pro
- Supabase Pro
- Lemon Squeezy
- Resend Free
- Sentry Free
- PostHog Free
- Google Workspace Starter
- relecture legale focalisee sur le wording non-betting
- prospection directe d'operateurs de communautes Discord/Twitch

Ne pas surinvestir en publicite payante tant que :

- la preview n'est pas stable
- OAuth n'est pas fiable
- les premiers admins comprennent la valeur
- le produit prouve qu'il augmente l'activite et le retour utilisateur

## Sources A Reverifier Avant Achat Final

- Lemon Squeezy pricing and fees: https://www.lemonsqueezy.com/pricing
- Lemon Squeezy fees documentation: https://docs.lemonsqueezy.com/help/getting-started/fees
- Lemon Squeezy subscriptions documentation: https://docs.lemonsqueezy.com/help/products/subscriptions
- Vercel pricing: https://vercel.com/pricing
- Supabase billing: https://supabase.com/docs/guides/platform/billing-on-supabase
- Supabase Edge Functions pricing: https://supabase.com/docs/guides/functions/pricing
- Supabase Realtime pricing: https://supabase.com/docs/guides/realtime/pricing
- Resend pricing: https://resend.com/pricing
- Google Workspace pricing: https://workspace.google.com/pricing.html
- Sentry pricing: https://sentry.io/pricing
- PostHog pricing: https://posthog.com/pricing
