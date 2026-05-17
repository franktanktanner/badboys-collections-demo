import type { Account, AccountStatus, Office } from '../types';

const OFFICES: Office[] = [
  'San Jose', 'Oakland', 'Redwood City', 'Los Angeles', 'Santa Ana', 'San Diego',
];

const FIRST_NAMES = [
  'Marcus', 'Anthony', 'James', 'David', 'Robert', 'Michael', 'William', 'Joseph',
  'Christopher', 'Daniel', 'Matthew', 'Ricardo', 'Sergio', 'Eduardo', 'Manuel',
  'Rajesh', 'DeMarcus', 'Tyrone', 'Hakeem', 'Carlos', 'Hector', 'Pedro', 'Octavio',
  'Diego', 'Fernando', 'Mikhail', 'Brendan', 'Andre', 'Jamal', 'Kwame', 'Wei',
];

const FIRST_NAMES_F = [
  'Maria', 'Sofia', 'Linda', 'Sandra', 'Jessica', 'Carmen', 'Patricia', 'Elena',
  'Veronica', 'Rachel', 'Diana', 'Gabriela', 'Carla', 'Yolanda', 'Priya', 'Gloria',
  'LaToya', 'Aisha', 'Lupe', 'Esperanza', 'Guadalupe', 'Selena', 'Beatriz', 'Ximena',
  'Fatima', 'Camila', 'Naomi', 'Rosalind', 'Chanel', 'Amara', 'Sinead',
];

const LAST_NAMES = [
  'Garcia', 'Martinez', 'Rodriguez', 'Hernandez', 'Lopez', 'Gonzalez', 'Wilson',
  'Anderson', 'Thomas', 'Taylor', 'Moore', 'Jackson', 'Martin', 'Lee', 'Perez',
  'Thompson', 'White', 'Harris', 'Sanchez', 'Clark', 'Ramirez', 'Lewis', 'Robinson',
  'Walker', 'Young', 'Allen', 'King', 'Wright', 'Scott', 'Torres', 'Nguyen', 'Hill',
  'Flores', 'Green', 'Adams', 'Nelson', 'Baker', 'Hall', 'Rivera', 'Campbell',
  'Mitchell', 'Carter', 'Roberts', 'Gomez', 'Phillips', 'Evans', 'Turner', 'Diaz',
  'Parker', 'Kapoor', 'Patel', 'Singh', 'Whitfield', 'Vasquez', 'Coleman', 'Foster',
];

const CHARGES = [
  'Felony DUI, Evasion', 'Possession w/ Intent', 'Assault w/ Deadly Weapon',
  'Grand Theft Auto', 'Drug Trafficking', 'Burglary, Resisting Arrest',
  'Embezzlement', 'Felony Weapons', 'Domestic Battery', 'Robbery',
  'Fraud, Identity Theft', 'Attempted Murder', 'Cybercrime, Wire Fraud',
  'Felony DUI', 'Possession', 'Gang Enhancement, Assault', 'Manslaughter',
  'Check Fraud', 'Armed Robbery', 'Money Laundering', 'Felony Evasion, Narcotics',
  'Extortion', 'Vehicular Homicide', 'Aggravated Assault', 'Felony DUI, Hit & Run',
  'Narcotics Distribution', 'Organized Crime', 'Human Trafficking',
];

const ADDRESS_BY_OFFICE: Record<Office, string[]> = {
  'San Jose': ['2847 Story Rd, San Jose, CA 95122', '1190 Tully Rd, San Jose, CA 95122', '885 N King Rd, San Jose, CA 95133'],
  'Oakland': ['1920 International Blvd, Oakland, CA 94606', '2715 MacArthur Blvd, Oakland, CA 94602', '3001 Foothill Blvd, Oakland, CA 94601'],
  'Redwood City': ['450 Marshall St, Redwood City, CA 94063', '1801 Broadway, Redwood City, CA 94063', '925 Veterans Blvd, Redwood City, CA 94063'],
  'Los Angeles': ['1733 W Vernon Ave, Los Angeles, CA 90062', '4801 S Vermont Ave, Los Angeles, CA 90037', '8821 S Western Ave, Los Angeles, CA 90047'],
  'Santa Ana': ['2315 N Tustin Ave, Santa Ana, CA 92705', '1801 E 17th St, Santa Ana, CA 92705', '3601 W McFadden Ave, Santa Ana, CA 92704'],
  'San Diego': ['3902 University Ave, San Diego, CA 92105', '4525 El Cajon Blvd, San Diego, CA 92115', '5102 Imperial Ave, San Diego, CA 92113'],
};

