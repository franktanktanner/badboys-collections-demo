import { useEffect, useMemo, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import {
  ArrowUpRight, Scale, Mail, MailCheck, Sparkles, Flame, Building2,
  Database, Gavel, FileSearch, Loader2, ChevronRight, Handshake,
  Search, X, MapPin, Plus, Send,
} from 'lucide-react';
import { CountUp } from '../components/shared/CountUp';
import { MiniSparkline } from '../components/shared/MiniChart';
import { cn } from '../lib/cn';

type PipelineStage = 'New Lead' | 'Outreach Sent' | 'Engaged' | 'Warm Response' | 'Active Partner';

interface AttorneyRow {
  id: string;
  name: string;
  firm: string;
  county: string;
  stage: PipelineStage;
  lastTouch: string;
  action: 'Send Follow-Up' | 'View Thread' | 'Mark Hot' | 'Open Brief';
}

interface CompassEvent {
  id: string;
  title: string;
  scope: string;
  time: string;
  kind: 'response' | 'draft' | 'warm' | 'sync' | 'partner' | 'engaged';
}

interface PartnershipWin {
  attorney: string;
  firm: string;
  bonds: number;
  volume: number;
  county: string;
}

type FilterKey = 'all' | 'new' | 'engaged' | 'warm' | 'converted';

const FILTERS: { key: FilterKey; label: string }[] = [
  { key: 'all',       label: 'All' },
  { key: 'new',       label: 'New leads' },
  { key: 'engaged',   label: 'In conversation' },
  { key: 'warm',      label: 'Warm responses' },
  { key: 'converted', label: 'Converted' },
];

const STAGE_TO_FILTER: Record<PipelineStage, FilterKey> = {
  'New Lead':       'new',
  'Outreach Sent':  'engaged',
  'Engaged':        'engaged',
  'Warm Response':  'warm',
  'Active Partner': 'converted',
};

const STAGE_STYLES: Record<PipelineStage, { dot: string; bg: string; text: string; border: string }> = {
  'New Lead':       { dot: 'bg-slate-400',         bg: 'bg-slate-400/10',         text: 'text-slate-300',         border: 'border-slate-400/25' },
  'Outreach Sent':  { dot: 'bg-status-plan',       bg: 'bg-status-plan/10',       text: 'text-status-plan',       border: 'border-status-plan/25' },
  'Engaged':        { dot: 'bg-fuchsia-400',       bg: 'bg-fuchsia-500/10',       text: 'text-fuchsia-300',       border: 'border-fuchsia-500/25' },
  'Warm Response':  { dot: 'bg-brand-gold',        bg: 'bg-brand-gold/10',        text: 'text-brand-goldlight',   border: 'border-brand-gold/30' },
  'Active Partner': { dot: 'bg-status-active',     bg: 'bg-status-active/10',     text: 'text-status-active',     border: 'border-status-active/25' },
};

type PracticeArea = 'Criminal Defense' | 'White Collar' | 'DUI' | 'Federal' | 'Drug Crimes';

interface IndexedAttorney {
  id: string;
  name: string;
  firm: string;
  city: string;
  practice: PracticeArea;
  stage: PipelineStage;
}

const QUICK_CITIES = ['Los Angeles', 'San Jose', 'San Diego', 'Oakland', 'Santa Ana', 'Redwood City'] as const;

const PRACTICE_STYLES: Record<PracticeArea, string> = {
  'Criminal Defense': 'border-status-plan/25 bg-status-plan/10 text-status-plan',
  'White Collar':     'border-brand-gold/30 bg-brand-gold/10 text-brand-goldlight',
  'DUI':              'border-fuchsia-500/25 bg-fuchsia-500/10 text-fuchsia-300',
  'Federal':          'border-status-legal/25 bg-status-legal/10 text-status-legal',
  'Drug Crimes':      'border-cyan-500/25 bg-cyan-500/10 text-cyan-300',
};

const INDEXED_ATTORNEYS: IndexedAttorney[] = [
  // Los Angeles · 12
  { id: 'la-01', name: 'Daniel Cho',           firm: 'Cho & Associates',           city: 'Los Angeles', practice: 'White Collar',     stage: 'Active Partner' },
  { id: 'la-02', name: 'Priya Ramanathan',     firm: 'Ramanathan Defense LLP',     city: 'Los Angeles', practice: 'Federal',          stage: 'Active Partner' },
  { id: 'la-03', name: 'Marcus Williams',      firm: 'Williams Trial Group',       city: 'Los Angeles', practice: 'Criminal Defense', stage: 'Warm Response'  },
  { id: 'la-04', name: 'Aisha Patel',          firm: 'Patel Law',                  city: 'Los Angeles', practice: 'Drug Crimes',      stage: 'Engaged'        },
  { id: 'la-05', name: 'Sophia Nakamura',      firm: 'Nakamura Law Group',         city: 'Los Angeles', practice: 'Federal',          stage: 'Outreach Sent'  },
  { id: 'la-06', name: 'Carlos Vasquez',       firm: 'Vasquez & Partners',         city: 'Los Angeles', practice: 'Criminal Defense', stage: 'Outreach Sent'  },
  { id: 'la-07', name: 'Tasha Robinson',       firm: 'Robinson Defense',           city: 'Los Angeles', practice: 'White Collar',     stage: 'Engaged'        },
  { id: 'la-08', name: 'Brian O\u2019Connell', firm: 'O\u2019Connell Trial Law',   city: 'Los Angeles', practice: 'DUI',              stage: 'Outreach Sent'  },
  { id: 'la-09', name: 'Imani Brooks',         firm: 'Brooks Criminal Defense',    city: 'Los Angeles', practice: 'Criminal Defense', stage: 'Warm Response'  },
  { id: 'la-10', name: 'Hector Salazar',       firm: 'Salazar Law Office',         city: 'Los Angeles', practice: 'Drug Crimes',      stage: 'New Lead'       },
  { id: 'la-11', name: 'Naomi Greenberg',      firm: 'Greenberg & Stein',          city: 'Los Angeles', practice: 'White Collar',     stage: 'Outreach Sent'  },
  { id: 'la-12', name: 'Andre Thompson',       firm: 'Thompson Bail Defense',      city: 'Los Angeles', practice: 'Criminal Defense', stage: 'New Lead'       },

  // San Jose · 10
  { id: 'sj-01', name: 'Sarah Chen',           firm: 'Chen Legal',                 city: 'San Jose',    practice: 'Criminal Defense', stage: 'Warm Response'  },
  { id: 'sj-02', name: 'David Park',           firm: 'Park Defense',               city: 'San Jose',    practice: 'DUI',              stage: 'Engaged'        },
  { id: 'sj-03', name: 'Maria Gutierrez',      firm: 'Gutierrez & Partners',       city: 'San Jose',    practice: 'Federal',          stage: 'Active Partner' },
  { id: 'sj-04', name: 'Mei-Lin Wong',         firm: 'Wong Criminal Defense',      city: 'San Jose',    practice: 'White Collar',     stage: 'Engaged'        },
  { id: 'sj-05', name: 'Rajiv Mehta',          firm: 'Mehta Trial Law',            city: 'San Jose',    practice: 'Federal',          stage: 'Outreach Sent'  },
  { id: 'sj-06', name: 'Heather Lindgren',     firm: 'Lindgren Defense',           city: 'San Jose',    practice: 'Criminal Defense', stage: 'Outreach Sent'  },
  { id: 'sj-07', name: 'Khalid Rahman',        firm: 'Rahman Legal Group',         city: 'San Jose',    practice: 'Drug Crimes',      stage: 'New Lead'       },
  { id: 'sj-08', name: 'Olivia Tran',          firm: 'Tran & Associates',          city: 'San Jose',    practice: 'DUI',              stage: 'Outreach Sent'  },
  { id: 'sj-09', name: 'Jonathan Reyes',       firm: 'Reyes Criminal Defense',     city: 'San Jose',    practice: 'Criminal Defense', stage: 'Warm Response'  },
  { id: 'sj-10', name: 'Elena Sorensen',       firm: 'Sorensen Law',               city: 'San Jose',    practice: 'White Collar',     stage: 'New Lead'       },

  // San Diego · 10
  { id: 'sd-01', name: 'James Rodriguez',      firm: 'Rodriguez Law',              city: 'San Diego',   practice: 'DUI',              stage: 'Engaged'        },
  { id: 'sd-02', name: 'Linda Tran',           firm: 'Tran Defense',               city: 'San Diego',   practice: 'Criminal Defense', stage: 'Active Partner' },
  { id: 'sd-03', name: 'Omar Saleh',           firm: 'Saleh Trial Group',          city: 'San Diego',   practice: 'Federal',          stage: 'Warm Response'  },
  { id: 'sd-04', name: 'Bianca Lopez',         firm: 'Lopez Criminal Defense',     city: 'San Diego',   practice: 'Drug Crimes',      stage: 'Outreach Sent'  },
  { id: 'sd-05', name: 'Marcus Bell',          firm: 'Bell & Whitaker',            city: 'San Diego',   practice: 'White Collar',     stage: 'Outreach Sent'  },
  { id: 'sd-06', name: 'Jenny Kim',            firm: 'Kim Law Office',             city: 'San Diego',   practice: 'DUI',              stage: 'Engaged'        },
  { id: 'sd-07', name: 'Devon Wallace',        firm: 'Wallace Defense Firm',       city: 'San Diego',   practice: 'Criminal Defense', stage: 'New Lead'       },
  { id: 'sd-08', name: 'Camila Ortiz',         firm: 'Ortiz Bail Defense',         city: 'San Diego',   practice: 'Criminal Defense', stage: 'Outreach Sent'  },
  { id: 'sd-09', name: 'Theodore Schmidt',     firm: 'Schmidt & Reilly',           city: 'San Diego',   practice: 'Federal',          stage: 'Warm Response'  },
  { id: 'sd-10', name: 'Anaya Sharma',         firm: 'Sharma Legal',               city: 'San Diego',   practice: 'White Collar',     stage: 'New Lead'       },

  // Oakland · 8
  { id: 'oa-01', name: 'Jamal Bennett',        firm: 'Bennett Trial Group',        city: 'Oakland',     practice: 'Criminal Defense', stage: 'Active Partner' },
  { id: 'oa-02', name: 'Yuki Tanaka',          firm: 'Tanaka Defense',             city: 'Oakland',     practice: 'White Collar',     stage: 'Engaged'        },
  { id: 'oa-03', name: 'Latisha Coleman',      firm: 'Coleman Law',                city: 'Oakland',     practice: 'Drug Crimes',      stage: 'Warm Response'  },
  { id: 'oa-04', name: 'Felipe Aguilar',       firm: 'Aguilar Criminal Defense',   city: 'Oakland',     practice: 'DUI',              stage: 'Outreach Sent'  },
  { id: 'oa-05', name: 'Hannah Goldberg',      firm: 'Goldberg & Cohen',           city: 'Oakland',     practice: 'Federal',          stage: 'Outreach Sent'  },
  { id: 'oa-06', name: 'Tyrell Jackson',       firm: 'Jackson Legal Group',        city: 'Oakland',     practice: 'Criminal Defense', stage: 'New Lead'       },
  { id: 'oa-07', name: 'Ingrid Petersen',      firm: 'Petersen Defense',           city: 'Oakland',     practice: 'White Collar',     stage: 'Engaged'        },
  { id: 'oa-08', name: 'Rashid Ali',           firm: 'Ali Trial Law',              city: 'Oakland',     practice: 'Drug Crimes',      stage: 'Outreach Sent'  },

  // Santa Ana · 8
  { id: 'sa-01', name: 'Carlos Mendoza',       firm: 'Mendoza Criminal',           city: 'Santa Ana',   practice: 'DUI',              stage: 'Warm Response'  },
  { id: 'sa-02', name: 'Rachel Goldberg',      firm: 'Goldberg Defense',           city: 'Santa Ana',   practice: 'Federal',          stage: 'Engaged'        },
  { id: 'sa-03', name: 'Pedro Castillo',       firm: 'Castillo & Sons',            city: 'Santa Ana',   practice: 'Criminal Defense', stage: 'Outreach Sent'  },
  { id: 'sa-04', name: 'Vivian Park',          firm: 'Park Defense Firm',          city: 'Santa Ana',   practice: 'White Collar',     stage: 'Outreach Sent'  },
  { id: 'sa-05', name: 'Salim Haddad',         firm: 'Haddad Law',                 city: 'Santa Ana',   practice: 'Drug Crimes',      stage: 'New Lead'       },
  { id: 'sa-06', name: 'Adriana Beltran',      firm: 'Beltran Trial Group',        city: 'Santa Ana',   practice: 'Criminal Defense', stage: 'Engaged'        },
  { id: 'sa-07', name: 'Conor Mahoney',        firm: 'Mahoney & Walsh',            city: 'Santa Ana',   practice: 'DUI',              stage: 'Outreach Sent'  },
  { id: 'sa-08', name: 'Priscilla Nguyen',     firm: 'Nguyen Criminal Defense',    city: 'Santa Ana',   practice: 'Federal',          stage: 'Active Partner' },

  // Redwood City · 6
  { id: 'rc-01', name: 'Anthony Marino',       firm: 'Marino & Associates',        city: 'Redwood City', practice: 'White Collar',     stage: 'Active Partner' },
  { id: 'rc-02', name: 'Jasmine Wu',           firm: 'Wu Trial Law',               city: 'Redwood City', practice: 'Criminal Defense', stage: 'Warm Response'  },
  { id: 'rc-03', name: 'Derek Sullivan',       firm: 'Sullivan Defense',           city: 'Redwood City', practice: 'Federal',          stage: 'Engaged'        },
  { id: 'rc-04', name: 'Lakshmi Iyer',         firm: 'Iyer Legal Group',           city: 'Redwood City', practice: 'White Collar',     stage: 'Outreach Sent'  },
  { id: 'rc-05', name: 'Trevor Olsen',         firm: 'Olsen Criminal Defense',     city: 'Redwood City', practice: 'DUI',              stage: 'New Lead'       },
  { id: 'rc-06', name: 'Mariana Costa',        firm: 'Costa Bail Defense',         city: 'Redwood City', practice: 'Criminal Defense', stage: 'Outreach Sent'  },

  // Long Beach · 3
  { id: 'lb-01', name: 'Robert Kim',           firm: 'Kim Defense',                city: 'Long Beach',  practice: 'DUI',              stage: 'Engaged'        },
  { id: 'lb-02', name: 'Stephanie Adebayo',    firm: 'Adebayo Trial Law',          city: 'Long Beach',  practice: 'Criminal Defense', stage: 'Outreach Sent'  },
  { id: 'lb-03', name: 'Greg Sanderson',       firm: 'Sanderson & Cole',           city: 'Long Beach',  practice: 'White Collar',     stage: 'New Lead'       },

  // Anaheim · 3
  { id: 'an-01', name: 'Sophia Castellanos',   firm: 'Castellanos Law',            city: 'Anaheim',     practice: 'Criminal Defense', stage: 'Warm Response'  },
  { id: 'an-02', name: 'Bryan Nakamura',       firm: 'Nakamura Defense',           city: 'Anaheim',     practice: 'Federal',          stage: 'Outreach Sent'  },
  { id: 'an-03', name: 'Chantel Davis',        firm: 'Davis Criminal Defense',     city: 'Anaheim',     practice: 'DUI',              stage: 'Engaged'        },
];

const ATTORNEYS: AttorneyRow[] = [
  { id: 'att-01', name: 'Daniel Cho',           firm: 'Cho & Associates',                   county: 'Los Angeles',     stage: 'Active Partner', lastTouch: '2h ago',     action: 'View Thread'    },
  { id: 'att-02', name: 'Priya Ramanathan',     firm: 'Ramanathan Defense LLP',             county: 'Santa Clara',     stage: 'Active Partner', lastTouch: 'yesterday',  action: 'View Thread'    },
  { id: 'att-03', name: 'Sarah Chen',           firm: 'Chen Criminal Defense',              county: 'Orange',          stage: 'Warm Response',  lastTouch: '15m ago',    action: 'Mark Hot'       },
  { id: 'att-04', name: 'Marcus Williams',      firm: 'Williams Trial Group',               county: 'San Diego',       stage: 'Active Partner', lastTouch: '3 days ago', action: 'View Thread'    },
  { id: 'att-05', name: 'Aisha Patel',          firm: 'Patel Law Office',                   county: 'Alameda',         stage: 'Engaged',        lastTouch: '3h ago',     action: 'Send Follow-Up' },
  { id: 'att-06', name: 'James Rodriguez',      firm: 'Rodriguez & Sons',                   county: 'Riverside',       stage: 'Engaged',        lastTouch: '6h ago',     action: 'Send Follow-Up' },
  { id: 'att-07', name: 'Rachel Goldstein',     firm: 'Goldstein Criminal Law',             county: 'San Mateo',       stage: 'Warm Response',  lastTouch: '4h ago',     action: 'Mark Hot'       },
  { id: 'att-08', name: 'Michael O\u2019Brien', firm: 'O\u2019Brien Defense',               county: 'San Francisco',   stage: 'Outreach Sent',  lastTouch: 'yesterday',  action: 'Send Follow-Up' },
  { id: 'att-09', name: 'Sophia Nakamura',      firm: 'Nakamura Law Group',                 county: 'Los Angeles',     stage: 'Outreach Sent',  lastTouch: '2 days ago', action: 'Send Follow-Up' },
  { id: 'att-10', name: 'Carlos Vasquez',       firm: 'Vasquez & Partners',                 county: 'Los Angeles',     stage: 'Outreach Sent',  lastTouch: '2 days ago', action: 'Send Follow-Up' },
  { id: 'att-11', name: 'Mei-Lin Wong',         firm: 'Wong Criminal Defense',              county: 'Santa Clara',     stage: 'Engaged',        lastTouch: '5h ago',     action: 'Send Follow-Up' },
  { id: 'att-12', name: 'Ahmed Khalil',         firm: 'Khalil Law',                         county: 'San Bernardino',  stage: 'Outreach Sent',  lastTouch: '3 days ago', action: 'Send Follow-Up' },
  { id: 'att-13', name: 'Vivian Park',          firm: 'Park Defense Firm',                  county: 'Orange',          stage: 'Outreach Sent',  lastTouch: '4 days ago', action: 'Send Follow-Up' },
  { id: 'att-14', name: 'Tyrone Jackson',       firm: 'Jackson Legal Group',                county: 'Alameda',         stage: 'New Lead',       lastTouch: '1h ago',     action: 'Open Brief'     },
  { id: 'att-15', name: 'David Hernandez',      firm: 'Hernandez Bail Defense',             county: 'Riverside',       stage: 'New Lead',       lastTouch: '40m ago',    action: 'Open Brief'     },
];

const COMPASS_EVENTS: CompassEvent[] = [
  { id: 'c1', title: 'Daniel Cho responded to Q2 outreach',     scope: 'Los Angeles',    time: '2m ago',  kind: 'response' },
  { id: 'c2', title: 'Drafted 14 new outreach emails',          scope: 'All counties',   time: '8m ago',  kind: 'draft'    },
  { id: 'c3', title: 'Sarah Chen marked as Warm',               scope: 'Orange County',  time: '15m ago', kind: 'warm'     },
  { id: 'c4', title: '847 attorneys synced from State Bar',     scope: 'Statewide',      time: '1h ago',  kind: 'sync'     },
  { id: 'c5', title: 'Marcus Williams · partnership confirmed', scope: 'San Diego',      time: '2h ago',  kind: 'partner'  },
  { id: 'c6', title: 'Aisha Patel · email opened 3x',           scope: 'Alameda County', time: '3h ago',  kind: 'engaged'  },
];

const COMPASS_ICONS: Record<CompassEvent['kind'], { Icon: typeof Mail; bg: string; text: string }> = {
  response: { Icon: MailCheck,  bg: 'bg-status-active/10', text: 'text-status-active'   },
  draft:    { Icon: Sparkles,   bg: 'bg-brand-gold/10',    text: 'text-brand-goldlight' },
  warm:     { Icon: Flame,      bg: 'bg-brand-gold/10',    text: 'text-brand-gold'      },
  sync:     { Icon: Database,   bg: 'bg-cyan-500/10',      text: 'text-cyan-400'        },
  partner:  { Icon: Handshake,  bg: 'bg-status-active/10', text: 'text-status-active'   },
  engaged:  { Icon: Mail,       bg: 'bg-fuchsia-500/10',   text: 'text-fuchsia-400'     },
};

const PARTNERSHIP_WINS: PartnershipWin[] = [
  { attorney: 'Daniel Cho',       firm: 'Cho & Associates',         bonds: 12, volume: 380_000, county: 'Los Angeles' },
  { attorney: 'Priya Ramanathan', firm: 'Ramanathan Defense LLP',   bonds: 8,  volume: 245_000, county: 'Santa Clara' },
  { attorney: 'Marcus Williams',  firm: 'Williams Trial Group',     bonds: 5,  volume: 128_000, county: 'San Diego'   },
];

const KPI_TREND_INDEXED   = [{ value: 13420 }, { value: 13680 }, { value: 13910 }, { value: 14180 }, { value: 14410 }, { value: 14600 }, { value: 14847 }];
const KPI_TREND_OUTREACH  = [{ value: 6400 },  { value: 7100 },  { value: 7620 },  { value: 8050 },  { value: 8530 },  { value: 8840 },  { value: 9147 }];
const KPI_TREND_ACTIVE    = [{ value: 17 },    { value: 18 },    { value: 19 },    { value: 20 },    { value: 21 },    { value: 22 },    { value: 23 }];
const KPI_TREND_HIGHVALUE = [{ value: 54 },    { value: 61 },    { value: 66 },    { value: 70 },    { value: 75 },    { value: 79 },    { value: 84 }];

export function AttorneyPipeline() {
  const [filter, setFilter] = useState<FilterKey>('all');

  const filtered = useMemo(
    () => filter === 'all' ? ATTORNEYS : ATTORNEYS.filter((a) => STAGE_TO_FILTER[a.stage] === filter),
    [filter],
  );

  return (
    <motion.div
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35 }}
      className="space-y-4"
    >
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="h-display text-xl">Attorney Pipeline</h1>
          <p className="mt-0.5 text-xs text-slate-400">
            Statewide attorney acquisition · powered by <span className="font-medium text-brand-goldlight">Compass</span> agent
          </p>
        </div>
        <span className="chip text-brand-goldlight">
          <Scale className="h-3 w-3 text-brand-gold" />
          58 CA counties · live
        </span>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <PipelineKpiCard
          label="Attorneys Indexed"
          value={14847}
          sub="across 58 CA counties"
          trendText="+247 this week"
          trendTone="green"
          accent="gold"
          chartData={KPI_TREND_INDEXED}
          delay={0}
        />
        <PipelineKpiCard
          label="Outreach Sent"
          value={9147}
          sub="Compass-drafted last 30 days"
          trendText="42.3% reply rate"
          trendTone="green"
          accent="blue"
          chartData={KPI_TREND_OUTREACH}
          delay={0.08}
        />
        <PipelineKpiCard
          label="Active Partnerships"
          value={23}
          sub="$245K in referral volume / Q2"
          trendText="+6 this quarter"
          trendTone="green"
          accent="green"
          chartData={KPI_TREND_ACTIVE}
          delay={0.16}
        />
        <PipelineKpiCard
          label="High-Value Prospects"
          value={84}
          sub="flagged for principal review"
          trendText="+12 this week"
          trendTone="gold"
          accent="gold"
          chartData={KPI_TREND_HIGHVALUE}
          delay={0.24}
        />
      </div>

      <CitySearchSection />

      <div className="grid grid-cols-1 gap-4 xl:grid-cols-5">
        <div className="xl:col-span-3">
          <PipelineTable rows={filtered} filter={filter} onFilter={setFilter} />
        </div>
        <div className="space-y-4 xl:col-span-2">
          <CompassActivityCard />
          <ScraperStatusCard />
        </div>
      </div>

      <PartnershipWinsCard wins={PARTNERSHIP_WINS} />
    </motion.div>
  );
}

