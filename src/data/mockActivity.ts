import type { Activity } from '../types';

function ago(mins: number): string {
  const d = new Date();
  d.setMinutes(d.getMinutes() - mins);
  return d.toISOString();
}

export const mockActivity: Activity[] = [
  { id: 'a1', timestamp: ago(2), type: 'payment', title: 'Payment received', description: 'Indemnitor Rosa Reyes paid on BB-2024-1040', amount: 2400, outcome: 'Cleared', office: 'San Jose' },
  { id: 'a2', timestamp: ago(6), type: 'ai_call', title: 'AI call completed', description: 'Reached Gloria Whitfield — payment plan accepted for BB-2024-1041', outcome: '6-mo plan, $420/mo', office: 'Oakland' },
  { id: 'a3', timestamp: ago(11), type: 'sms', title: 'SMS sequence fired', description: '48 urgent reminders sent across delinquent tier', outcome: '11 clicks on payment portal', office: 'Los Angeles' },
  { id: 'a4', timestamp: ago(14), type: 'skip_trace', title: 'Skip trace resolved', description: 'New phone + employer located for Sergio Vasquez', outcome: 'Contact restored', office: 'Long Beach' },
  { id: 'a5', timestamp: ago(19), type: 'payment', title: 'Payment received', description: 'Wire transfer from Rajesh Kapoor on BB-2024-1046', amount: 12500, outcome: 'Cleared', office: 'Redwood City' },
  { id: 'a6', timestamp: ago(23), type: 'escalation', title: 'Account escalated', description: 'BB-2024-1053 moved Delinquent → Escalated at day 181', office: 'San Diego' },
  { id: 'a7', timestamp: ago(28), type: 'email', title: 'Email sequence sent', description: 'Balance summary + legal notice delivered to 127 indemnitors', outcome: '43% open rate', office: 'Santa Ana' },
  { id: 'a8', timestamp: ago(34), type: 'payment_plan', title: 'Payment plan created', description: 'AI structured 12-mo plan for Devon Nakamura (BB-2024-1045)', outcome: '$275/mo', office: 'Los Angeles' },
  { id: 'a9', timestamp: ago(39), type: 'ai_call', title: 'AI call completed', description: 'Verbal commitment from Marco Russo — $1,200 by Friday', outcome: 'Promise logged', office: 'Anaheim' },
  { id: 'a10', timestamp: ago(44), type: 'legal', title: 'Demand letter queued', description: 'Legal review pending for BB-2024-1059 (day 242)', office: 'San Bernardino' },
  { id: 'a11', timestamp: ago(49), type: 'payment', title: 'Partial payment', description: 'ACH from Esperanza Molina on BB-2024-1047', amount: 850, outcome: 'Cleared', office: 'Santa Ana' },
  { id: 'a12', timestamp: ago(56), type: 'sms', title: 'SMS sequence fired', description: 'Day-1 reminders to new delinquents', outcome: '22% response rate', office: 'Riverside' },
  { id: 'a13', timestamp: ago(61), type: 'ai_call', title: 'AI call completed', description: 'No contact on BB-2024-1051 — retry scheduled 7:00 PM', outcome: 'Voicemail', office: 'Modesto' },
  { id: 'a14', timestamp: ago(68), type: 'skip_trace', title: 'Skip trace initiated', description: 'Stale contact flagged for Marcus Reyes', office: 'San Jose' },
  { id: 'a15', timestamp: ago(74), type: 'payment', title: 'Payment received', description: 'Card payment from Linh Nguyen on BB-2024-1062', amount: 680, outcome: 'Cleared', office: 'Stockton' },
  { id: 'a16', timestamp: ago(82), type: 'email', title: 'Email delivered', description: 'Final notice to Alicia Pierce (BB-2024-1061)', outcome: 'Opened', office: 'Oakland' },
  { id: 'a17', timestamp: ago(91), type: 'legal', title: 'Legal action filed', description: 'Suit filed on BB-2024-1058 (day 310)', office: 'Los Angeles' },
  { id: 'a18', timestamp: ago(97), type: 'payment_plan', title: 'Payment plan created', description: 'AI structured 9-mo plan for Carmen Vasquez', outcome: '$540/mo', office: 'Long Beach' },
];

export const kpiTrend = Array.from({ length: 30 }, (_, i) => ({
  day: i,
  value: 1.2 + i * 0.25 + Math.sin(i / 3) * 0.4 + (i > 20 ? (i - 20) * 0.15 : 0),
}));

export const outstandingTrend = Array.from({ length: 24 }, (_, i) => ({
  month: i,
  value: 128 + Math.sin(i / 2) * 3 + (i / 24) * 7,
}));

export const recoveredTrend = Array.from({ length: 12 }, (_, i) => ({
  month: i,
  value: 340 + i * 45 + Math.sin(i) * 30,
}));

export const aiActionsTrend = Array.from({ length: 24 }, (_, i) => ({
  hour: i,
  value: 80 + Math.sin(i / 3) * 40 + (i > 8 && i < 20 ? 120 : 20),
}));
