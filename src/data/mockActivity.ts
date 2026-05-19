import type { Activity, Office } from '../types';

export type ActivityTemplate = Omit<Activity, 'id' | 'timestamp'>;

function ago(mins: number): string {
  const d = new Date();
  d.setMinutes(d.getMinutes() - mins);
  return d.toISOString();
}

export const mockActivity: Activity[] = [
  { id: 'a1',  timestamp: ago(2),   type: 'payment',      title: 'Payment received',     description: 'Indemnitor Rosa Reyes paid on BB-2024-1040',                                amount: 2400,  outcome: 'Cleared',                 office: 'San Jose' },
  { id: 'a2',  timestamp: ago(6),   type: 'ai_call',      title: 'AI call completed',    description: 'Reached Gloria Whitfield — payment plan accepted for BB-2024-1041',        outcome: '6-mo plan, $420/mo',      office: 'Oakland' },
  { id: 'a3',  timestamp: ago(11),  type: 'sms',          title: 'SMS sequence fired',   description: '48 urgent reminders sent across delinquent tier',                          outcome: '11 clicks on payment portal', office: 'Los Angeles' },
  { id: 'a4',  timestamp: ago(14),  type: 'skip_trace',   title: 'Skip trace resolved',  description: 'New phone + employer located for Sergio Vasquez',                           outcome: 'Contact restored',        office: 'Los Angeles' },
  { id: 'a5',  timestamp: ago(19),  type: 'payment',      title: 'Payment received',     description: 'Wire transfer from Rajesh Kapoor on BB-2024-1046',                         amount: 12500, outcome: 'Cleared',                 office: 'Redwood City' },
  { id: 'a6',  timestamp: ago(23),  type: 'escalation',   title: 'Account escalated',    description: 'BB-2024-1053 moved Delinquent → Escalated at day 181',                     office: 'San Diego' },
  { id: 'a7',  timestamp: ago(28),  type: 'email',        title: 'Email sequence sent',  description: 'Balance summary + legal notice delivered to 127 indemnitors',              outcome: '43% open rate',           office: 'Santa Ana' },
  { id: 'a8',  timestamp: ago(34),  type: 'payment_plan', title: 'Payment plan created', description: 'AI structured 12-mo plan for Devon Nakamura (BB-2024-1045)',               outcome: '$275/mo',                 office: 'Los Angeles' },
  { id: 'a9',  timestamp: ago(39),  type: 'ai_call',      title: 'AI call completed',    description: 'Verbal commitment from Marco Russo — $1,200 by Friday',                    outcome: 'Promise logged',          office: 'Santa Ana' },
  { id: 'a10', timestamp: ago(44),  type: 'legal',        title: 'Demand letter queued', description: 'Legal review pending for BB-2024-1059 (day 242)',                          office: 'San Diego' },
  { id: 'a11', timestamp: ago(49),  type: 'payment',      title: 'Partial payment',      description: 'ACH from Esperanza Molina on BB-2024-1047',                                amount: 850,   outcome: 'Cleared',                 office: 'Santa Ana' },
  { id: 'a12', timestamp: ago(56),  type: 'sms',          title: 'SMS sequence fired',   description: 'Day-1 reminders to new delinquents',                                       outcome: '22% response rate',       office: 'San Diego' },
  { id: 'a13', timestamp: ago(61),  type: 'ai_call',      title: 'AI call completed',    description: 'No contact on BB-2024-1051 — retry scheduled 7:00 PM',                     outcome: 'Voicemail',               office: 'San Jose' },
  { id: 'a14', timestamp: ago(68),  type: 'skip_trace',   title: 'Skip trace initiated', description: 'Stale contact flagged for Marcus Reyes',                                   office: 'San Jose' },
  { id: 'a15', timestamp: ago(74),  type: 'payment',      title: 'Payment received',     description: 'Card payment from Linh Nguyen on BB-2024-1062',                            amount: 680,   outcome: 'Cleared',                 office: 'Oakland' },
  { id: 'a16', timestamp: ago(82),  type: 'email',        title: 'Email delivered',      description: 'Final notice to Alicia Pierce (BB-2024-1061)',                             outcome: 'Opened',                  office: 'Oakland' },
  { id: 'a17', timestamp: ago(91),  type: 'legal',        title: 'Legal action filed',   description: 'Suit filed on BB-2024-1058 (day 310)',                                     office: 'Los Angeles' },
  { id: 'a18', timestamp: ago(97),  type: 'payment_plan', title: 'Payment plan created', description: 'AI structured 9-mo plan for Carmen Vasquez',                               outcome: '$540/mo',                 office: 'Los Angeles' },

  { id: 'a19', timestamp: ago(104), type: 'payment',      title: 'Payment received',     description: 'ACH debit from Maria Carrillo on BB-2024-1043',                            amount: 3200,  outcome: 'Cleared',                 office: 'Los Angeles' },
  { id: 'a20', timestamp: ago(112), type: 'ai_call',      title: 'AI call completed',    description: 'Reached Wei Chen — 24-mo plan proposal accepted',                           outcome: '$890/mo',                 office: 'Redwood City' },
  { id: 'a21', timestamp: ago(118), type: 'sms',          title: 'SMS sequence fired',   description: 'Day-14 urgency tier for Santa Ana delinquents',                            outcome: '18 portal clicks',        office: 'Santa Ana' },
  { id: 'a22', timestamp: ago(126), type: 'escalation',   title: 'Account escalated',    description: 'BB-2024-1055 moved Delinquent → Escalated',                                 office: 'San Diego' },
  { id: 'a23', timestamp: ago(133), type: 'payment',      title: 'Payment received',     description: 'Wire from Hiroshi Tanaka on BB-2024-1060',                                 amount: 18600, outcome: 'Cleared',                 office: 'Oakland' },
  { id: 'a24', timestamp: ago(141), type: 'skip_trace',   title: 'Skip trace resolved',  description: 'Recovered employer + current address for Tyrone Jackson',                   outcome: 'New employer: Tesla',     office: 'San Jose' },
  { id: 'a25', timestamp: ago(152), type: 'email',        title: 'Email sequence sent',  description: 'Balance statements auto-mailed to 73 San Diego indemnitors',               outcome: '39% open rate',           office: 'San Diego' },
  { id: 'a26', timestamp: ago(164), type: 'payment_plan', title: 'Payment plan created', description: 'AI structured 18-mo plan for Latoya Jackson (BB-2024-1051)',               outcome: '$325/mo',                 office: 'Oakland' },
  { id: 'a27', timestamp: ago(175), type: 'ai_call',      title: 'AI call completed',    description: 'Contacted Theresa Coleman — dispute opened, escalated to supervisor',      outcome: 'Dispute flag',            office: 'Los Angeles' },
  { id: 'a28', timestamp: ago(187), type: 'legal',        title: 'Demand letter sent',   description: 'Certified letter delivered for BB-2024-1049 (day 194)',                     office: 'San Diego' },
  { id: 'a29', timestamp: ago(201), type: 'payment',      title: 'Payment received',     description: 'Check from Camila Ramirez cleared on BB-2024-1065',                       amount: 1450,  outcome: 'Cleared',                 office: 'San Jose' },
  { id: 'a30', timestamp: ago(215), type: 'sms',          title: 'SMS sequence fired',   description: 'Oakland office — 32 payment reminders at optimal send window',              outcome: '12 replies',              office: 'Oakland' },
  { id: 'a31', timestamp: ago(228), type: 'email',        title: 'Email delivered',      description: 'Legal notice to Amit Patel (BB-2024-1066)',                                outcome: 'Opened · replied',        office: 'Santa Ana' },
  { id: 'a32', timestamp: ago(242), type: 'skip_trace',   title: 'Skip trace initiated', description: 'Bounced number on BB-2024-1052 — investigation queued',                     office: 'San Diego' },
  { id: 'a33', timestamp: ago(257), type: 'payment',      title: 'Payment received',     description: 'Card payment from Carmen Vasquez on plan day-1',                           amount: 540,   outcome: 'Cleared',                 office: 'Los Angeles' },
  { id: 'a34', timestamp: ago(271), type: 'ai_call',      title: 'AI call completed',    description: 'No contact on BB-2024-1067 — voicemail left, retry at 6 PM',               outcome: 'Voicemail',               office: 'San Diego' },
  { id: 'a35', timestamp: ago(288), type: 'escalation',   title: 'Account escalated',    description: 'BB-2024-1054 escalated at day 187 — collateral review triggered',          office: 'Santa Ana' },
  { id: 'a36', timestamp: ago(305), type: 'payment_plan', title: 'Payment plan created', description: 'AI built 15-mo restructure for Fatima Abdullah (BB-2024-1050)',            outcome: '$380/mo',                 office: 'Santa Ana' },
  { id: 'a37', timestamp: ago(322), type: 'payment',      title: 'Payment received',     description: 'ACH from Yuki Nakamura on BB-2024-1046',                                   amount: 4100,  outcome: 'Cleared',                 office: 'Redwood City' },
  { id: 'a38', timestamp: ago(340), type: 'legal',        title: 'Demand letter queued', description: 'BB-2024-1068 legal queue (day 268) — counsel review pending',             office: 'San Diego' },
  { id: 'a39', timestamp: ago(358), type: 'ai_call',      title: 'AI call completed',    description: 'Reached Denise Brooks — promise-to-pay $750 by Friday',                    outcome: 'PTP logged',              office: 'San Jose' },
  { id: 'a40', timestamp: ago(377), type: 'sms',          title: 'SMS sequence fired',   description: 'Redwood City office — 28 day-1 reminders',                                 outcome: '6 portal visits',         office: 'Redwood City' },
  { id: 'a41', timestamp: ago(395), type: 'payment',      title: 'Payment received',     description: 'Check from Andre Foster on BB-2024-1069',                                  amount: 1120,  outcome: 'Cleared',                 office: 'Oakland' },
];

