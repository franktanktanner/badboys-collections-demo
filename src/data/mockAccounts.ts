import type { Account, AccountStatus, Office } from '../types';

const OFFICES: Office[] = [
  'San Jose', 'Oakland', 'Redwood City', 'Los Angeles', 'Santa Ana', 'San Diego',
];

const defendants = [
  { name: 'Marcus Reyes', charges: 'Felony DUI, Evasion', dob: '1987-03-14' },
  { name: 'Darius Whitfield', charges: 'Possession w/ Intent', dob: '1991-07-22' },
  { name: 'Jasmine Okafor', charges: 'Assault w/ Deadly Weapon', dob: '1994-11-02' },
  { name: 'Luis Carrillo', charges: 'Grand Theft Auto', dob: '1989-05-30' },
  { name: 'Tanya Brooks', charges: 'Drug Trafficking', dob: '1983-09-18' },
  { name: 'Devon Nakamura', charges: 'Burglary, Resisting Arrest', dob: '1992-02-11' },
  { name: 'Priya Kapoor', charges: 'Embezzlement', dob: '1986-12-04' },
  { name: 'Antonio Molina', charges: 'Felony Weapons', dob: '1990-06-27' },
  { name: 'Keisha Williams', charges: 'Domestic Battery', dob: '1988-04-19' },
  { name: 'Rashid Abdullah', charges: 'Robbery', dob: '1995-08-09' },
  { name: 'Valentina Russo', charges: 'Fraud, Identity Theft', dob: '1982-10-25' },
  { name: 'Tyrone Jackson', charges: 'Attempted Murder', dob: '1984-01-15' },
  { name: 'Mei Chen', charges: 'Cybercrime, Wire Fraud', dob: '1990-03-21' },
  { name: 'Sergio Vasquez', charges: 'Felony DUI', dob: '1987-07-06' },
  { name: 'Ebony Foster', charges: 'Possession', dob: '1993-11-28' },
  { name: 'Kwame Adeyemi', charges: 'Gang Enhancement, Assault', dob: '1991-04-03' },
  { name: 'Alejandra Torres', charges: 'Human Trafficking', dob: '1985-09-12' },
  { name: 'Brendan O\'Sullivan', charges: 'Manslaughter', dob: '1988-02-19' },
  { name: 'Sunita Patel', charges: 'Check Fraud', dob: '1992-06-14' },
  { name: 'Derrick Coleman', charges: 'Armed Robbery', dob: '1989-12-07' },
  { name: 'Yuki Tanaka', charges: 'Money Laundering', dob: '1986-05-23' },
  { name: 'Jamal Pierce', charges: 'Felony Evasion, Narcotics', dob: '1993-08-31' },
  { name: 'Rosalind Nguyen', charges: 'Extortion', dob: '1987-01-09' },
  { name: 'Emilio Bautista', charges: 'Vehicular Homicide', dob: '1984-10-17' },
  { name: 'Naomi Osei', charges: 'Aggravated Assault', dob: '1991-03-26' },
  { name: 'Hector Ramirez', charges: 'Felony DUI, Hit & Run', dob: '1990-11-04' },
  { name: 'Chanel Mbeki', charges: 'Narcotics Distribution', dob: '1988-07-18' },
  { name: 'Mikhail Volkov', charges: 'Organized Crime', dob: '1981-09-05' },
];

const indemnitors = [
  { name: 'Rosa Reyes', employer: 'Valley Memorial Hospital', email: 'rosa.reyes@email.com' },
  { name: 'Gloria Whitfield', employer: 'Amazon Fulfillment', email: 'gwhitfield@email.com' },
  { name: 'Ifeoma Okafor', employer: 'Self-Employed', email: 'ifeoma.okafor@email.com' },
  { name: 'Maria Carrillo', employer: 'Kaiser Permanente', email: 'm.carrillo@email.com' },
  { name: 'Denise Brooks', employer: 'SF Unified School District', email: 'dbrooks@email.com' },
  { name: 'Yuki Nakamura', employer: 'Tesla', email: 'ynakamura@email.com' },
  { name: 'Rajesh Kapoor', employer: 'Google', email: 'rkapoor@email.com' },
  { name: 'Esperanza Molina', employer: 'Restaurant Owner', email: 'esperanza.m@email.com' },
  { name: 'Eloise Williams', employer: 'USPS', email: 'eloise.w@email.com' },
  { name: 'Fatima Abdullah', employer: 'Cerritos College', email: 'fatima.a@email.com' },
  { name: 'Marco Russo', employer: 'Construction Foreman', email: 'marco.russo@email.com' },
  { name: 'Latoya Jackson', employer: 'Oakland Parks & Rec', email: 'ljackson@email.com' },
  { name: 'Wei Chen', employer: 'Stanford Hospital', email: 'wei.chen@email.com' },
  { name: 'Carmen Vasquez', employer: 'Long Beach City', email: 'cvasquez@email.com' },
  { name: 'Andre Foster', employer: 'Warehouse Supervisor', email: 'andre.f@email.com' },
  { name: 'Amara Adeyemi', employer: 'LAUSD', email: 'amara.a@email.com' },
  { name: 'Diego Torres', employer: 'Farm Laborer', email: 'diego.t@email.com' },
  { name: 'Sinead O\'Sullivan', employer: 'Nursing Agency', email: 'sinead.os@email.com' },
  { name: 'Amit Patel', employer: '7-Eleven Franchise Owner', email: 'apatel@email.com' },
  { name: 'Theresa Coleman', employer: 'Home Depot', email: 't.coleman@email.com' },
  { name: 'Hiroshi Tanaka', employer: 'Sony Entertainment', email: 'hiroshi.t@email.com' },
  { name: 'Alicia Pierce', employer: 'Kaiser Call Center', email: 'alicia.p@email.com' },
  { name: 'Linh Nguyen', employer: 'Nail Salon Owner', email: 'linh.n@email.com' },
  { name: 'Gloria Bautista', employer: 'Elementary Teacher', email: 'gloria.b@email.com' },
  { name: 'Kwame Osei', employer: 'UPS', email: 'kwame.osei@email.com' },
  { name: 'Camila Ramirez', employer: 'Restaurant Server', email: 'camila.r@email.com' },
  { name: 'Zanele Mbeki', employer: 'Medical Billing', email: 'zanele.m@email.com' },
  { name: 'Elena Volkov', employer: 'Russian Bakery Owner', email: 'elena.v@email.com' },
];

