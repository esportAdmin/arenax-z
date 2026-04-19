/**
 * src/integrations/supabase/types.ts
 * Barrel re-export — corrige BUG-013.
 *
 * Plusieurs fichiers importent depuis "@/integrations/supabase/types"
 * mais le fichier réel est "database.types.ts".
 *
 * Référencée par :
 *   src/legacy-pages/Rewards.tsx:12
 *   app/rewards/page.tsx:3
 */

export * from "./database.types";