const EMPLOYERS = [
  'Valley Memorial Hospital', 'Amazon Fulfillment', 'Self-Employed', 'Kaiser Permanente',
  'SF Unified School District', 'Tesla', 'Google', 'Restaurant Owner', 'USPS',
  'Cerritos College', 'Construction Foreman', 'Oakland Parks & Rec', 'Stanford Hospital',
  'Long Beach City', 'Warehouse Supervisor', 'LAUSD', 'Farm Laborer', 'Nursing Agency',
  '7-Eleven Franchise Owner', 'Home Depot', 'Sony Entertainment', 'Kaiser Call Center',
  'Nail Salon Owner', 'Elementary Teacher', 'UPS', 'Restaurant Server', 'Medical Billing',
];

const NEXT_ACTIONS = [
  'AI call scheduled 4:15 PM',
  'SMS sequence — day 3',
  'Demand letter queued',
  'Skip trace in progress',
  'Payment plan review',
  'Legal escalation pending',
  'Follow-up call tomorrow',
  'Court date verification',
  'Indemnitor capacity model refresh',
];

const STATUS_BUCKETS: { status: AccountStatus; weight: number }[] = [
  { status: 'Active',        weight: 35 },
  { status: 'Delinquent',    weight: 30 },
  { status: 'Escalated',     weight: 15 },
  { status: 'Legal',         weight: 10 },
  { status: 'Payment Plan',  weight: 10 },
];

function seededRandom(seed: number) {
  let s = seed;
  return () => {
    s = (s * 9301 + 49297) % 233280;
    return s / 233280;
  };
}

function pick<T>(rand: () => number, arr: readonly T[]): T {
  return arr[Math.floor(rand() * arr.length)];
}

function weightedStatus(rand: () => number): AccountStatus {
  const total = STATUS_BUCKETS.reduce((s, b) => s + b.weight, 0);
  let r = rand() * total;
  for (const bucket of STATUS_BUCKETS) {
    r -= bucket.weight;
    if (r <= 0) return bucket.status;
  }
  return 'Active';
}

function generatePayments(rand: () => number, status: AccountStatus): Account['payments'] {
  const count = status === 'Payment Plan' ? 4 + Math.floor(rand() * 4) : 2 + Math.floor(rand() * 4);
  const methods: Array<'ACH' | 'Card' | 'Wire' | 'Check'> = ['ACH', 'Card', 'Wire', 'Check'];
  const out: Account['payments'] = [];
  for (let i = 0; i < count; i++) {
    const daysAgo = Math.floor(rand() * 30) + i * 21;
    const d = new Date();
    d.setDate(d.getDate() - daysAgo);
    const r = rand();
    const statusVal: 'Cleared' | 'Pending' | 'Failed' = r < 0.78 ? 'Cleared' : r < 0.9 ? 'Pending' : 'Failed';
    out.push({
      date: d.toISOString(),
      amount: Math.floor(rand() * 2400) + 250,
      method: methods[Math.floor(rand() * methods.length)],
      status: statusVal,
    });
  }
  return out;
}

function generateCommunications(rand: () => number): Account['communications'] {
  const channels: Array<'AI Call' | 'SMS' | 'Email' | 'Letter' | 'Skip Trace'> =
    ['AI Call', 'SMS', 'Email', 'Letter', 'Skip Trace'];
  const outcomes = [
    'Left voicemail, promise-to-pay logged',
    'Delivered, opened',
    'Payment plan proposed',
    'No answer, retry scheduled',
    'Disconnected number — skip trace queued',
    'Verbal commitment: $500 by Friday',
    'Replied: requesting payoff amount',
    'Refused contact, cease-and-desist threatened',
    'Partial payment received',
    'Updated employer information',
    'Payment portal clicked',
    'Balance summary opened',
  ];
  const count = 4 + Math.floor(rand() * 4);
  const out: Account['communications'] = [];
  for (let i = 0; i < count; i++) {
    const daysAgo = i * 2 + Math.floor(rand() * 3);
    const d = new Date();
    d.setDate(d.getDate() - daysAgo);
    out.push({
      date: d.toISOString(),
      channel: channels[Math.floor(rand() * channels.length)],
      outcome: outcomes[Math.floor(rand() * outcomes.length)],
    });
  }
  return out;
}

