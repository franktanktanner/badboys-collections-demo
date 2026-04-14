export type AccountStatus =
  | 'Active'
  | 'Delinquent'
  | 'Escalated'
  | 'Legal'
  | 'Payment Plan';

export type Office =
  | 'San Jose'
  | 'Oakland'
  | 'Redwood City'
  | 'Los Angeles'
  | 'Santa Ana'
  | 'San Diego'
  | 'Modesto'
  | 'Stockton'
  | 'Long Beach'
  | 'Anaheim'
  | 'San Bernardino'
  | 'Riverside';

export interface Payment {
  date: string;
  amount: number;
  method: 'ACH' | 'Card' | 'Wire' | 'Check';
  status: 'Cleared' | 'Pending' | 'Failed';
}

export interface Communication {
  date: string;
  channel: 'AI Call' | 'SMS' | 'Email' | 'Letter' | 'Skip Trace';
  outcome: string;
}

export interface Account {
  id: string;
  bondId: string;
  defendant: {
    name: string;
    dob: string;
    charges: string;
    bondDate: string;
    courtDate: string;
  };
  indemnitor: {
    name: string;
    phone: string;
    email: string;
    address: string;
    employer: string;
  };
  bondAmount: number;
  amountOwed: number;
  daysPastDue: number;
  riskScore: number;
  status: AccountStatus;
  office: Office;
  lastContact: string;
  nextAction: string;
  payments: Payment[];
  communications: Communication[];
}

export type ActivityType =
  | 'ai_call'
  | 'sms'
  | 'email'
  | 'payment'
  | 'skip_trace'
  | 'escalation'
  | 'payment_plan'
  | 'legal';

export interface Activity {
  id: string;
  timestamp: string;
  type: ActivityType;
  title: string;
  description: string;
  outcome?: string;
  amount?: number;
  office?: Office;
}

export type AttorneyStatus = 'New' | 'Contacted' | 'Warm' | 'Partner' | 'Inactive';

export interface Attorney {
  id: string;
  name: string;
  firm: string;
  specialty: string;
  location: string;
  email: string;
  phone: string;
  status: AttorneyStatus;
  referrals: number;
  revenue: number;
  lastContact: string;
}

export interface TranscriptTurn {
  speaker: 'AI' | 'Customer';
  timestamp: string;
  text: string;
}
