import type { TranscriptTurn } from '../types';

export const callTranscript: TranscriptTurn[] = [
  { speaker: 'AI', timestamp: '00:00', text: "Hi, is this Rosa Reyes? This is Ava calling from Bad Boys Bail Bonds regarding bond number BB-2024-1040 for Marcus Reyes. Do you have a moment?" },
  { speaker: 'Customer', timestamp: '00:08', text: "Yeah, this is her. What's going on?" },
  { speaker: 'AI', timestamp: '00:11', text: "Thanks for taking my call, Rosa. Our records show the account has an outstanding balance of $12,400 and we haven't received a payment in 47 days. I'm calling to figure out a plan that works for you." },
  { speaker: 'Customer', timestamp: '00:26', text: "I know, I've been trying. Things have been tight since I lost hours at the hospital. I can't do the full amount right now." },
  { speaker: 'AI', timestamp: '00:37', text: "I completely understand, and I appreciate you being upfront with me. Based on your payment history we can structure a plan that keeps you current without putting the account into escalation. Would $425 per month over 30 months be workable?" },
  { speaker: 'Customer', timestamp: '00:54', text: "That's… actually doable. Can we start next month? I have rent coming up." },
  { speaker: 'AI', timestamp: '01:03', text: "Absolutely. I can schedule the first auto-debit for the 15th of next month. Can you confirm the routing and account number on file are still current, or would you prefer to use a different account?" },
  { speaker: 'Customer', timestamp: '01:18', text: "Same one, the Chase account. That still works." },
  { speaker: 'AI', timestamp: '01:22', text: "Perfect. I'm sending a confirmation to rosa.reyes@email.com with the full payment schedule and a link to review the plan. You'll also receive an SMS 48 hours before each debit. Does that work?" },
  { speaker: 'Customer', timestamp: '01:38', text: "Yeah, that works. Thanks for being reasonable about this." },
  { speaker: 'AI', timestamp: '01:43', text: "Thank you for working with us, Rosa. I've flagged the account as current and logged this conversation. If anything changes, call 1-800-BAIL-OUT and any of our agents can pull up the plan. Have a great afternoon." },
  { speaker: 'Customer', timestamp: '01:56', text: "You too, bye." },
];

export const callSummary = {
  duration: '1m 58s',
  outcome: 'Payment plan accepted',
  planTerms: '$425/mo × 30 mo',
  recovered: 12750,
  nextAction: 'Auto-debit scheduled for the 15th',
  sentiment: 'Cooperative',
};
