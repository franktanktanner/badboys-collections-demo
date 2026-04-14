import { motion } from 'framer-motion';
import { AgentConfig } from '../components/Automation/AgentConfig';
import { EscalationTimeline } from '../components/Automation/EscalationTimeline';
import { CallTranscript } from '../components/Automation/CallTranscript';

export function Automation() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35 }}
      className="space-y-6"
    >
      <div className="grid grid-cols-1 gap-6 xl:grid-cols-5">
        <div className="xl:col-span-3">
          <AgentConfig />
        </div>
        <div className="xl:col-span-2">
          <EscalationTimeline />
        </div>
      </div>
      <CallTranscript />
    </motion.div>
  );
}
