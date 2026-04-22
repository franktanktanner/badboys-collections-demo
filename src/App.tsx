import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { TopNav } from './components/Layout/TopNav';
import { TabNav, type TabKey } from './components/Layout/TabNav';
import { CommandCenter } from './pages/CommandCenter';
import { Accounts } from './pages/Accounts';
import { Automation } from './pages/Automation';
import { Reports } from './pages/Reports';
import type { LocationFilter } from './lib/filters';

export default function App() {
  const [tab, setTab] = useState<TabKey>('command');
  const [location, setLocation] = useState<LocationFilter>('All Locations');

  return (
    <div className="min-h-screen text-slate-100">
      <TopNav location={location} onLocationChange={setLocation} />
      <TabNav active={tab} onChange={setTab} />

      <main className="mx-auto max-w-[1600px] px-4 py-6 sm:px-6 lg:px-8">
        <AnimatePresence mode="wait">
          <motion.div
            key={tab}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
          >
            {tab === 'command'    && <CommandCenter location={location} />}
            {tab === 'accounts'   && <Accounts location={location} />}
            {tab === 'automation' && <Automation />}
            {tab === 'reports'    && <Reports location={location} />}
          </motion.div>
        </AnimatePresence>
      </main>

      <footer className="mt-12 border-t border-border">
        <div className="mx-auto flex max-w-[1600px] flex-wrap items-center justify-between gap-2 px-4 py-5 text-[11px] text-slate-500 sm:px-6 lg:px-8">
          <span>Bad Boys Bail Bonds · Collections Command Center</span>
          <span className="font-mono">"Because Your Mama Wants You Home!" · 1.800.BAIL.OUT</span>
        </div>
      </footer>
    </div>
  );
}