export const liveActivityPool: ActivityTemplate[] = [
  // Payments
  { type: 'payment',      title: 'Payment received',     description: 'Indemnitor Maria Carrillo paid on BB-2024-1043',                amount: 3200,  outcome: 'Cleared',              office: 'San Jose' },
  { type: 'payment',      title: 'Wire received',        description: 'Hiroshi Tanaka cleared BB-2024-1060 in full',                   amount: 18600, outcome: 'Cleared',              office: 'Oakland' },
  { type: 'payment',      title: 'ACH posted',           description: 'Sergio Vasquez paid on BB-2025-0212',                            amount: 1450,  outcome: 'Cleared',              office: 'Los Angeles' },
  { type: 'payment',      title: 'Card payment',         description: 'Linh Nguyen paid on BB-2025-0188',                               amount: 780,   outcome: 'Cleared',              office: 'Redwood City' },
  { type: 'payment',      title: 'Payment received',     description: 'Indemnitor Joaquin Vargas paid on BB-2024-1071',                amount: 4900,  outcome: 'Cleared',              office: 'Santa Ana' },
  { type: 'payment',      title: 'Payment received',     description: 'Priya Sharma paid on BB-2025-0204',                              amount: 980,   outcome: 'Cleared',              office: 'Redwood City' },
  { type: 'payment',      title: 'Wire received',        description: 'Beatriz Salazar cleared BB-2024-1078',                           amount: 8400,  outcome: 'Cleared',              office: 'San Diego' },

  // AI calls
  { type: 'ai_call',      title: 'AI call completed',    description: 'Reached Gloria Whitfield on BB-2024-1041 — payment plan accepted', outcome: '12-mo plan, $420/mo', office: 'Oakland' },
  { type: 'ai_call',      title: 'AI call completed',    description: 'Reached Tyrone Jackson on BB-2025-0034 — promise to pay $1,250 Friday', outcome: 'PTP logged',         office: 'San Jose' },
  { type: 'ai_call',      title: 'AI call completed',    description: 'Sentinel left voicemail for Rajesh Kapoor (BB-2024-1052)',       outcome: 'Voicemail — retry 7 PM', office: 'Redwood City' },
  { type: 'ai_call',      title: 'AI call completed',    description: 'Reached Marco Russo on BB-2024-1083 — verbal commitment $2,800 Tue', outcome: 'Promise logged',         office: 'Santa Ana' },
  { type: 'ai_call',      title: 'AI call completed',    description: 'Reached Latoya Jackson on BB-2025-0061 — restructure agreed',   outcome: '18-mo plan accepted',    office: 'Oakland' },
  { type: 'ai_call',      title: 'AI call completed',    description: 'Reached Connor Walsh on BB-2024-1089 — dispute opened',          outcome: 'Escalated to supervisor', office: 'San Diego' },
  { type: 'ai_call',      title: 'AI call completed',    description: 'Sentinel reached Sofia Herrera on BB-2025-0142',                 outcome: 'Promise to pay 3 days', office: 'Los Angeles' },

  // SMS
  { type: 'sms',          title: 'SMS sequence fired',   description: '84 reminders sent across LA delinquent tier',                    outcome: '17 portal clicks',       office: 'Los Angeles' },
  { type: 'sms',          title: 'SMS sequence fired',   description: 'Day-1 cascade fired to 41 San Diego indemnitors',                outcome: '9 replies inbound',      office: 'San Diego' },
  { type: 'sms',          title: 'SMS sequence fired',   description: 'Optimal-window blast — 62 messages, San Jose tier',              outcome: '23% response rate',      office: 'San Jose' },
  { type: 'sms',          title: 'SMS sequence fired',   description: 'Bilingual cascade fired to Santa Ana queue',                     outcome: '31% open rate',          office: 'Santa Ana' },
  { type: 'sms',          title: 'SMS sequence fired',   description: 'Oakland — 28 day-3 reminders at optimal send window',            outcome: '11 portal clicks',       office: 'Oakland' },

  // Skip trace
  { type: 'skip_trace',   title: 'Skip trace resolved',  description: 'New phone + employer located for Sergio Vasquez',                outcome: 'Contact restored',       office: 'Los Angeles' },
  { type: 'skip_trace',   title: 'Skip trace resolved',  description: 'Recovered current address for Latoya Jackson',                   outcome: 'Verified via DMV',       office: 'Oakland' },
  { type: 'skip_trace',   title: 'Skip trace resolved',  description: 'Sentinel located Fatima Abdullah — new mobile + workplace',      outcome: 'Reactivated',            office: 'Santa Ana' },
  { type: 'skip_trace',   title: 'Skip trace resolved',  description: 'New employer (Cisco) confirmed for Devon Nakamura',              outcome: 'Employer verified',      office: 'San Jose' },
  { type: 'skip_trace',   title: 'Skip trace resolved',  description: 'Recovered phone + address for Jamal Bennett',                    outcome: 'Contact restored',       office: 'San Diego' },

  // Escalations
  { type: 'escalation',   title: 'Account escalated',    description: 'BB-2024-1053 moved Delinquent → Escalated at day 181',           office: 'San Diego' },
  { type: 'escalation',   title: 'Account escalated',    description: 'BB-2025-0042 moved Escalated → Legal at day 224',                outcome: 'Collateral review triggered', office: 'Los Angeles' },
  { type: 'escalation',   title: 'Account escalated',    description: 'BB-2024-1067 moved Delinquent → Escalated at day 168',           office: 'Santa Ana' },
  { type: 'escalation',   title: 'Account escalated',    description: 'BB-2025-0117 moved Active → Delinquent at day 32',               office: 'Oakland' },

  // Email opened
  { type: 'email',        title: 'Email opened',         description: 'Camila Ramirez opened payment plan offer on BB-2025-0098',       outcome: 'Opened · 4 min dwell',   office: 'San Jose' },
  { type: 'email',        title: 'Email opened',         description: 'Diego Mendoza opened legal notice on BB-2024-1093',              outcome: 'Opened twice · replied', office: 'Los Angeles' },
  { type: 'email',        title: 'Email opened',         description: 'Beatriz Salazar opened final demand on BB-2024-1078',            outcome: 'Opened · clicked portal', office: 'San Diego' },
  { type: 'email',        title: 'Email opened',         description: 'Amit Patel opened restructure offer on BB-2025-0204',            outcome: 'Opened · no reply',      office: 'Redwood City' },

  // Payment plans
  { type: 'payment_plan', title: 'Payment plan signed',  description: 'Wei Chen signed 24-month plan on BB-2024-1052',                  outcome: '$890/mo',                office: 'Redwood City' },
  { type: 'payment_plan', title: 'Payment plan signed',  description: 'Carmen Vasquez signed 9-month plan on BB-2024-1045',             outcome: '$540/mo',                office: 'Los Angeles' },
  { type: 'payment_plan', title: 'Payment plan signed',  description: 'Denise Brooks signed 15-month plan on BB-2025-0061',             outcome: '$325/mo',                office: 'San Jose' },
  { type: 'payment_plan', title: 'Payment plan signed',  description: 'Fatima Abdullah signed 18-month restructure on BB-2024-1050',    outcome: '$380/mo',                office: 'Santa Ana' },

  // Court signals + legal flags
  { type: 'legal',        title: 'Court signal',         description: 'Forfeiture risk detected on BB-2024-1058',                       outcome: 'LA Superior Court',      office: 'Los Angeles' },
  { type: 'legal',        title: 'Sentinel flag',        description: 'Patrick O\u2019Neill flagged for legal review on BB-2024-1099',  outcome: 'Day 246 past due',       office: 'San Diego' },
  { type: 'legal',        title: 'Demand letter queued', description: 'BB-2024-1059 counsel review pending (day 242)',                  outcome: 'Counsel review pending', office: 'San Diego' },
  { type: 'legal',        title: 'Sentinel flag',        description: 'Andre Foster flagged for legal review on BB-2025-0083',          outcome: 'Day 198 past due',       office: 'Oakland' },

  // Compass partnership outreach
  { type: 'compass',      title: 'Compass outreach',     description: 'Attorney Daniel Cho responded to Q2 partnership outreach',       outcome: 'Cho & Associates · 12 bonds/mo', office: 'Los Angeles' },
  { type: 'compass',      title: 'Compass outreach',     description: 'Erica Romano replied — interested in volume pricing',             outcome: 'Romano Legal Group · demo pending', office: 'Santa Ana' },
  { type: 'compass',      title: 'Compass outreach',     description: 'James Patel signed partnership agreement',                       outcome: 'Patel Defense · effective immediately', office: 'San Diego' },
  { type: 'compass',      title: 'Compass outreach',     description: 'Lisa Ortiz scheduled discovery call for Friday',                  outcome: 'Ortiz Law Office · 2 PM PT', office: 'Oakland' },
];

export const OFFICES: Office[] = ['San Jose', 'Oakland', 'Redwood City', 'Los Angeles', 'Santa Ana', 'San Diego'];

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
