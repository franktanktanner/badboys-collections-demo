import { useState } from 'react';
import { motion } from 'framer-motion';
import { MapPin } from 'lucide-react';
import { SearchFilters } from '../components/Accounts/SearchFilters';
import { AccountsTable } from '../components/Accounts/AccountsTable';
import type { AccountStatus } from '../types';
import { isFiltered, type LocationFilter } from '../lib/filters';

export function Accounts({ location }: { location: LocationFilter }) {
  const [query, setQuery] = useState('');
  const [status, setStatus] = useState<AccountStatus | 'All'>('All');
  const [sort, setSort] = useState('Amount Owed');

  return (
    <motion.div
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35 }}
      className="space-y-4"
    >
      {isFiltered(location) && (
        <motion.div
          initial={{ opacity: 0, y: -6 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center gap-2 rounded-lg border border-brand-gold/30 bg-brand-gold/10 px-4 py-2.5 text-sm"
        >
          <MapPin className="h-4 w-4 text-brand-gold" />
          <span className="text-slate-200">Accounts scoped to</span>
          <span className="font-semibold text-brand-goldlight">{location}</span>
        </motion.div>
      )}
      <SearchFilters
        query={query} onQuery={setQuery}
        status={status} onStatus={setStatus}
        sort={sort} onSort={setSort}
      />
      <AccountsTable query={query} status={status} sort={sort} location={location} />
    </motion.div>
  );
}
