import type { Account, RecoveryAction, RecoveryActionType } from '../types';

export const RECOVERY_ACTION_LABELS: Record<RecoveryActionType, string> = {
  ai_call: 'AI Call',
  sms: 'SMS',
  email: 'Email',
  payment_plan: 'Payment Plan',
  promise_to_pay: 'Promise-to-Pay',
  escalate: 'Escalate',
  skip_trace: 'Skip Trace',
  human_review: 'Human Review',
};

export interface ActionValidationResult {
  allowed: boolean;
  reason?: string;
}

export function validateRecoveryAction(account: Account, actionType: RecoveryActionType): ActionValidationResult {
  const compliance = account.compliance;
  if (!compliance) return { allowed: true };
  if (actionType === 'human_review') return { allowed: true };

  if (compliance.deceasedFlag) return { allowed: false, reason: 'Blocked: deceased flag requires human review.' };
  if (compliance.legalHold && actionType !== 'escalate') return { allowed: false, reason: 'Blocked: legal hold is active.' };
  if (compliance.doNotContact) return { allowed: false, reason: 'Blocked: do-not-contact is active.' };
  if (compliance.ceaseAndDesist) return { allowed: false, reason: 'Blocked: cease-and-desist is active.' };
  if (compliance.bankruptcyFlag) return { allowed: false, reason: 'Blocked: bankruptcy flag requires review.' };
  if (compliance.representedByAttorney && ['ai_call', 'sms', 'email'].includes(actionType)) {
    return { allowed: false, reason: 'Blocked: represented by attorney.' };
  }
  if (compliance.disputeFlag && ['ai_call', 'sms', 'email', 'payment_plan', 'promise_to_pay'].includes(actionType)) {
    return { allowed: false, reason: 'Blocked: dispute flag requires human review.' };
  }
  if (compliance.wrongPartyFlag && ['ai_call', 'sms'].includes(actionType)) {
    return { allowed: false, reason: 'Blocked: wrong-party phone flag.' };
  }
  if (actionType === 'ai_call' && !compliance.consentVoice) return { allowed: false, reason: 'Blocked: no voice consent.' };
  if (actionType === 'sms' && !compliance.consentSms) return { allowed: false, reason: 'Blocked: no SMS consent.' };
  if (actionType === 'email' && !compliance.consentEmail) return { allowed: false, reason: 'Blocked: no email consent.' };

  return { allowed: true };
}

export function buildRecoveryAction(account: Account, actionType: RecoveryActionType): RecoveryAction {
  const validation = validateRecoveryAction(account, actionType);
  return {
    id: `${account.id}-${actionType}-${Date.now()}`,
    accountId: account.id,
    type: actionType,
    label: RECOVERY_ACTION_LABELS[actionType],
    status: validation.allowed ? 'ready' : 'blocked',
    blockedReason: validation.reason,
    createdAt: new Date().toISOString(),
  };
}
