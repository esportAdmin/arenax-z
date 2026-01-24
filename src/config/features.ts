/**
 * Feature Flags - Contrôle centralisé des fonctionnalités
 * 
 * 🔛 true  = visible pour l'utilisateur
 * 🔘 false = existe mais caché (le code reste intact)
 * 
 * Ordre d'activation recommandé :
 * 1. DAILY_PICK → engagement de base
 * 2. STREAKS → habitude quotidienne
 * 3. CHALLENGES → gamification
 * 4. PREMIUM → monétisation Web2
 * 5. STAKING → Web3
 * 6. CLUBS → B2B
 */

export const FEATURES = {
  // ✅ Phase 1 - Core Loop (actif maintenant)
  DAILY_PICK: true,           // 🔥 Le cœur du produit - "Qui va gagner ?"
  
  // ✅ Phase 2 - Rétention (activé)
  STREAKS: true,              // 🔥 Séries de jours consécutifs
  CHALLENGES: true,           // 🎯 Défis quotidiens
  
  // 💳 Phase 3 - Monétisation (activer quand D7 > 10%)
  PREMIUM: false,             // 💎 Abonnement premium
  
  // 🪙 Phase 4 - Web3 (activer quand revenus Web2 stables)
  STAKING: false,             // 🪙 Staking ARENA
  
  // 🏢 Phase 5 - B2B (activer quand >1000 utilisateurs actifs)
  CLUBS: false,               // 🏢 Dashboard clubs
  
  // 📊 Fonctionnalités secondaires
  DASHBOARD_STATS: false,     // 📊 Stats avancées
  RECENT_PREDICTIONS: false,  // 📋 Historique prédictions
  QUICK_ACTIONS: false,       // ⚡ Actions rapides
} as const;

// Type helper pour l'autocomplétion
export type FeatureFlag = keyof typeof FEATURES;

// Helper pour vérifier un flag
export const isFeatureEnabled = (flag: FeatureFlag): boolean => {
  return FEATURES[flag];
};