function generateAccount(idx: number, seed: number): Account {
  const rand = seededRandom(seed);
  const office = OFFICES[Math.floor(rand() * OFFICES.length)];
  const isFemaleIndemnitor = rand() > 0.4;
  const defFirst = pick(rand, FIRST_NAMES);
  const defLast = pick(rand, LAST_NAMES);
  const indFirst = isFemaleIndemnitor ? pick(rand, FIRST_NAMES_F) : pick(rand, FIRST_NAMES);
  const sameFamily = rand() > 0.55;
  const indLast = sameFamily ? defLast : pick(rand, LAST_NAMES);

  const status = weightedStatus(rand);
  const bondAmount = [10_000, 15_000, 25_000, 35_000, 50_000, 75_000, 100_000, 150_000][Math.floor(rand() * 8)];

  const daysPastDue =
    status === 'Active' ? Math.floor(rand() * 30)
    : status === 'Delinquent' ? 31 + Math.floor(rand() * 30)
    : status === 'Escalated' ? 61 + Math.floor(rand() * 30)
    : status === 'Legal' ? 121 + Math.floor(rand() * 60)
    : Math.floor(rand() * 15);

  const riskScore =
    status === 'Active' ? 10 + Math.floor(rand() * 25)
    : status === 'Delinquent' ? 40 + Math.floor(rand() * 25)
    : status === 'Escalated' ? 60 + Math.floor(rand() * 20)
    : status === 'Legal' ? 85 + Math.floor(rand() * 15)
    : 20 + Math.floor(rand() * 30);

  const totalOwed = Math.round(bondAmount * 0.08);
  const recoveredFrac = status === 'Payment Plan'
    ? 0.2 + rand() * 0.5
    : status === 'Legal' ? rand() * 0.1
    : rand() * 0.3;
  const recovered = Math.round(totalOwed * recoveredFrac);
  const amountOwed = Math.max(0, totalOwed - recovered);

  const lastContactDays = Math.floor(rand() * 14) + 1;
  const lastContact = new Date();
  lastContact.setDate(lastContact.getDate() - lastContactDays);

  const bondDate = new Date();
  bondDate.setDate(bondDate.getDate() - daysPastDue - 30);

  const courtDate = new Date();
  courtDate.setDate(courtDate.getDate() + Math.floor(rand() * 180) - 30);

  const indemnitorPhone =
    `(${Math.floor(rand() * 700) + 200}) ${Math.floor(rand() * 800) + 200}-${String(Math.floor(rand() * 9999)).padStart(4, '0')}`;

  const address = pick(rand, ADDRESS_BY_OFFICE[office]);

  const isForfeited = rand() > 0.92;

  return {
    id: `gen-${1000 + idx}`,
    bondId: `BB-2024-${String(2000 + idx).padStart(4, '0')}`,
    defendant: {
      name: `${defFirst} ${defLast}`,
      dob: `19${70 + Math.floor(rand() * 25)}-${String(Math.floor(rand() * 12) + 1).padStart(2, '0')}-${String(Math.floor(rand() * 28) + 1).padStart(2, '0')}`,
      charges: pick(rand, CHARGES),
      bondDate: bondDate.toISOString(),
      courtDate: isForfeited ? 'Forfeited' : courtDate.toISOString(),
    },
    indemnitor: {
      name: `${indFirst} ${indLast}`,
      phone: indemnitorPhone,
      email: `${indFirst.toLowerCase()}.${indLast.toLowerCase()}@email.com`,
      address,
      employer: pick(rand, EMPLOYERS),
    },
    bondAmount,
    amountOwed,
    daysPastDue,
    riskScore,
    status,
    office,
    lastContact: lastContact.toISOString(),
    nextAction: pick(rand, NEXT_ACTIONS),
    payments: generatePayments(rand, status),
    communications: generateCommunications(rand),
    compliance: {
      accountId: `gen-${1000 + idx}`,
      doNotContact: rand() < 0.04,
      legalHold: status === 'Legal' && rand() < 0.5,
      disputeFlag: rand() < 0.06,
      ceaseAndDesist: rand() < 0.03,
      bankruptcyFlag: rand() < 0.03,
      deceasedFlag: false,
      wrongPartyFlag: rand() < 0.05,
      representedByAttorney: status === 'Legal' && rand() < 0.6,
      preferredContactMethod: rand() < 0.5 ? 'sms' : 'phone',
      contactWindowStart: '09:00',
      contactWindowEnd: '18:00',
      consentSms: rand() > 0.1,
      consentEmail: rand() > 0.08,
      consentVoice: rand() > 0.12,
      lastConsentUpdatedAt: lastContact.toISOString(),
    },
  };
}

export function generateMockAccounts(n: number = 42, baseSeed: number = 4127): Account[] {
  return Array.from({ length: n }, (_, i) => generateAccount(i, baseSeed + i * 97));
}

export const generatedAccounts: Account[] = generateMockAccounts(42);