function CitySearchSection() {
  const [query, setQuery] = useState('');
  const [debounced, setDebounced] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const id = window.setTimeout(() => setDebounced(query.trim()), 200);
    return () => window.clearTimeout(id);
  }, [query]);

  const results = useMemo(() => {
    if (!debounced) return [];
    const needle = debounced.toLowerCase();
    return INDEXED_ATTORNEYS.filter((a) => a.city.toLowerCase().includes(needle));
  }, [debounced]);

  const matchedCity = useMemo(() => {
    if (!debounced) return null;
    const needle = debounced.toLowerCase();
    const match = INDEXED_ATTORNEYS.find((a) => a.city.toLowerCase().includes(needle));
    return match?.city ?? debounced;
  }, [debounced]);

  const showResults = debounced.length > 0;
  const visibleResults = results.slice(0, 12);

  const handleClear = () => {
    setQuery('');
    setDebounced('');
    inputRef.current?.focus();
  };

  const handleChip = (city: string) => {
    setQuery(city);
    setDebounced(city);
    inputRef.current?.focus();
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.1 }}
      className="space-y-4"
    >
      <div className="glass-card overflow-hidden p-6">
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-brand-gold/8 via-transparent to-transparent" />

        <div className="relative">
          <div className="label text-brand-goldlight/80">Statewide Index · Compass Scraper</div>
          <h2 className="mt-1.5 h-display text-2xl">Search Attorneys by City</h2>
          <p className="mt-1 text-sm text-slate-400">
            14,847 attorneys indexed across all 58 California counties
          </p>

          <div className="mt-5 group relative">
            <Search className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-500 transition-colors group-focus-within:text-brand-gold" />
            <input
              ref={inputRef}
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              type="text"
              placeholder="Type a California city (e.g., Los Angeles, San Diego, Oakland, San Jose, Santa Ana, Redwood City)"
              className="h-14 w-full rounded-xl border border-border bg-bg-surface/80 pl-12 pr-12 text-base text-slate-100 placeholder:text-slate-500 transition-all focus:border-brand-gold/60 focus:bg-bg-surface focus:outline-none focus:ring-2 focus:ring-brand-gold/20"
              aria-label="Search attorneys by California city"
            />
            {query && (
              <button
                onClick={handleClear}
                className="absolute right-3 top-1/2 flex h-8 w-8 -translate-y-1/2 cursor-pointer items-center justify-center rounded-lg border border-border bg-bg-elevated/80 text-slate-400 transition-all hover:border-border-strong hover:bg-bg-raised hover:text-white"
                aria-label="Clear search"
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </div>

          <div className="mt-4 flex flex-wrap items-center gap-2">
            <span className="text-[11px] font-medium uppercase tracking-[0.14em] text-slate-500">Quick search</span>
            {QUICK_CITIES.map((city) => {
              const active = debounced.toLowerCase() === city.toLowerCase();
              return (
                <button
                  key={city}
                  onClick={() => handleChip(city)}
                  className={cn(
                    'cursor-pointer rounded-full border px-3 py-1.5 text-xs font-medium transition-all',
                    active
                      ? 'border-brand-gold/40 bg-brand-gold/10 text-brand-goldlight'
                      : 'border-border bg-bg-elevated/60 text-slate-300 hover:border-brand-gold/40 hover:bg-brand-gold/10 hover:text-brand-goldlight',
                  )}
                >
                  {city}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      <AnimatePresence mode="wait">
        {showResults && (
          <motion.div
            key={debounced}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
            className="glass-card p-6"
          >
            <div className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <MapPin className="h-4 w-4 text-brand-gold" />
                <h3 className="h-display text-base">
                  {results.length === 0 ? (
                    <span className="text-slate-300">0 attorneys in <span className="text-white">{matchedCity}</span></span>
                  ) : (
                    <span className="text-slate-300">
                      <span className="text-white">{results.length}</span> attorney{results.length === 1 ? '' : 's'} in{' '}
                      <span className="text-brand-goldlight">{matchedCity}</span>
                    </span>
                  )}
                </h3>
              </div>
              {results.length > 0 && (
                <span className="chip text-slate-300">
                  <span className="h-1.5 w-1.5 rounded-full bg-status-active" />
                  showing {visibleResults.length} of {results.length}
                </span>
              )}
            </div>

            {results.length === 0 ? (
              <div className="mt-6 flex flex-col items-center justify-center rounded-xl border border-dashed border-border bg-bg-elevated/30 px-6 py-12 text-center">
                <div className="flex h-12 w-12 items-center justify-center rounded-full border border-border bg-bg-elevated/60">
                  <Search className="h-5 w-5 text-slate-500" />
                </div>
                <p className="mt-4 text-sm font-medium text-slate-200">
                  No attorneys found in {matchedCity} yet.
                </p>
                <p className="mt-1 max-w-md text-xs text-slate-500">
                  Compass will sweep this county on the next sync.
                </p>
              </div>
            ) : (
              <div className="mt-5 grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-3">
                {visibleResults.map((att, i) => (
                  <SearchResultCard key={att.id} attorney={att} index={i} />
                ))}
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

function SearchResultCard({ attorney, index }: { attorney: IndexedAttorney; index: number }) {
  const stage = STAGE_STYLES[attorney.stage];
  const isConverted = attorney.stage === 'Active Partner';

  return (
    <motion.div
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: Math.min(index * 0.025, 0.25) }}
      className="group relative overflow-hidden rounded-xl border border-border bg-bg-elevated/40 p-4 transition-all hover:border-brand-gold/30 hover:bg-bg-elevated/70"
    >
      <div className="flex items-start gap-3">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-brand-gold/30 bg-brand-gold/10 text-sm font-semibold text-brand-goldlight">
          {initials(attorney.name)}
        </div>
        <div className="min-w-0 flex-1">
          <div className="truncate text-sm font-semibold text-white">{attorney.name}</div>
          <div className="mt-0.5 flex items-center gap-1.5 text-xs text-slate-400">
            <Building2 className="h-3 w-3 text-slate-500" />
            <span className="truncate">{attorney.firm}</span>
          </div>
        </div>
      </div>

      <div className="mt-3 flex flex-wrap items-center gap-1.5">
        <span className={cn(
          'inline-flex items-center rounded-full border px-2 py-0.5 text-[10px] font-medium uppercase tracking-wider',
          PRACTICE_STYLES[attorney.practice],
        )}>
          {attorney.practice}
        </span>
        <span className={cn(
          'inline-flex items-center gap-1.5 rounded-full border px-2 py-0.5 text-[10px] font-medium',
          stage.bg, stage.text, stage.border,
        )}>
          <span className={cn('h-1.5 w-1.5 rounded-full', stage.dot)} />
          {attorney.stage}
        </span>
      </div>

      <div className="mt-3 flex items-center justify-between border-t border-border-subtle pt-3">
        <span className="font-mono text-[10px] text-slate-500">via Compass · State Bar</span>
        <button className="inline-flex cursor-pointer items-center gap-1 rounded-md border border-border bg-bg-surface/80 px-2.5 py-1 text-[11px] font-medium text-brand-goldlight transition-all hover:border-brand-gold/40 hover:bg-brand-gold/10">
          {isConverted ? <Send className="h-3 w-3" /> : <Plus className="h-3 w-3" />}
          {isConverted ? 'Send Outreach' : 'Add to Pipeline'}
        </button>
      </div>
    </motion.div>
  );
}

interface PipelineKpiProps {
  label: string;
  value: number;
  sub: string;
  trendText: string;
  trendTone: 'green' | 'gold';
  accent: 'gold' | 'green' | 'blue';
  chartData: { value: number }[];
  delay: number;
}

const KPI_ACCENT_GRADIENTS: Record<PipelineKpiProps['accent'], string> = {
  gold:  'from-brand-gold/10 via-transparent to-transparent',
  green: 'from-emerald-500/10 via-transparent to-transparent',
  blue:  'from-blue-500/10 via-transparent to-transparent',
};

const KPI_ACCENT_COLORS: Record<PipelineKpiProps['accent'], string> = {
  gold:  '#EAB308',
  green: '#22C55E',
  blue:  '#3B82F6',
};

const TREND_TONE_CLASS: Record<PipelineKpiProps['trendTone'], string> = {
  green: 'text-status-active border-status-active/30 bg-status-active/5',
  gold:  'text-brand-goldlight border-brand-gold/30 bg-brand-gold/5',
};

function PipelineKpiCard({ label, value, sub, trendText, trendTone, accent, chartData, delay }: PipelineKpiProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay, ease: [0.22, 1, 0.36, 1] }}
      className="glass-card glass-card-hover overflow-hidden p-5"
    >
      <div className={cn('pointer-events-none absolute inset-0 bg-gradient-to-br', KPI_ACCENT_GRADIENTS[accent])} />

      <div className="relative flex items-start justify-between gap-2">
        <div className="label">{label}</div>
        <div className={cn(
          'flex items-center gap-0.5 whitespace-nowrap rounded-full border px-2 py-0.5 text-[11px] font-medium',
          TREND_TONE_CLASS[trendTone],
        )}>
          <ArrowUpRight className="h-3 w-3" />
          {trendText}
        </div>
      </div>

      <div className="relative mt-3 font-display text-3xl font-semibold tracking-tight text-white lg:text-[32px]">
        <CountUp value={value} compact={value > 10000} />
      </div>

      <div className="relative mt-1 text-xs text-slate-400">{sub}</div>

      <div className="relative -mx-2 mt-3">
        <MiniSparkline data={chartData} color={KPI_ACCENT_COLORS[accent]} height={48} />
      </div>
    </motion.div>
  );
}

function PipelineTable({
  rows,
  filter,
  onFilter,
}: {
  rows: AttorneyRow[];
  filter: FilterKey;
  onFilter: (k: FilterKey) => void;
}) {
  return (
    <div className="glass-card overflow-hidden">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border px-6 py-4">
        <div>
          <h2 className="h-display text-lg">Pipeline · 14,847 attorneys</h2>
          <p className="mt-0.5 text-xs text-slate-400">Compass-tracked outreach across criminal defense bar</p>
        </div>
        <span className="chip text-slate-300">
          <span className="h-1.5 w-1.5 rounded-full bg-status-active" />
          {rows.length} shown
        </span>
      </div>

      <div className="flex flex-wrap items-center gap-1.5 border-b border-border px-6 py-3">
        {FILTERS.map((f) => {
          const active = f.key === filter;
          return (
            <button
              key={f.key}
              onClick={() => onFilter(f.key)}
              className={cn(
                'cursor-pointer rounded-full border px-3 py-1 text-xs font-medium transition-all',
                active
                  ? 'border-brand-gold/40 bg-brand-gold/10 text-brand-goldlight'
                  : 'border-border bg-bg-elevated/40 text-slate-400 hover:border-border-strong hover:text-white',
              )}
            >
              {f.label}
            </button>
          );
        })}
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-bg-surface/90">
            <tr className="border-b border-border">
              <Th>Attorney</Th>
              <Th>Firm</Th>
              <Th>County</Th>
              <Th>Stage</Th>
              <Th>Last touch</Th>
              <Th right>Compass action</Th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row, i) => {
              const stage = STAGE_STYLES[row.stage];
              return (
                <motion.tr
                  key={row.id}
                  initial={{ opacity: 0, y: 4 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.22, delay: Math.min(i * 0.015, 0.25) }}
                  className="border-b border-border-subtle hover:bg-bg-elevated/40"
                >
                  <Td>
                    <div className="flex items-center gap-3">
                      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-border bg-bg-elevated/60 text-[11px] font-semibold text-slate-300">
                        {initials(row.name)}
                      </div>
                      <span className="font-medium text-white">{row.name}</span>
                    </div>
                  </Td>
                  <Td>
                    <div className="flex items-center gap-2 text-slate-300">
                      <Building2 className="h-3.5 w-3.5 text-slate-500" />
                      {row.firm}
                    </div>
                  </Td>
                  <Td><span className="text-slate-400">{row.county}</span></Td>
                  <Td>
                    <span className={cn('inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-[11px] font-medium', stage.bg, stage.text, stage.border)}>
                      <span className={cn('h-1.5 w-1.5 rounded-full', stage.dot)} />
                      {row.stage}
                    </span>
                  </Td>
                  <Td><span className="font-mono text-xs text-slate-400">{row.lastTouch}</span></Td>
                  <Td right>
                    <button className="group inline-flex items-center gap-1 text-xs font-medium text-brand-goldlight transition-colors hover:text-brand-gold">
                      {row.action}
                      <ChevronRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
                    </button>
                  </Td>
                </motion.tr>
              );
            })}
            {rows.length === 0 && (
              <tr>
                <td colSpan={6} className="p-10 text-center text-sm text-slate-500">
                  No attorneys match this filter.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function CompassActivityCard() {
  return (
    <div className="glass-card p-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="h-display text-lg">Compass Activity</h2>
          <p className="mt-0.5 text-xs text-slate-400">AI Attorney Outreach Agent</p>
        </div>
        <LivePill />
      </div>

      <ul className="mt-5 space-y-3">
        {COMPASS_EVENTS.map((ev, i) => {
          const style = COMPASS_ICONS[ev.kind];
          const Icon = style.Icon;
          return (
            <motion.li
              key={ev.id}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: i * 0.05 }}
              className="flex items-start gap-3"
            >
              <div className={cn('flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-border', style.bg)}>
                <Icon className={cn('h-3.5 w-3.5', style.text)} />
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-baseline justify-between gap-2">
                  <p className="truncate text-sm font-medium text-white">{ev.title}</p>
                  <span className="shrink-0 font-mono text-[11px] text-slate-500">{ev.time}</span>
                </div>
                <p className="mt-0.5 text-xs text-slate-500">{ev.scope}</p>
              </div>
            </motion.li>
          );
        })}
      </ul>
    </div>
  );
}

function ScraperStatusCard() {
  const sources = [
    { Icon: Gavel,      label: 'California State Bar', detail: 'synced 14m ago',           status: 'ACTIVE' as const  },
    { Icon: FileSearch, label: 'PACER Court Records',  detail: 'synced 1h ago',            status: 'ACTIVE' as const  },
    { Icon: Database,   label: 'County Dockets',       detail: 'syncing 3 counties...',    status: 'RUNNING' as const },
  ];

  return (
    <div className="glass-card p-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="h-display text-lg">Scraper Status</h2>
          <p className="mt-0.5 text-xs text-slate-400">Data sources feeding the pipeline</p>
        </div>
        <span className="chip text-slate-300">
          <span className="h-1.5 w-1.5 rounded-full bg-status-active" />
          3 sources
        </span>
      </div>

      <ul className="mt-5 space-y-2.5">
        {sources.map((src, i) => {
          const Icon = src.Icon;
          const isRunning = src.status === 'RUNNING';
          return (
            <motion.li
              key={src.label}
              initial={{ opacity: 0, x: -6 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3, delay: i * 0.05 }}
              className="flex items-center gap-3 rounded-lg border border-border bg-bg-elevated/40 px-3.5 py-3"
            >
              <div className={cn(
                'flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-border',
                isRunning ? 'bg-brand-gold/10' : 'bg-status-active/10',
              )}>
                {isRunning
                  ? <Loader2 className="h-4 w-4 animate-spin text-brand-gold" />
                  : <Icon className="h-4 w-4 text-status-active" />}
              </div>
              <div className="min-w-0 flex-1">
                <div className="text-sm font-medium text-white">{src.label}</div>
                <div className="mt-0.5 text-[11px] text-slate-500">{src.detail}</div>
              </div>
              <div className="flex shrink-0 items-center gap-2">
                <span className="relative inline-flex h-2 w-2 items-center justify-center">
                  {isRunning && (
                    <motion.span
                      aria-hidden
                      className="absolute inset-0 rounded-full bg-brand-gold"
                      initial={{ scale: 1, opacity: 0.8 }}
                      animate={{ scale: 2.5, opacity: 0 }}
                      transition={{ duration: 1.4, repeat: Infinity, ease: 'easeOut' }}
                    />
                  )}
                  <span className={cn(
                    'relative h-2 w-2 rounded-full',
                    isRunning
                      ? 'bg-brand-gold shadow-[0_0_8px_rgba(234,179,8,0.7)]'
                      : 'bg-status-active shadow-[0_0_8px_rgba(34,197,94,0.6)]',
                  )} />
                </span>
                <span className={cn(
                  'font-mono text-[10px] font-semibold tracking-wider',
                  isRunning ? 'text-brand-goldlight' : 'text-status-active',
                )}>
                  {src.status}
                </span>
              </div>
            </motion.li>
          );
        })}
      </ul>

      <div className="mt-4 flex items-center justify-between border-t border-border pt-3 text-[11px] text-slate-500">
        <span>Next full sweep</span>
        <span className="font-mono text-slate-300">in 47 minutes</span>
      </div>
    </div>
  );
}

function PartnershipWinsCard({ wins }: { wins: PartnershipWin[] }) {
  return (
    <div className="glass-card p-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="h-display text-lg">Recent Partnership Wins</h2>
          <p className="mt-0.5 text-xs text-slate-400">Attorneys driving Q2 referral volume</p>
        </div>
        <span className="chip text-brand-goldlight">
          <Handshake className="h-3 w-3 text-brand-gold" />
          $753K combined
        </span>
      </div>

      <div className="mt-5 grid grid-cols-1 gap-4 md:grid-cols-3">
        {wins.map((win, i) => (
          <motion.div
            key={win.attorney}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: i * 0.08 }}
            className="relative overflow-hidden rounded-xl border border-border bg-bg-elevated/40 p-5 transition-all hover:border-brand-gold/30 hover:bg-bg-elevated/70"
          >
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-brand-gold/8 via-transparent to-transparent" />

            <div className="relative flex items-start justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-full border border-brand-gold/30 bg-brand-gold/10 text-sm font-semibold text-brand-goldlight">
                  {initials(win.attorney)}
                </div>
                <div className="min-w-0">
                  <div className="font-display text-lg font-semibold leading-tight text-white">{win.attorney}</div>
                  <div className="mt-0.5 text-xs text-slate-400">{win.firm}</div>
                </div>
              </div>
            </div>

            <div className="relative mt-5 grid grid-cols-2 gap-3 border-t border-border-subtle pt-4">
              <div>
                <div className="label">Bonds · 30d</div>
                <div className="mt-1 font-display text-2xl font-semibold tabular-nums text-white">
                  <CountUp value={win.bonds} />
                </div>
              </div>
              <div>
                <div className="label">Volume</div>
                <div className="mt-1 font-display text-2xl font-semibold tabular-nums text-status-active">
                  <CountUp value={win.volume} currency compact />
                </div>
              </div>
            </div>

            <div className="relative mt-4 flex items-center justify-between text-[11px]">
              <span className="text-slate-500">{win.county}</span>
              <span className="font-mono text-brand-goldlight/80">Sourced via Compass · Q1 2026</span>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

function LivePill() {
  const reduced = usePrefersReducedMotion();
  return (
    <span className="inline-flex items-center gap-2 rounded-full border border-border bg-bg-elevated/40 px-3 py-1">
      <span className="relative inline-flex h-2 w-2 items-center justify-center">
        {!reduced && (
          <motion.span
            aria-hidden
            className="absolute inset-0 rounded-full bg-status-active"
            initial={{ scale: 1, opacity: 0.8 }}
            animate={{ scale: 2.5, opacity: 0 }}
            transition={{ duration: 1.5, repeat: Infinity, ease: 'easeOut' }}
          />
        )}
        <span className="relative h-2 w-2 rounded-full bg-status-active shadow-[0_0_12px_rgba(34,197,94,0.7)]" />
      </span>
      <span className="text-xs font-semibold tracking-wide text-white">Live</span>
    </span>
  );
}

function usePrefersReducedMotion() {
  const [reduced, setReduced] = useState(false);
  useEffect(() => {
    if (typeof window === 'undefined' || !window.matchMedia) return;
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    setReduced(mq.matches);
    const handler = (e: MediaQueryListEvent) => setReduced(e.matches);
    mq.addEventListener('change', handler);
    return () => mq.removeEventListener('change', handler);
  }, []);
  return reduced;
}

function Th({ children, right }: { children: React.ReactNode; right?: boolean }) {
  return <th className={cn('label whitespace-nowrap px-4 py-3', right ? 'text-right' : 'text-left')}>{children}</th>;
}

function Td({ children, right }: { children: React.ReactNode; right?: boolean }) {
  return <td className={cn('whitespace-nowrap px-4 py-3', right && 'text-right')}>{children}</td>;
}

function initials(name: string): string {
  return name
    .split(' ')
    .filter(Boolean)
    .map((p) => p[0])
    .slice(0, 2)
    .join('')
    .toUpperCase();
}