const addresses = [
  '2847 Story Rd, San Jose, CA 95122',
  '1920 International Blvd, Oakland, CA 94606',
  '450 Marshall St, Redwood City, CA 94063',
  '1733 W Vernon Ave, Los Angeles, CA 90062',
  '2315 N Tustin Ave, Santa Ana, CA 92705',
  '3902 University Ave, San Diego, CA 92105',
];

function seededRandom(seed: number) {
  return function () {
    seed = (seed * 9301 + 49297) % 233280;
    return seed / 233280;
  };
}

function generatePayments(rand: () => number, count: number) {
  const payments: Account['payments'] = [];
  const methods: Array<'ACH' | 'Card' | 'Wire' | 'Check'> = ['ACH', 'Card', 'Wire', 'Check'];
  const statuses: Array<'Cleared' | 'Pending' | 'Failed'> = ['Cleared', 'Cleared', 'Cleared', 'Failed', 'Pending'];
  for (let i = 0; i < count; i++) {
    const daysAgo = Math.floor(rand() * 180) + i * 14;
    const d = new Date();
    d.setDate(d.getDate() - daysAgo);
    payments.push({
      date: d.toISOString(),
      amount: Math.floor(rand() * 4500) + 250,
      method: methods[Math.floor(rand() * methods.length)],
      status: statuses[Math.floor(rand() * statuses.length)],
    });
  }
  return payments;
}

function generateComms(rand: () => number, count: number) {
  const channels: Array<'AI Call' | 'SMS' | 'Email' | 'Letter' | 'Skip Trace'> = ['AI Call', 'SMS', 'Email', 'Letter', 'Skip Trace'];
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
  ];
  const comms: Account['communications'] = [];
  for (let i = 0; i < count; i++) {
    const daysAgo = i * 2 + Math.floor(rand() * 3);
    const d = new Date();
    d.setDate(d.getDate() - daysAgo);
    comms.push({
      date: d.toISOString(),
      channel: channels[Math.floor(rand() * channels.length)],
      outcome: outcomes[Math.floor(rand() * outcomes.length)],
    });
  }
  return comms;
}

export const mockAccounts: Account[] = defendants.map((def, i) => {
  const rand = seededRandom(i * 97 + 13);
  const bondAmount = [5000, 10000, 25000, 50000, 100000, 150000, 250000, 500000, 750000, 1000000][Math.floor(rand() * 10)];
  const amountOwed = Math.floor(bondAmount * (0.05 + rand() * 0.35));
  const daysPastDue = Math.floor(rand() * 420) + 5;
  const riskScore = Math.min(100, Math.floor(daysPastDue / 4 + rand() * 30));
  let status: AccountStatus;
  if (daysPastDue < 45) status = 'Active';
  else if (daysPastDue < 90) status = rand() > 0.6 ? 'Payment Plan' : 'Delinquent';
  else if (daysPastDue < 150) status = 'Delinquent';
  else if (daysPastDue < 240) status = 'Escalated';
  else status = 'Legal';

  const office = OFFICES[i % OFFICES.length];
  const ind = indemnitors[i];
  const lastContactDays = Math.floor(rand() * 14) + 1;
  const lastContact = new Date();
  lastContact.setDate(lastContact.getDate() - lastContactDays);

  const bondDate = new Date();
  bondDate.setDate(bondDate.getDate() - daysPastDue - 30);
  const courtDate = new Date();
  courtDate.setDate(courtDate.getDate() + Math.floor(rand() * 120) - 60);

  const nextActions = [
    'AI call scheduled 4:15 PM',
    'SMS sequence — day 3',
    'Demand letter queued',
    'Skip trace in progress',
    'Payment plan review',
    'Legal escalation pending',
    'Follow-up call tomorrow',
  ];

  return {
    id: `acc-${i + 1}`,
    bondId: `BB-${2024 + (i % 2)}-${String(1040 + i).padStart(4, '0')}`,
    defendant: {
      name: def.name,
      dob: def.dob,
      charges: def.charges,
      bondDate: bondDate.toISOString(),
      courtDate: rand() > 0.85 ? 'Forfeited' : courtDate.toISOString(),
    },
    indemnitor: {
      name: ind.name,
      phone: `(${Math.floor(rand() * 800) + 200}) ${Math.floor(rand() * 800) + 200}-${String(Math.floor(rand() * 9999)).padStart(4, '0')}`,
      email: ind.email,
      address: addresses[OFFICES.indexOf(office)],
      employer: ind.employer,
    },
    bondAmount,
    amountOwed,
    daysPastDue,
    riskScore,
    status,
    office,
    lastContact: lastContact.toISOString(),
    nextAction: nextActions[Math.floor(rand() * nextActions.length)],
    payments: generatePayments(rand, Math.floor(rand() * 6) + 3),
    communications: generateComms(rand, Math.floor(rand() * 4) + 4),
  };
});

