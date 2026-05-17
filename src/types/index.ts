export type AccountStatus =
  | 'Active'
  | 'Delinquent'
  | 'Escalated'
  | 'Legal'
  | 'Payment Plan';

export type Office = string;

export interface Payment {
  date: string;
  amount: number;
  method: 'ACH' | 'Card' | 'Wire' | 'Check';
  status: 'Cleared' | 'Pending' | 'Failed';
  id?: string;
  accountId?: string;
  paymentPlanId?: string;
  attributedOutreachEventId?: string;
  externalPaymentId?: string;
  createdAt?: string;
}

export interface Communication {
  date: string;
  channel: 'AI Call' | 'SMS' | 'Email' | 'Letter' | 'Skip Trace';
  outcome: string;
  id?: string;
  accountId?: string;
  direction?: 'inbound' | 'outbound';
  contentSummary?: string;
  transcript?: string;
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
  agencyId?: string;
  officeId?: string;
  recoveryStatus?: RecoveryStatus;
  priority?: RecoveryPriority;
  assignedUserId?: string;
  contacts?: Contact[];
  bond?: Bond;
  balance?: Balance;
  compliance?: ComplianceFlag;
  outreachEvents?: OutreachEvent[];
  promisesToPay?: PromiseToPay[];
  paymentPlans?: PaymentPlan[];
  handoffs?: HumanHandoff[];
  recoveryActions?: RecoveryAction[];
  createdAt?: string;
  updatedAt?: string;
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

export interface TranscriptTurn {
  speaker: 'AI' | 'Customer';
  timestamp: string;
  text: string;
}

export interface AgencyBranding {
  primaryColor: string;
  primaryLightColor: string;
  primaryDarkColor: string;
  dangerColor: string;
  accentColor: string;
}

export interface AgencyLabels {
  commandCenter: string;
  accounts: string;
  automation: string;
  reports: string;
  totalReceivables: string;
  activeRecoveryAccounts: string;
  dollarsRecovered: string;
  promisesCreated: string;
  promisesKept: string;
  promisesBroken: string;
  humanHandoffs: string;
  highRiskAccounts: string;
  doNotContactAccounts: string;
}

export interface Agency {
  id: string;
  slug: string;
  name: string;
  legalName: string;
  productName: string;
  dashboardTitle: string;
  initials: string;
  slogan: string;
  phone: string;
  displayPhone: string;
  supportEmail: string;
  timezone: string;
  branding: AgencyBranding;
  labels: AgencyLabels;
  offices: AgencyOffice[];
}

export interface AgencyOffice {
  id: string;
  agencyId: string;
  name: Office;
  region: string;
  county: string;
  address: string;
  phone: string;
  notificationEmail: string;
}

export type AgencyUserRole = 'owner' | 'admin' | 'manager' | 'collector' | 'compliance';

export interface AgencyUser {
  id: string;
  agencyId: string;
  officeId?: string;
  name: string;
  email: string;
  role: AgencyUserRole;
  isActive: boolean;
}

export type ContactKind = 'defendant' | 'indemnitor' | 'co_indemnitor' | 'employer' | 'attorney';
export type PreferredContactMethod = 'phone' | 'sms' | 'email' | 'letter' | 'none';

export interface Contact {
  id: string;
  accountId: string;
  agencyId: string;
  kind: ContactKind;
  name: string;
  phone?: string;
  email?: string;
  address?: string;
  employer?: string;
  relationship?: string;
  preferredContactMethod: PreferredContactMethod;
  contactWindowStart?: string;
  contactWindowEnd?: string;
}

export interface Defendant {
  id: string;
  accountId: string;
  name: string;
  dob?: string;
  charges?: string;
  courtDate?: string;
  courtStatus?: string;
}

export interface Indemnitor {
  id: string;
  accountId: string;
  name: string;
  phone?: string;
  email?: string;
  address?: string;
  employer?: string;
  relationshipToDefendant?: string;
}

export interface Bond {
  id: string;
  accountId: string;
  bondId: string;
  bondAmount: number;
  premiumRate?: number;
  bondDate: string;
  courtCaseNumber?: string;
}

export interface Balance {
  accountId: string;
  originalAmount: number;
  amountOwed: number;
  recoveredAmount: number;
  lastPaymentAt?: string;
  daysPastDue: number;
}

export type OutreachChannel = 'ai_call' | 'manual_call' | 'sms' | 'email' | 'letter' | 'skip_trace';
export type OutreachOutcome =
  | 'queued'
  | 'completed'
  | 'failed'
  | 'blocked'
  | 'no_answer'
  | 'promise_logged'
  | 'payment_collected'
  | 'human_review_requested';

export interface OutreachEvent {
  id: string;
  agencyId: string;
  accountId: string;
  contactId?: string;
  channel: OutreachChannel;
  outcome: OutreachOutcome;
  summary: string;
  amount?: number;
  createdAt: string;
  createdBy: 'system' | 'user' | 'fixture';
}

export type PromiseToPayStatus =
  | 'pending'
  | 'kept'
  | 'broken'
  | 'partially_paid'
  | 'cancelled'
  | 'escalated';

export interface PromiseToPay {
  id: string;
  agencyId: string;
  accountId: string;
  contactId: string;
  amountPromised: number;
  amountPaid: number;
  dueDate: string;
  status: PromiseToPayStatus;
  createdAt: string;
  resolvedAt?: string;
  notes?: string;
}

export type PaymentPlanStatus = 'active' | 'paused' | 'completed' | 'defaulted' | 'cancelled';

export interface PaymentPlan {
  id: string;
  agencyId: string;
  accountId: string;
  contactId: string;
  monthlyAmount: number;
  totalMonths: number;
  monthsRemaining: number;
  nextDueDate?: string;
  autoDebit: boolean;
  status: PaymentPlanStatus;
  createdAt: string;
}

export interface ComplianceFlag {
  accountId: string;
  doNotContact: boolean;
  legalHold: boolean;
  disputeFlag: boolean;
  ceaseAndDesist: boolean;
  bankruptcyFlag: boolean;
  deceasedFlag: boolean;
  wrongPartyFlag: boolean;
  representedByAttorney: boolean;
  preferredContactMethod: PreferredContactMethod;
  contactWindowStart?: string;
  contactWindowEnd?: string;
  consentSms: boolean;
  consentEmail: boolean;
  consentVoice: boolean;
  lastConsentUpdatedAt: string;
}

export type HumanHandoffReason =
  | 'compliance_block'
  | 'dispute'
  | 'legal_review'
  | 'broken_promise'
  | 'high_risk'
  | 'customer_requested'
  | 'manual_review';

export type HumanHandoffStatus = 'open' | 'in_review' | 'resolved' | 'cancelled';

export interface HumanHandoff {
  id: string;
  agencyId: string;
  accountId: string;
  reason: HumanHandoffReason;
  status: HumanHandoffStatus;
  assignedUserId?: string;
  summary: string;
  createdAt: string;
  resolvedAt?: string;
}

export type RecoveryStatus =
  | 'active'
  | 'delinquent'
  | 'promise_to_pay'
  | 'payment_plan'
  | 'broken_promise'
  | 'needs_human_review'
  | 'escalated'
  | 'legal_hold'
  | 'do_not_contact'
  | 'write_off'
  | 'closed';

export type RecoveryPriority = 'low' | 'medium' | 'high' | 'critical';

export type RecoveryActionType =
  | 'ai_call'
  | 'sms'
  | 'email'
  | 'payment_plan'
  | 'promise_to_pay'
  | 'escalate'
  | 'skip_trace'
  | 'human_review';

export type RecoveryActionStatus = 'ready' | 'blocked' | 'completed' | 'failed';

export interface RecoveryAction {
  id: string;
  type: RecoveryActionType;
  label: string;
  accountId: string;
  status: RecoveryActionStatus;
  blockedReason?: string;
  createdAt: string;
}
