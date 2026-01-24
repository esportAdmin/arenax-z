#!/bin/bash

# Script de migration automatique des console.log vers logger
# Arena Forge - Migration automatique

echo "🚀 Démarrage de la migration automatique des console.log..."
echo ""

# Créer une sauvegarde complète
timestamp=$(date +%Y%m%d_%H%M%S)
backup_dir="backup_before_logger_migration_${timestamp}"
echo "📦 Création de la sauvegarde dans ${backup_dir}..."
cp -r src "${backup_dir}"
echo "✅ Sauvegarde créée"
echo ""

# Compter les occurrences avant
before=$(grep -r "console\." src --include="*.tsx" --include="*.ts" | wc -l)
echo "📊 Console trouvés avant migration: ${before}"
echo ""

# Liste des fichiers à traiter
files=$(grep -r "console\." src --include="*.tsx" --include="*.ts" -l)

# Compteur de fichiers traités
count=0

echo "🔧 Traitement des fichiers..."
echo ""

for file in $files; do
  count=$((count + 1))
  echo "[$count] Traitement: $file"
  
  # Vérifier si l'import du logger existe déjà
  if ! grep -q "import.*logger.*from.*@/lib/logger" "$file"; then
    # Trouver la dernière ligne d'import
    last_import_line=$(grep -n "^import" "$file" | tail -1 | cut -d: -f1)
    
    if [ -n "$last_import_line" ]; then
      # Ajouter l'import après la dernière ligne d'import
      sed -i "${last_import_line}a import { logger } from '@/lib/logger';" "$file"
      echo "  → Import ajouté"
    else
      # Ajouter l'import au début du fichier
      sed -i "1i import { logger } from '@/lib/logger';" "$file"
      echo "  → Import ajouté au début"
    fi
  else
    echo "  → Import déjà présent"
  fi
  
  # Remplacer console.log par logger.debug
  sed -i 's/console\.log(/logger.debug(/g' "$file"
  
  # Remplacer console.error par logger.error
  sed -i 's/console\.error(/logger.error(/g' "$file"
  
  # Remplacer console.warn par logger.warn
  sed -i 's/console\.warn(/logger.warn(/g' "$file"
  
  # Remplacer console.info par logger.info
  sed -i 's/console\.info(/logger.info(/g' "$file"
  
  echo "  ✅ Remplacements effectués"
  echo ""
done

# Compter les occurrences après
after=$(grep -r "console\." src --include="*.tsx" --include="*.ts" | grep -v "src/lib/logger.ts" | wc -l)

echo ""
echo "✨ Migration terminée!"
echo ""
echo "📊 Résultats:"
echo "  • Console avant: ${before}"
echo "  • Console après: ${after}"
echo "  • Fichiers traités: ${count}"
echo "  • Sauvegarde: ${backup_dir}"
echo ""
echo "🎯 Prochaines étapes:"
echo "  1. Vérifier le code: npm run build"
echo "  2. Tester l'application: npm run dev"
echo "  3. Si problème, restaurer: cp -r ${backup_dir}/* src/"
echo ""
