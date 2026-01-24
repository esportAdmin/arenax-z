import { format } from 'date-fns';

interface UserProfile {
  id: string;
  user_id: string;
  display_name: string | null;
  username: string | null;
  avatar_url: string | null;
  arena_balance: number;
  current_level: number;
  current_xp: number;
  total_predictions: number;
  total_wins: number;
  created_at: string;
}

interface Redemption {
  id: string;
  user_id: string;
  prize_id: number;
  prize_name: string;
  price_paid: number;
  status: string;
  delivery_info: unknown;
  notes: string | null;
  created_at: string;
  updated_at: string;
  profile?: {
    display_name: string | null;
    username: string | null;
  };
}

function escapeCsvValue(value: string | number | null | undefined): string {
  if (value === null || value === undefined) return '';
  const stringValue = String(value);
  // Escape quotes and wrap in quotes if contains comma, quote, or newline
  if (stringValue.includes(',') || stringValue.includes('"') || stringValue.includes('\n')) {
    return `"${stringValue.replace(/"/g, '""')}"`;
  }
  return stringValue;
}

function downloadCsv(filename: string, csvContent: string) {
  const blob = new Blob(['\ufeff' + csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);
  link.setAttribute('href', url);
  link.setAttribute('download', filename);
  link.style.visibility = 'hidden';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

export function exportUsersToCsv(users: UserProfile[]) {
  const headers = [
    'ID',
    'User ID',
    'Nom',
    'Username',
    'Niveau',
    'XP',
    'Arena Points',
    'Prédictions',
    'Victoires',
    'Taux de victoire (%)',
    'Date d\'inscription'
  ];

  const rows = users.map(user => {
    const winRate = user.total_predictions > 0 
      ? Math.round((user.total_wins / user.total_predictions) * 100) 
      : 0;
    
    return [
      escapeCsvValue(user.id),
      escapeCsvValue(user.user_id),
      escapeCsvValue(user.display_name),
      escapeCsvValue(user.username),
      user.current_level,
      user.current_xp,
      user.arena_balance,
      user.total_predictions,
      user.total_wins,
      winRate,
      format(new Date(user.created_at), 'dd/MM/yyyy HH:mm')
    ].join(',');
  });

  const csvContent = [headers.join(','), ...rows].join('\n');
  const filename = `utilisateurs_${format(new Date(), 'yyyy-MM-dd_HH-mm')}.csv`;
  downloadCsv(filename, csvContent);
}

export function exportRedemptionsToCsv(redemptions: Redemption[]) {
  const headers = [
    'ID',
    'Date',
    'Utilisateur',
    'Prix',
    'Coût (AP)',
    'Statut',
    'Notes',
    'Dernière mise à jour'
  ];

  const rows = redemptions.map(r => {
    const userName = r.profile?.display_name || r.profile?.username || 'Utilisateur';
    
    return [
      escapeCsvValue(r.id),
      format(new Date(r.created_at), 'dd/MM/yyyy HH:mm'),
      escapeCsvValue(userName),
      escapeCsvValue(r.prize_name),
      r.price_paid,
      escapeCsvValue(r.status),
      escapeCsvValue(r.notes),
      format(new Date(r.updated_at), 'dd/MM/yyyy HH:mm')
    ].join(',');
  });

  const csvContent = [headers.join(','), ...rows].join('\n');
  const filename = `echanges_${format(new Date(), 'yyyy-MM-dd_HH-mm')}.csv`;
  downloadCsv(filename, csvContent);
}

interface AuditLog {
  id: string;
  admin_id: string;
  action_type: string;
  target_type: string;
  target_id: string | null;
  details: unknown;
  created_at: string;
  admin_profile?: {
    display_name: string | null;
    username: string | null;
  };
}

export function exportAuditLogsToCsv(logs: AuditLog[]) {
  const headers = [
    'ID',
    'Date',
    'Admin',
    'Type d\'action',
    'Type de cible',
    'ID cible',
    'Détails'
  ];

  const rows = logs.map(log => {
    const adminName = log.admin_profile?.display_name || log.admin_profile?.username || 'Admin';
    const details = log.details ? JSON.stringify(log.details) : '';
    
    return [
      escapeCsvValue(log.id),
      format(new Date(log.created_at), 'dd/MM/yyyy HH:mm'),
      escapeCsvValue(adminName),
      escapeCsvValue(log.action_type),
      escapeCsvValue(log.target_type),
      escapeCsvValue(log.target_id),
      escapeCsvValue(details)
    ].join(',');
  });

  const csvContent = [headers.join(','), ...rows].join('\n');
  const filename = `audit_log_${format(new Date(), 'yyyy-MM-dd_HH-mm')}.csv`;
  downloadCsv(filename, csvContent);
}
