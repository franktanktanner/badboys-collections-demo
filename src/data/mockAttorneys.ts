import type { Attorney, AttorneyStatus, Office } from '../types';

const data: Omit<Attorney, 'id' | 'status' | 'referrals' | 'revenue' | 'lastContact'>[] = [
  { name: 'Marcus Pinkerton',   firm: 'Pinkerton Criminal Defense',    specialty: 'Violent Crimes, DUI',           location: 'San Jose, CA',        office: 'San Jose',       email: 'm.pinkerton@pinkerton-law.com', phone: '(408) 555-0187' },
  { name: 'Shira Bloomfield',   firm: 'Bloomfield & Yu',               specialty: 'Drug Offenses',                 location: 'San Jose, CA',        office: 'San Jose',       email: 'sbloomfield@bloomyu.com',        phone: '(408) 555-0341' },
  { name: 'Devansh Mehta',      firm: 'Mehta Criminal Defense',        specialty: 'White Collar, Tech Fraud',      location: 'San Jose, CA',        office: 'San Jose',       email: 'dmehta@mehtadef.com',           phone: '(408) 555-0412' },
  { name: 'Sasha Velez',        firm: 'Velez & Associates',            specialty: 'Drug Offenses, Federal',        location: 'Oakland, CA',         office: 'Oakland',        email: 'svelez@velezlaw.com',           phone: '(510) 555-0142' },
  { name: 'Khalil Bennett',     firm: 'Bennett Criminal Defense',      specialty: 'Violent Crimes',                location: 'Oakland, CA',         office: 'Oakland',        email: 'kbennett@bennettdef.com',       phone: '(510) 555-0310' },
  { name: 'Evelyn Tcherkassky', firm: 'Tcherkassky Defense',           specialty: 'Sex Crimes, Appeals',           location: 'Oakland, CA',         office: 'Oakland',        email: 'et@tcherkasskylaw.com',         phone: '(415) 555-0159' },
  { name: 'Dominic Ashcroft',   firm: 'Ashcroft & Partners',           specialty: 'Fraud, Embezzlement',           location: 'Redwood City, CA',    office: 'Redwood City',   email: 'dashcroft@ashcroftlaw.com',      phone: '(650) 555-0147' },
  { name: 'Xiomara Leclerc',    firm: 'Leclerc Defense',               specialty: 'Cybercrime, White Collar',      location: 'Redwood City, CA',    office: 'Redwood City',   email: 'xleclerc@leclercdef.com',        phone: '(650) 555-0298' },
  { name: 'Chandler Boyd',      firm: 'Boyd Defense Group',            specialty: 'White Collar, Fraud',           location: 'Los Angeles, CA',     office: 'Los Angeles',    email: 'cboyd@boydgroup.com',           phone: '(213) 555-0321' },
  { name: 'Tavish McKenna',     firm: 'McKenna Trial Group',           specialty: 'Federal, RICO',                 location: 'Los Angeles, CA',     office: 'Los Angeles',    email: 'tmckenna@mckennatrial.com',     phone: '(213) 555-0272' },
  { name: 'Mireya Calderón',    firm: 'Calderón Law Group',            specialty: 'Homicide, Serious Felonies',    location: 'Los Angeles, CA',     office: 'Los Angeles',    email: 'mcalderon@calderonlaw.com',     phone: '(213) 555-0455' },
  { name: 'Priya Aroon',        firm: 'Aroon Criminal Law',            specialty: 'Assault, Domestic',             location: 'Santa Ana, CA',       office: 'Santa Ana',      email: 'paroon@aroonlaw.com',           phone: '(714) 555-0198' },
  { name: 'Gerard Halloway',    firm: 'Halloway Defense',              specialty: 'DUI, Traffic Felonies',         location: 'Santa Ana, CA',       office: 'Santa Ana',      email: 'ghalloway@hallowaydef.com',      phone: '(714) 555-0521' },
  { name: 'Brian Osei-Mensah',  firm: 'Osei-Mensah Law Offices',       specialty: 'Violent Crimes, Juvenile',      location: 'San Diego, CA',       office: 'San Diego',      email: 'bom@oseimensahlaw.com',         phone: '(619) 555-0273' },
  { name: 'Camille Pardini',    firm: 'Pardini Criminal Defense',      specialty: 'Drug Trafficking, Federal',     location: 'San Diego, CA',       office: 'San Diego',      email: 'cpardini@pardinidef.com',        phone: '(619) 555-0481' },
  { name: 'Ryan Kincaid',       firm: 'Kincaid Defense',               specialty: 'DUI, Traffic, Misdemeanors',    location: 'Modesto, CA',         office: 'Modesto',        email: 'rkincaid@kincaiddefense.com',   phone: '(209) 555-0219' },
  { name: 'Jordan Whitlock',    firm: 'Whitlock & Price',              specialty: 'Violent Crimes, Assault',       location: 'Modesto, CA',         office: 'Modesto',        email: 'jwhitlock@whitlockprice.com',    phone: '(209) 555-0367' },
  { name: 'Aisha Dubois',       firm: 'Dubois Law Firm',               specialty: 'Domestic Violence, Restraining Orders', location: 'Stockton, CA',  office: 'Stockton',       email: 'adubois@duboisfirm.com',        phone: '(209) 555-0171' },
  { name: 'Reza Farahani',      firm: 'Farahani Trial Attorneys',      specialty: 'Federal, Drug Cases',           location: 'Stockton, CA',        office: 'Stockton',       email: 'rfarahani@farahanilaw.com',     phone: '(209) 555-0438' },
  { name: 'Jamila Worthington', firm: 'Worthington & Kline',           specialty: 'Weapons, Gang Enhancement',     location: 'Long Beach, CA',      office: 'Long Beach',     email: 'jworthington@wklegal.com',       phone: '(562) 555-0145' },
  { name: 'Oluwakemi Adebayo',  firm: 'Adebayo Law',                   specialty: 'Juvenile, Violent Crimes',      location: 'Long Beach, CA',      office: 'Long Beach',     email: 'oadebayo@adebayolaw.com',       phone: '(562) 555-0267' },
  { name: 'Nikolai Petrosian',  firm: 'Petrosian Criminal Defense',    specialty: 'Homicide, Serious Felonies',    location: 'Anaheim, CA',         office: 'Anaheim',        email: 'nikolai@petrosianlaw.com',      phone: '(714) 555-0256' },
  { name: 'Thaddeus Ng',        firm: 'Ng Defense Group',              specialty: 'Narcotics, Federal Appeals',    location: 'Anaheim, CA',         office: 'Anaheim',        email: 'tng@ngdefense.com',             phone: '(714) 555-0389' },
  { name: 'Ines Saavedra',      firm: 'Saavedra Criminal Law',         specialty: 'Immigration Crimes, Federal',   location: 'San Bernardino, CA',  office: 'San Bernardino', email: 'isaavedra@saavedralaw.com',     phone: '(909) 555-0183' },
  { name: 'Damian Okolie',      firm: 'Okolie Defense',                specialty: 'Violent Crimes, Robbery',       location: 'San Bernardino, CA',  office: 'San Bernardino', email: 'dokolie@okoliedef.com',          phone: '(909) 555-0412' },
  { name: 'Rodrigo Cardenas',   firm: 'Cardenas Trial Attorneys',      specialty: 'Drug Trafficking, Federal',     location: 'Riverside, CA',       office: 'Riverside',      email: 'rcardenas@cardenastrial.com',   phone: '(951) 555-0234' },
  { name: 'Alina Rosenbaum',    firm: 'Rosenbaum Criminal Defense',    specialty: 'Fraud, Domestic',               location: 'Riverside, CA',       office: 'Riverside',      email: 'arosenbaum@rosenbaumdef.com',    phone: '(951) 555-0357' },
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

export const scraperCountiesAll = [
  { name: 'Santa Clara',     office: 'San Jose' as Office,        records: 1247, added: 12 },
  { name: 'Alameda',         office: 'Oakland' as Office,         records: 1089, added: 8 },
  { name: 'San Mateo',       office: 'Redwood City' as Office,    records: 476,  added: 5 },
  { name: 'Los Angeles',     office: 'Los Angeles' as Office,     records: 4832, added: 47 },
  { name: 'Orange',          office: 'Santa Ana' as Office,       records: 1421, added: 14 },
  { name: 'San Diego',       office: 'San Diego' as Office,       records: 1654, added: 18 },
  { name: 'Stanislaus',      office: 'Modesto' as Office,         records: 389,  added: 3 },
  { name: 'San Joaquin',     office: 'Stockton' as Office,        records: 512,  added: 4 },
  { name: 'San Bernardino',  office: 'San Bernardino' as Office,  records: 847,  added: 7 },
  { name: 'Riverside',       office: 'Riverside' as Office,       records: 982,  added: 9 },
];

export const scraperCounties = scraperCountiesAll;
