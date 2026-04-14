import { useState } from 'react';
import { motion } from 'framer-motion';
import { SearchFilters } from '../components/Accounts/SearchFilters';
import { AccountsTable } from '../components/Accounts/AccountsTable';
import type { AccountStatus } from '../types';

export function Accounts() {
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
      <SearchFilters
        query={query} onQuery={setQuery}
        status={status} onStatus={setStatus}
        sort={sort} onSort={setSort}
      />
      <AccountsTable query={query} status={status} sort={sort} />
    </motion.div>
  );
}
