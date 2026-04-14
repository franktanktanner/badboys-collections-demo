import type { Attorney, AttorneyStatus } from '../types';

const data: Omit<Attorney, 'id' | 'status' | 'referrals' | 'revenue' | 'lastContact'>[] = [
  { name: 'Marcus Pinkerton', firm: 'Pinkerton Criminal Defense', specialty: 'Violent Crimes, DUI', location: 'San Jose, CA', email: 'm.pinkerton@pinkerton-law.com', phone: '(408) 555-0187' },
  { name: 'Sasha Velez', firm: 'Velez & Associates', specialty: 'Drug Offenses, Federal', location: 'Oakland, CA', email: 'svelez@velezlaw.com', phone: '(510) 555-0142' },
  { name: 'Chandler Boyd', firm: 'Boyd Defense Group', specialty: 'White Collar, Fraud', location: 'Los Angeles, CA', email: 'cboyd@boydgroup.com', phone: '(213) 555-0321' },
  { name: 'Priya Aroon', firm: 'Aroon Criminal Law', specialty: 'Assault, Domestic', location: 'Santa Ana, CA', email: 'paroon@aroonlaw.com', phone: '(714) 555-0198' },
  { name: 'Brian Osei-Mensah', firm: 'Osei-Mensah Law Offices', specialty: 'Violent Crimes, Juvenile', location: 'San Diego, CA', email: 'bom@oseimensahlaw.com', phone: '(619) 555-0273' },
  { name: 'Evelyn Tcherkassky', firm: 'Tcherkassky Defense', specialty: 'Sex Crimes, Appeals', location: 'San Francisco, CA', email: 'et@tcherkasskylaw.com', phone: '(415) 555-0159' },
  { name: 'Rodrigo Cardenas', firm: 'Cardenas Trial Attorneys', specialty: 'Drug Trafficking, Federal', location: 'Riverside, CA', email: 'rcardenas@cardenastrial.com', phone: '(951) 555-0234' },
  { name: 'Jamila Worthington', firm: 'Worthington & Kline', specialty: 'Weapons, Gang Enhancement', location: 'Long Beach, CA', email: 'jworthington@wklegal.com', phone: '(562) 555-0145' },
  { name: 'Nikolai Petrosian', firm: 'Petrosian Criminal Defense', specialty: 'Homicide, Serious Felonies', location: 'Anaheim, CA', email: 'nikolai@petrosianlaw.com', phone: '(714) 555-0256' },
  { name: 'Aisha Dubois', firm: 'Dubois Law Firm', specialty: 'Domestic Violence, Restraining Orders', location: 'Stockton, CA', email: 'adubois@duboisfirm.com', phone: '(209) 555-0171' },
  { name: 'Ryan Kincaid', firm: 'Kincaid Defense', specialty: 'DUI, Traffic, Misdemeanors', location: 'Modesto, CA', email: 'rkincaid@kincaiddefense.com', phone: '(209) 555-0219' },
  { name: 'Ines Saavedra', firm: 'Saavedra Criminal Law', specialty: 'Immigration Crimes, Federal', location: 'San Bernardino, CA', email: 'isaavedra@saavedralaw.com', phone: '(909) 555-0183' },
  { name: 'Dominic Ashcroft', firm: 'Ashcroft & Partners', specialty: 'Fraud, Embezzlement', location: 'Redwood City, CA', email: 'dashcroft@ashcroftlaw.com', phone: '(650) 555-0147' },
  { name: 'Xiomara Leclerc', firm: 'Leclerc Defense', specialty: 'Cybercrime, White Collar', location: 'Palo Alto, CA', email: 'xleclerc@leclercdef.com', phone: '(650) 555-0298' },
  { name: 'Khalil Bennett', firm: 'Bennett Criminal Defense', specialty: 'Violent Crimes', location: 'Oakland, CA', email: 'kbennett@bennettdef.com', phone: '(510) 555-0310' },
  { name: 'Shira Bloomfield', firm: 'Bloomfield & Yu', specialty: 'Drug Offenses', location: 'San Jose, CA', email: 'sbloomfield@bloomyu.com', phone: '(408) 555-0341' },
  { name: 'Tavish McKenna', firm: 'McKenna Trial Group', specialty: 'Federal, RICO', location: 'Los Angeles, CA', email: 'tmckenna@mckennatrial.com', phone: '(213) 555-0272' },
  { name: 'Oluwakemi Adebayo', firm: 'Adebayo Law', specialty: 'Juvenile, Violent Crimes', location: 'Long Beach, CA', email: 'oadebayo@adebayolaw.com', phone: '(562) 555-0267' },
];

const statuses: AttorneyStatus[] = ['New', 'Contacted', 'Warm', 'Partner', 'Inactive'];
const statusWeights = [0.25, 0.3, 0.2, 0.18, 0.07];

function weightedStatus(rand: number): AttorneyStatus {
  let sum = 0;
  for (let i = 0; i < statuses.length; i++) {
    sum += statusWeights[i];
    if (rand <= sum) return statuses[i];
  }
  return 'New';
}

export const mockAttorneys: Attorney[] = data.map((a, i) => {
  const statusRand = ((i * 17) % 100) / 100;
  const status = weightedStatus(statusRand);
  const referrals = status === 'Partner' ? Math.floor((i * 13) % 25) + 8 : status === 'Warm' ? Math.floor((i * 7) % 6) : 0;
  const revenue = referrals * (12000 + (i * 1700) % 38000);
  const lastContactDays = Math.floor((i * 11) % 45) + 1;
  const d = new Date();
  d.setDate(d.getDate() - lastContactDays);
  return {
    id: `atty-${i + 1}`,
    ...a,
    status,
    referrals,
    revenue,
    lastContact: d.toISOString(),
  };
});

export const scraperCounties = [
  { name: 'Santa Clara', records: 1247, added: 12 },
  { name: 'Alameda', records: 1089, added: 8 },
  { name: 'Los Angeles', records: 4832, added: 47 },
  { name: 'San Diego', records: 1654, added: 18 },
  { name: 'Orange', records: 1421, added: 14 },
  { name: 'Riverside', records: 982, added: 9 },
  { name: 'San Bernardino', records: 847, added: 7 },
  { name: 'San Joaquin', records: 512, added: 4 },
  { name: 'Stanislaus', records: 389, added: 3 },
  { name: 'San Mateo', records: 476, added: 5 },
];
