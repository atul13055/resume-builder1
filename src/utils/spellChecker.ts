// Lightweight, client-side Spell Checking Engine with resume & tech vocabulary,
// Levenshtein distance matching, common typo mappings, and customizable user dictionary.

export interface TypoMatch {
  word: string;
  originalWord: string;
  startIndex: number;
  endIndex: number;
  suggestions: string[];
}

// Storage key for user-added custom dictionary words
const USER_DICT_KEY = 'resumebuilder_custom_dictionary_v1';

// Common resume, engineering, business, and English vocabulary
const BASE_DICTIONARY = new Set<string>([
  // Common action verbs (Past & Present)
  'accelerated', 'accomplished', 'achieved', 'acquired', 'adapted', 'addressed', 'administered', 'advised',
  'advocated', 'aligned', 'allocated', 'analyzed', 'applied', 'appointed', 'appraised', 'approved',
  'architected', 'arranged', 'assembled', 'assessed', 'assigned', 'assisted', 'audited', 'authored',
  'automated', 'balanced', 'benchmarked', 'boosted', 'briefed', 'budgeted', 'built', 'calculated',
  'calibrated', 'campaigned', 'capitalized', 'captured', 'cataloged', 'centralized', 'championed', 'clarified',
  'classified', 'coached', 'collaborated', 'collated', 'collected', 'commissioned', 'communicated', 'compiled',
  'completed', 'composed', 'computed', 'conceptualized', 'conducted', 'configured', 'consolidated', 'constructed',
  'consulted', 'contacted', 'contained', 'contracted', 'controlled', 'converted', 'conveyed', 'convinced',
  'coordinated', 'corrected', 'counseled', 'crafted', 'created', 'critiqued', 'cultivated', 'customized',
  'debugged', 'decentralized', 'decreased', 'defined', 'delegated', 'delivered', 'demonstrated', 'deployed',
  'designed', 'detailed', 'detected', 'determined', 'developed', 'devised', 'diagnosed', 'directed',
  'discovered', 'dispatched', 'displayed', 'distributed', 'diversified', 'documented', 'doubled', 'drafted',
  'drove', 'earned', 'edited', 'educated', 'effected', 'elicited', 'eliminated', 'emphasized',
  'empowered', 'enabled', 'enacted', 'encouraged', 'engineered', 'enhanced', 'enlarged', 'enlisted',
  'ensured', 'entered', 'established', 'estimated', 'evaluated', 'examined', 'exceeded', 'executed',
  'expanded', 'expedited', 'experimented', 'explained', 'explored', 'expressed', 'extended', 'extracted',
  'fabricated', 'facilitated', 'familiarized', 'fashioned', 'fielded', 'finalized', 'financed', 'focused',
  'forecasted', 'formulated', 'fostered', 'founded', 'fulfilled', 'functioned', 'gained', 'gathered',
  'generated', 'governed', 'graduated', 'guided', 'handled', 'harmonized', 'headed', 'heightened',
  'helped', 'highlighted', 'hired', 'hosted', 'identified', 'illustrated', 'implemented', 'improved',
  'improvised', 'inaugurated', 'increased', 'indexed', 'individualized', 'indoctrinated', 'influenced', 'informed',
  'initiated', 'innovated', 'inspected', 'inspired', 'installed', 'instituted', 'instructed', 'integrated',
  'intensified', 'interpreted', 'interviewed', 'introduced', 'invented', 'investigated', 'itemized', 'joined',
  'judged', 'justified', 'launched', 'lead', 'leader', 'leadership', 'learned', 'lectured', 'led',
  'leveraged', 'licensed', 'lightened', 'linked', 'liquidated', 'listened', 'located', 'maintained',
  'managed', 'mandated', 'manipulated', 'manufactured', 'mapped', 'marketed', 'mastered', 'maximized',
  'measured', 'mediated', 'mentored', 'merged', 'migrated', 'minimized', 'mobilized', 'modeled',
  'moderated', 'modernized', 'modified', 'monitored', 'motivated', 'multiplied', 'navigated', 'negotiated',
  'netted', 'neutralized', 'nominated', 'normalized', 'nurtured', 'observed', 'obtained', 'offered',
  'officiated', 'operated', 'optimized', 'orchestrated', 'ordered', 'organized', 'originated', 'outlined',
  'overcame', 'overhauled', 'oversaw', 'packaged', 'participated', 'partnered', 'performed', 'persuaded',
  'piloted', 'pioneered', 'placed', 'planned', 'polled', 'positioned', 'predicted', 'prepared',
  'prescribed', 'presented', 'preserved', 'presided', 'prevented', 'prioritized', 'processed', 'procured',
  'produced', 'programmed', 'projected', 'promoted', 'prompted', 'proposed', 'protected', 'provided',
  'publicized', 'published', 'purchased', 'pursued', 'quantified', 'queried', 'raised', 'ranked',
  'rated', 'reached', 'realigned', 'realized', 'reasoned', 'rebuilt', 'recalculated', 'received',
  'recognized', 'recommended', 'reconciled', 'reconfigured', 'recorded', 'recovered', 'recruited', 'redesigned',
  'reduced', 'reengineered', 'refined', 'reformed', 'refocused', 'regulated', 'rehabilitated', 'reinforced',
  'rejuvenated', 'related', 'remedied', 'remodeled', 'rendered', 'renegotiated', 'reorganized', 'repaired',
  'replaced', 'replenished', 'reported', 'represented', 'requested', 'researched', 'resolved', 'responded',
  'restored', 'restructured', 'retained', 'retrieved', 'revamped', 'revealed', 'reviewed', 'revised',
  'revitalized', 'revolutionized', 'rewarded', 'routed', 'safeguarded', 'salvaged', 'saved', 'scanned',
  'scheduled', 'screened', 'scrutinized', 'secured', 'selected', 'separated', 'served', 'serviced',
  'settled', 'shaped', 'shared', 'showcased', 'simplified', 'simulated', 'slashed', 'solicited',
  'solved', 'spearheaded', 'specialized', 'specified', 'spoke', 'stabilized', 'staffed', 'standardized',
  'started', 'stimulated', 'strategized', 'streamlined', 'strengthened', 'structured', 'studied', 'submitted',
  'substantiated', 'succeeded', 'suggested', 'summarized', 'supervised', 'supplemented', 'supplied', 'supported',
  'surpassed', 'surveyed', 'sustained', 'synthesized', 'systematized', 'tabulated', 'targeted', 'taught',
  'teamed', 'tested', 'tightened', 'totaled', 'traced', 'tracked', 'trained', 'transcribed',
  'transferred', 'transformed', 'translated', 'transmitted', 'transported', 'treated', 'tripled', 'troubleshot',
  'tuned', 'uncovered', 'unified', 'unraveled', 'updated', 'upgraded', 'upsold', 'used',
  'utilized', 'validated', 'valued', 'varied', 'verified', 'viewed', 'visited', 'visualized',
  'vitalized', 'volunteered', 'weighed', 'widened', 'won', 'worked', 'wrote', 'yielded',

  // Tech Stacks, Frameworks & Languages
  'react', 'angular', 'vue', 'svelte', 'nextjs', 'remix', 'nodejs', 'express', 'nestjs', 'fastapi',
  'django', 'flask', 'spring', 'springboot', 'rails', 'laravel', 'dotnet', 'typescript', 'javascript',
  'python', 'java', 'kotlin', 'swift', 'golang', 'rust', 'ruby', 'php', 'scala', 'cplusplus', 'csharp',
  'html', 'css', 'sass', 'tailwind', 'bootstrap', 'materialui', 'chakra', 'styled', 'graphql', 'rest',
  'grpc', 'api', 'apis', 'json', 'xml', 'yaml', 'sql', 'nosql', 'postgresql', 'postgres', 'mysql',
  'mongodb', 'redis', 'cassandra', 'dynamodb', 'mariadb', 'oracle', 'sqlite', 'firestore', 'supabase',
  'docker', 'kubernetes', 'helm', 'terraform', 'ansible', 'jenkins', 'gitlab', 'github', 'actions',
  'circleci', 'aws', 'azure', 'gcp', 'cloud', 'lambda', 'serverless', 'microservices', 'monorepo',
  'kafka', 'rabbitmq', 'sqs', 'sns', 'pubsub', 'elasticsearch', 'opensearch', 'solr', 'datadog',
  'prometheus', 'grafana', 'sentry', 'newrelic', 'splunk', 'webpack', 'vite', 'esbuild', 'babel',
  'jest', 'vitest', 'cypress', 'playwright', 'selenium', 'mocha', 'chai', 'postman', 'swagger',
  'git', 'svn', 'linux', 'unix', 'ubuntu', 'centos', 'debian', 'macos', 'windows', 'bash', 'zsh', 'powershell',
  'figma', 'sketch', 'invision', 'adobe', 'photoshop', 'illustrator', 'xd', 'jira', 'confluence',
  'notion', 'trello', 'asana', 'slack', 'miro', 'linear', 'monday', 'amplitude', 'mixpanel', 'tableau',
  'powerbi', 'looker', 'metabase', 'snowflake', 'bigquery', 'redshift', 'databricks', 'spark', 'hadoop',
  'airflow', 'dbt', 'pandas', 'numpy', 'scipy', 'scikit', 'tensorflow', 'pytorch', 'keras', 'opencv',
  'nlp', 'llm', 'llms', 'genai', 'gemini', 'chatgpt', 'openai', 'anthropic', 'huggingface', 'langchain',

  // General Resume, Business & Technical Nouns
  'ability', 'academies', 'academy', 'accessibility', 'account', 'accounting', 'accuracy', 'achievement',
  'achievements', 'acquisition', 'acquisitions', 'action', 'actions', 'activities', 'activity', 'administration',
  'administrator', 'advancement', 'advisor', 'advisory', 'agency', 'agile', 'algorithm', 'algorithms',
  'allocation', 'analysis', 'analyst', 'analysts', 'analytics', 'annual', 'annualized', 'application',
  'applications', 'architecture', 'architectures', 'assessment', 'assessments', 'asset', 'assets',
  'associate', 'assurance', 'audience', 'audit', 'audits', 'automation', 'availability', 'award',
  'awards', 'bachelor', 'bachelors', 'backend', 'backup', 'bandwidth', 'baseline', 'behavior',
  'benchmark', 'benchmarks', 'benefit', 'benefits', 'biography', 'blueprint', 'board', 'bonus',
  'bottleneck', 'bottlenecks', 'brand', 'branding', 'budget', 'budgets', 'business', 'businesses',
  'campaign', 'campaigns', 'candidate', 'candidates', 'capability', 'capabilities', 'capacity', 'capital',
  'career', 'case', 'certification', 'certifications', 'chairman', 'champion', 'change', 'channel',
  'channels', 'charter', 'client', 'clients', 'cluster', 'clusters', 'coaching', 'code',
  'codebase', 'collaboration', 'collaborator', 'colleagues', 'college', 'commerce', 'commercial',
  'committee', 'communication', 'communications', 'community', 'company', 'companies', 'compatibility',
  'competency', 'competencies', 'compliance', 'component', 'components', 'computation', 'computer',
  'concept', 'concepts', 'concurrency', 'conference', 'configuration', 'configurations', 'connection',
  'connectivity', 'consultancy', 'consultant', 'consumer', 'consumers', 'content', 'contract',
  'contracts', 'contractor', 'contribution', 'contributions', 'control', 'controls', 'conversion',
  'conversions', 'coordination', 'coordinator', 'corporate', 'corporation', 'cost', 'costs',
  'counsel', 'coverage', 'credential', 'credentials', 'criterion', 'criteria', 'cross-functional',
  'culture', 'customer', 'customers', 'customization', 'cycle', 'cycles', 'dashboard', 'dashboards',
  'data', 'database', 'databases', 'dataset', 'datasets', 'deadline', 'deadlines', 'deal', 'deals',
  'debugging', 'decision', 'decisions', 'decomposition', 'defense', 'degree', 'degrees', 'deliverable',
  'deliverables', 'delivery', 'demand', 'demonstration', 'department', 'departments', 'deployment',
  'deployments', 'description', 'design', 'designer', 'designers', 'designs', 'developer', 'developers',
  'development', 'deviation', 'device', 'devices', 'devops', 'diagram', 'diploma', 'director',
  'directors', 'discipline', 'disciplines', 'discovery', 'discussion', 'dispatch', 'distributed',
  'distribution', 'diversity', 'division', 'divisions', 'doctorate', 'documentation', 'domain', 'domains',
  'driver', 'duration', 'earnings', 'ecosystem', 'ecosystems', 'education', 'efficiency', 'efficiencies',
  'effort', 'efforts', 'element', 'elements', 'elevation', 'elimination', 'employee', 'employees',
  'employer', 'employment', 'encryption', 'end-to-end', 'engagement', 'engagements', 'engine',
  'engineer', 'engineering', 'engineers', 'enhancement', 'enhancements', 'enterprise', 'enterprises',
  'environment', 'environments', 'equation', 'equipment', 'equity', 'escalation', 'establishment',
  'estimate', 'estimates', 'estimation', 'ethics', 'evaluation', 'evaluations', 'event', 'events',
  'examination', 'excellence', 'exception', 'exceptions', 'execution', 'executive', 'executives',
  'expansion', 'experience', 'experiences', 'experiment', 'experiments', 'expertise', 'exposure',
  'extension', 'factor', 'factors', 'failure', 'failures', 'feature', 'features', 'feedback',
  'fidelity', 'field', 'fields', 'figure', 'figures', 'finance', 'finances', 'financial',
  'finding', 'findings', 'firewall', 'firm', 'firms', 'flexibility', 'flow', 'flows',
  'focus', 'footprint', 'forecast', 'forecasting', 'format', 'formats', 'formula', 'foundation',
  'framework', 'frameworks', 'frontend', 'fulfillment', 'function', 'functionality', 'functions',
  'fund', 'funding', 'funds', 'gain', 'gains', 'gap', 'gaps', 'gateway',
  'gateways', 'generation', 'goal', 'goals', 'governance', 'grade', 'graduate', 'graduation',
  'growth', 'guideline', 'guidelines', 'handling', 'hardware', 'headcount', 'healthcare', 'helpdesk',
  'hierarchy', 'highlight', 'highlights', 'history', 'honor', 'honors', 'horizon', 'hospitality',
  'hypothesis', 'identification', 'impact', 'impacts', 'implementation', 'implementations', 'improvement',
  'improvements', 'incentive', 'incentives', 'incident', 'incidents', 'inclusion', 'income', 'incorporation',
  'increase', 'increases', 'increment', 'industry', 'industries', 'infection', 'inference', 'influence',
  'information', 'infrastructure', 'infrastructures', 'initiative', 'initiatives', 'innovation', 'innovations',
  'input', 'inputs', 'insight', 'insights', 'inspection', 'inspections', 'installation', 'installations',
  'instance', 'instances', 'instruction', 'instructions', 'instrumentation', 'insurance', 'integration',
  'integrations', 'integrity', 'intelligence', 'interaction', 'interactions', 'interface', 'interfaces',
  'intern', 'internship', 'internships', 'interoperability', 'interpretation', 'interview', 'interviews',
  'introduction', 'inventory', 'investigation', 'investment', 'investments', 'investor', 'investors',
  'iteration', 'iterations', 'journey', 'judgment', 'jurisdiction', 'key', 'keys', 'knowledge',
  'labor', 'laboratory', 'landscape', 'language', 'languages', 'latency', 'launch', 'launches',
  'layer', 'layers', 'layout', 'layouts', 'lead', 'leadership', 'leads', 'learning',
  'legacy', 'legislation', 'level', 'levels', 'leverage', 'liability', 'liabilities', 'library',
  'libraries', 'license', 'licenses', 'licensing', 'lifecycle', 'lifecycles', 'limit', 'limitation',
  'line', 'lines', 'link', 'links', 'load', 'loading', 'localization', 'location',
  'locations', 'logic', 'logistics', 'logs', 'loss', 'losses', 'machine', 'machines',
  'maintenance', 'major', 'majority', 'management', 'manager', 'managers', 'mandate', 'manifest',
  'manipulation', 'manufacturer', 'manufacturers', 'manufacturing', 'margin', 'margins', 'market',
  'marketing', 'markets', 'master', 'masters', 'match', 'matches', 'material', 'materials',
  'matrix', 'maturity', 'measurement', 'measurements', 'mechanism', 'mechanisms', 'media', 'medium',
  'member', 'members', 'membership', 'mentor', 'mentoring', 'mentorship', 'merchandise', 'merchant',
  'merchants', 'merger', 'mergers', 'message', 'messages', 'messaging', 'metadata', 'method',
  'methodology', 'methodologies', 'methods', 'metric', 'metrics', 'microservice', 'microservices',
  'milestone', 'milestones', 'millions', 'minority', 'mission', 'mitigation', 'mobile', 'model',
  'modeling', 'models', 'module', 'modules', 'monetization', 'monitoring', 'monthly', 'movement',
  'multitenancy', 'namespace', 'namespaces', 'navigation', 'need', 'needs', 'network', 'networking',
  'networks', 'neutrality', 'node', 'nodes', 'normalization', 'notification', 'notifications', 'number',
  'numbers', 'objective', 'objectives', 'observation', 'observations', 'obstacle', 'obstacles', 'officer',
  'officers', 'omnichannel', 'onboarding', 'open-source', 'operation', 'operational', 'operations',
  'opportunity', 'opportunities', 'optimization', 'optimizations', 'option', 'options', 'orchestration',
  'order', 'orders', 'organization', 'organizations', 'orientation', 'outcome', 'outcomes', 'output',
  'outputs', 'outreach', 'outsource', 'outsourcing', 'overhead', 'oversight', 'overview', 'ownership',
  'package', 'packages', 'page', 'pages', 'parameter', 'parameters', 'parent', 'part',
  'participant', 'participants', 'participation', 'partner', 'partners', 'partnership', 'partnerships',
  'pathway', 'pathways', 'patient', 'patients', 'pattern', 'patterns', 'payroll', 'peer',
  'peers', 'penetration', 'percentage', 'performance', 'period', 'permission', 'permissions',
  'personnel', 'perspective', 'perspectives', 'phase', 'phases', 'philosophy', 'physician', 'pipeline',
  'pipelines', 'pivot', 'pivots', 'placement', 'plan', 'planning', 'plans', 'platform',
  'platforms', 'point', 'points', 'policy', 'policies', 'pool', 'pooling', 'population',
  'portfolio', 'portfolios', 'position', 'positions', 'post-mortem', 'potential', 'practice', 'practices',
  'precision', 'prediction', 'predictions', 'preparation', 'presentation', 'presentations', 'pricing',
  'principle', 'principles', 'priority', 'priorities', 'privacy', 'problem', 'problems', 'procedure',
  'procedures', 'process', 'processes', 'processing', 'procurement', 'product', 'production',
  'productivity', 'products', 'profession', 'professional', 'professionals', 'proficiency', 'profile',
  'profit', 'profitability', 'profits', 'program', 'programmer', 'programmers', 'programming',
  'programs', 'progress', 'progression', 'project', 'projection', 'projections', 'projects',
  'promotion', 'promotions', 'prompt', 'prompting', 'proof', 'proposal', 'proposals', 'propulsion',
  'protocol', 'protocols', 'prototype', 'prototypes', 'prototyping', 'provider', 'providers',
  'provisioning', 'publication', 'publications', 'publisher', 'purchase', 'purchases', 'purchasing',
  'purpose', 'quality', 'quantification', 'quarter', 'quarterly', 'queries', 'query', 'quota',
  'quotas', 'ranking', 'rankings', 'rate', 'rates', 'ratio', 'ratios', 'reach',
  'reaction', 'readability', 'readiness', 'real-time', 'realignment', 'reasoning', 'receipt', 'recommendation',
  'recommendations', 'record', 'records', 'recovery', 'recruiter', 'recruiters', 'recruitment', 'reduction',
  'reductions', 'redundancy', 'refactoring', 'reference', 'references', 'refinement', 'region',
  'regions', 'regression', 'regulation', 'regulations', 'relationship', 'relationships', 'release',
  'releases', 'relevance', 'reliability', 'remediation', 'rendering', 'reorganization', 'replication',
  'report', 'reporting', 'reports', 'repository', 'repositories', 'representation', 'representative',
  'representatives', 'reputation', 'request', 'requests', 'requirement', 'requirements', 'research',
  'researcher', 'researchers', 'resolution', 'resource', 'resources', 'response', 'responses',
  'responsibility', 'responsibilities', 'responsive', 'responsiveness', 'restructuring', 'result',
  'results', 'retention', 'revenue', 'revenues', 'review', 'reviews', 'revision', 'revisions',
  'reward', 'rewards', 'rigor', 'risk', 'risks', 'roadmap', 'roadmaps', 'robustness',
  'role', 'roles', 'rotation', 'round', 'rounds', 'routine', 'routines', 'routing',
  'safety', 'salary', 'sale', 'sales', 'sample', 'samples', 'sampling', 'sandbox',
  'satisfaction', 'saving', 'savings', 'scalability', 'scale', 'scaling', 'scenario', 'scenarios',
  'schedule', 'schedules', 'scheduling', 'schema', 'schemas', 'scholarship', 'scholarships',
  'school', 'schools', 'scope', 'scopes', 'score', 'scores', 'screening', 'script',
  'scripting', 'scripts', 'scrum', 'search', 'seat', 'seats', 'second', 'seconds',
  'section', 'sections', 'sector', 'sectors', 'security', 'segment', 'segmentation', 'segments',
  'selection', 'selections', 'self-service', 'seminar', 'seminars', 'senior', 'sequence', 'sequences',
  'server', 'servers', 'service', 'services', 'session', 'sessions', 'setup', 'share',
  'shares', 'shareholder', 'shareholders', 'shift', 'shifts', 'shortage', 'shortcoming', 'showcase',
  'signal', 'signals', 'signature', 'simulation', 'simulations', 'site', 'sites', 'skill',
  'skills', 'solution', 'solutions', 'source', 'sources', 'specification', 'specifications',
  'speed', 'sphere', 'spike', 'spikes', 'sponsor', 'sponsorship', 'sprint', 'sprints',
  'stability', 'stack', 'stacks', 'staff', 'staffing', 'stage', 'stages', 'stakeholder',
  'stakeholders', 'standard', 'standardization', 'standards', 'standup', 'standups', 'start-up',
  'startup', 'startups', 'statement', 'statements', 'statistics', 'status', 'stimulus', 'storage',
  'story', 'stories', 'strategy', 'strategies', 'stream', 'streaming', 'streams', 'structure',
  'structures', 'student', 'students', 'study', 'studies', 'style', 'styles', 'subject',
  'subjects', 'submission', 'submissions', 'subscription', 'subscriptions', 'subset', 'substance',
  'success', 'successes', 'suite', 'suites', 'summary', 'summaries', 'supervision', 'supervisor',
  'supervisors', 'supplement', 'supplier', 'suppliers', 'supply', 'support', 'survey', 'surveys',
  'sustainability', 'switch', 'switches', 'synchronization', 'syntax', 'synthesis', 'system',
  'systems', 'table', 'tables', 'tactic', 'tactics', 'tag', 'tags', 'talent',
  'target', 'targets', 'task', 'tasks', 'taxonomy', 'team', 'teams', 'teamwork',
  'tech', 'technical', 'technician', 'technicians', 'technique', 'techniques', 'technology',
  'technologies', 'template', 'templates', 'tenant', 'tenants', 'term', 'terminal', 'terms',
  'test', 'testing', 'tests', 'throughput', 'ticket', 'tickets', 'tier', 'tiers',
  'timeline', 'timelines', 'token', 'tokens', 'tolerance', 'tool', 'tooling', 'toolkit',
  'toolkits', 'tools', 'topic', 'topics', 'total', 'totals', 'traceability', 'tracking',
  'trade', 'trades', 'traffic', 'training', 'transaction', 'transactions', 'transformation',
  'transformations', 'transition', 'transitions', 'translation', 'transmission', 'transport',
  'transportation', 'treasury', 'trend', 'trends', 'triage', 'troubleshooting', 'trust', 'tuning',
  'tutorial', 'tutorials', 'type', 'types', 'ultimatum', 'understanding', 'unit', 'units',
  'university', 'universities', 'update', 'updates', 'upgrade', 'upgrades', 'uptime', 'usability',
  'usage', 'user', 'users', 'utilization', 'utility', 'utilities', 'validation', 'value',
  'values', 'variable', 'variables', 'variation', 'variations', 'variety', 'vault', 'vector',
  'velocity', 'vendor', 'vendors', 'venture', 'ventures', 'venue', 'verification', 'version',
  'versioning', 'versions', 'vessel', 'viability', 'vice', 'video', 'videos', 'view',
  'views', 'vintage', 'violation', 'violations', 'virtualization', 'visibility', 'vision',
  'volume', 'volumes', 'vulnerability', 'vulnerabilities', 'walkthrough', 'warehouse', 'warehouses',
  'warning', 'warnings', 'warranty', 'warranties', 'waste', 'waterfall', 'waveform', 'website',
  'websites', 'weight', 'wellness', 'whitepaper', 'whitepapers', 'window', 'windows', 'wireframe',
  'wireframes', 'wisdom', 'workflow', 'workflows', 'workload', 'workloads', 'workplace',
  'workshop', 'workshops', 'workspace', 'workspaces', 'world', 'worth', 'writer', 'writers',
  'yield', 'zone', 'zones',

  // Common English Connecting Words, Pronouns, Adjectives, Adverbs
  'a', 'about', 'above', 'across', 'after', 'again', 'against', 'all', 'almost', 'along',
  'already', 'also', 'although', 'always', 'am', 'among', 'an', 'and', 'another', 'any',
  'are', 'around', 'as', 'at', 'back', 'be', 'because', 'been', 'before', 'being',
  'below', 'between', 'both', 'but', 'by', 'can', 'could', 'did', 'do', 'does',
  'doing', 'done', 'down', 'during', 'each', 'either', 'else', 'even', 'every', 'everyone',
  'everything', 'far', 'few', 'first', 'for', 'from', 'further', 'get', 'getting', 'give',
  'given', 'giving', 'go', 'good', 'great', 'had', 'has', 'have', 'having', 'he',
  'her', 'here', 'high', 'highest', 'him', 'his', 'how', 'however', 'i', 'if',
  'in', 'into', 'is', 'it', 'its', 'itself', 'just', 'large', 'larger', 'largest',
  'last', 'later', 'least', 'less', 'let', 'like', 'likely', 'little', 'long', 'longer',
  'longest', 'low', 'lower', 'lowest', 'made', 'make', 'making', 'many', 'may', 'me',
  'mean', 'means', 'might', 'more', 'most', 'much', 'must', 'my', 'myself', 'near',
  'neither', 'never', 'new', 'next', 'no', 'none', 'nor', 'not', 'now', 'of',
  'off', 'often', 'on', 'once', 'one', 'only', 'onto', 'or', 'other', 'others',
  'our', 'ours', 'ourselves', 'out', 'over', 'own', 'part', 'per', 'perhaps', 'please',
  'quite', 'rather', 'really', 'regarding', 'right', 'same', 'say', 'saying', 'see', 'several',
  'shall', 'she', 'should', 'since', 'small', 'smaller', 'smallest', 'so', 'some', 'someone',
  'something', 'still', 'such', 'than', 'that', 'the', 'their', 'theirs', 'them', 'themselves',
  'then', 'there', 'therefore', 'these', 'they', 'this', 'those', 'though', 'through', 'throughout',
  'thus', 'to', 'together', 'too', 'top', 'toward', 'towards', 'under', 'unless', 'until',
  'up', 'upon', 'us', 'use', 'very', 'via', 'was', 'way', 'ways', 'we',
  'well', 'were', 'what', 'whatever', 'when', 'where', 'whether', 'which', 'while', 'who',
  'whole', 'whom', 'whose', 'why', 'will', 'with', 'within', 'without', 'would', 'yes',
  'yet', 'you', 'your', 'yours', 'yourself', 'yourselves',
]);

// Direct typo-to-correction dictionary for instant accurate fixes
const COMMON_TYPOS: Record<string, string> = {
  'recieve': 'receive',
  'recieved': 'received',
  'recieving': 'receiving',
  'teh': 'the',
  'impliment': 'implement',
  'implimented': 'implemented',
  'implimenting': 'implementing',
  'implimentation': 'implementation',
  'achive': 'achieve',
  'achived': 'achieved',
  'achivement': 'achievement',
  'achivements': 'achievements',
  'experiance': 'experience',
  'experianced': 'experienced',
  'experiances': 'experiences',
  'managment': 'management',
  'manger': 'manager',
  'engeneer': 'engineer',
  'engeneering': 'engineering',
  'enginer': 'engineer',
  'develloper': 'developer',
  'devloper': 'developer',
  'developement': 'development',
  'reponsible': 'responsible',
  'reponsibility': 'responsibility',
  'responsability': 'responsibility',
  'responsabilities': 'responsibilities',
  'responsibile': 'responsible',
  'optmization': 'optimization',
  'optmized': 'optimized',
  'optmize': 'optimize',
  'colaborate': 'collaborate',
  'colaborated': 'collaborated',
  'colaboration': 'collaboration',
  'coordiante': 'coordinate',
  'coordianted': 'coordinated',
  'coordiantion': 'coordination',
  'maintainance': 'maintenance',
  'maintanance': 'maintenance',
  'sucessful': 'successful',
  'sucess': 'success',
  'sucessfully': 'successfully',
  'neccessary': 'necessary',
  'necesary': 'necessary',
  'oppurtunity': 'opportunity',
  'oppurtunities': 'opportunities',
  'seperate': 'separate',
  'seperated': 'separated',
  'definately': 'definitely',
  'occured': 'occurred',
  'occuring': 'occurring',
  'infrastruture': 'infrastructure',
  'infrastucture': 'infrastructure',
  'performence': 'performance',
  'perfomance': 'performance',
  'enviroment': 'environment',
  'enviroments': 'environments',
  'architechture': 'architecture',
  'architecht': 'architect',
  'knowlege': 'knowledge',
  'stragety': 'strategy',
  'stragetic': 'strategic',
  'commited': 'committed',
  'calender': 'calendar',
  'untill': 'until',
  'truely': 'truly',
  'accomodate': 'accommodate',
  'accomodation': 'accommodation',
  'reccomend': 'recommend',
  'reccomended': 'recommended',
  'recomended': 'recommended',
  'analysys': 'analysis',
  'efficent': 'efficient',
  'efficently': 'efficiently',
  'independant': 'independent',
  'guarentee': 'guarantee',
  'funtion': 'function',
  'funtions': 'functions',
  'fuction': 'function',
  'algoritm': 'algorithm',
  'algoritms': 'algorithms',
  'databse': 'database',
  'databses': 'databases',
  'frotend': 'frontend',
  'bakend': 'backend',
  'fullstack': 'full-stack',
  'librery': 'library',
  'libreries': 'libraries',
  'framwork': 'framework',
  'framworks': 'frameworks',
  'requirment': 'requirement',
  'requirments': 'requirements',
  'troubleshoting': 'troubleshooting',
  'troubleshot': 'troubleshot',
  'qualitiy': 'quality',
  'compatability': 'compatibility',
  'supercede': 'supersede',
  'persistant': 'persistent',
  'persistancy': 'persistency',
  'consistant': 'consistent',
  'consistancy': 'consistency',
  'proccess': 'process',
  'proccessing': 'processing',
  'programing': 'programming',
  'progammer': 'programmer',
  'programer': 'programmer',
  'leadship': 'leadership',
  'intergration': 'integration',
  'intergrated': 'integrated',
  'intergrating': 'integrating',
  'conection': 'connection',
  'conections': 'connections',
  'monitering': 'monitoring',
  'monitered': 'monitored',
  'moniter': 'monitor',
  'deployement': 'deployment',
  'configuartion': 'configuration',
  'configuation': 'configuration',
  'paralell': 'parallel',
  'parrallel': 'parallel',
  'referance': 'reference',
  'referances': 'references',
  'differant': 'different',
  'importent': 'important',
  'significiant': 'significant',
  'significent': 'significant',
  'certifcate': 'certificate',
  'certifcation': 'certification',
  'proficent': 'proficient',
  'proficency': 'proficiency',
  'spearhead': 'spearhead',
  'spearheded': 'spearheaded',
  'spearhed': 'spearhead',
  'orchestrated': 'orchestrated',
  'orchestred': 'orchestrated',
  'architectured': 'architected',
  'delievered': 'delivered',
  'deliever': 'deliver',
  'delievery': 'delivery',
  'colleages': 'colleagues',
  'collegue': 'colleague',
  'criticial': 'critical',
  'automaton': 'automation',
  'autmated': 'automated',
};

// Damerau-Levenshtein distance calculation
function damerauLevenshtein(a: string, b: string): number {
  const al = a.length;
  const bl = b.length;
  if (al === 0) return bl;
  if (bl === 0) return al;

  const matrix: number[][] = [];
  for (let i = 0; i <= al; i++) {
    matrix[i] = [i];
  }
  for (let j = 0; j <= bl; j++) {
    matrix[0][j] = j;
  }

  for (let i = 1; i <= al; i++) {
    for (let j = 1; j <= bl; j++) {
      const cost = a[i - 1] === b[j - 1] ? 0 : 1;
      let min = Math.min(
        matrix[i - 1][j] + 1, // deletion
        matrix[i][j - 1] + 1, // insertion
        matrix[i - 1][j - 1] + cost // substitution
      );

      // Transposition
      if (i > 1 && j > 1 && a[i - 1] === b[j - 2] && a[i - 2] === b[j - 1]) {
        min = Math.min(min, matrix[i - 2][j - 2] + cost);
      }

      matrix[i][j] = min;
    }
  }

  return matrix[al][bl];
}

// Custom User Dictionary Management
export function getUserDictionary(): string[] {
  try {
    const raw = localStorage.getItem(USER_DICT_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function addToUserDictionary(word: string): void {
  if (!word || typeof word !== 'string') return;
  const clean = word.trim().toLowerCase();
  if (!clean) return;
  const current = getUserDictionary();
  if (!current.includes(clean)) {
    const updated = [...current, clean];
    try {
      localStorage.setItem(USER_DICT_KEY, JSON.stringify(updated));
    } catch (e) {
      console.warn('Failed to save to custom dictionary:', e);
    }
  }
}

export function removeFromUserDictionary(word: string): void {
  const clean = word.trim().toLowerCase();
  const current = getUserDictionary();
  const updated = current.filter((w) => w !== clean);
  try {
    localStorage.setItem(USER_DICT_KEY, JSON.stringify(updated));
  } catch (e) {
    console.warn('Failed to update custom dictionary:', e);
  }
}

// Session-level ignored words set (does not persist permanently)
const sessionIgnoredWords = new Set<string>();

export function ignoreWordInSession(word: string): void {
  if (word) sessionIgnoredWords.add(word.trim().toLowerCase());
}

export function isWordIgnored(word: string): boolean {
  if (!word) return true;
  return sessionIgnoredWords.has(word.trim().toLowerCase());
}

// Clean and test individual word
export function isWordValid(rawWord: string): boolean {
  if (!rawWord || rawWord.length <= 1) return true;

  const word = rawWord.toLowerCase().trim();

  // If numbers, currency, emails, URLs, code variables with symbols or numbers, treat as valid
  if (/\d/.test(word) || /[@\/\.#_\+\$]/.test(word)) return true;

  // Check session ignored
  if (sessionIgnoredWords.has(word)) return true;

  // Check base dictionary
  if (BASE_DICTIONARY.has(word)) return true;

  // Check custom user dictionary
  const userDict = getUserDictionary();
  if (userDict.includes(word)) return true;

  // Common plurals / simple suffixes
  if (word.endsWith('s') && BASE_DICTIONARY.has(word.slice(0, -1))) return true;
  if (word.endsWith('es') && BASE_DICTIONARY.has(word.slice(0, -2))) return true;
  if (word.endsWith('ed') && BASE_DICTIONARY.has(word.slice(0, -2))) return true;
  if (word.endsWith('ing') && BASE_DICTIONARY.has(word.slice(0, -3))) return true;
  if (word.endsWith('ly') && BASE_DICTIONARY.has(word.slice(0, -2))) return true;

  return false;
}

// Generate smart suggestions for a misspelled word
export function getSuggestions(rawWord: string, maxSuggestions = 3): string[] {
  const word = rawWord.toLowerCase().trim();
  const isCapitalized = rawWord.length > 0 && rawWord[0] === rawWord[0].toUpperCase();
  const isAllUpper = rawWord.length > 1 && rawWord === rawWord.toUpperCase();

  const results: { word: string; distance: number }[] = [];

  // 1. Direct typo dictionary check (fastest & highest confidence)
  if (COMMON_TYPOS[word]) {
    const directMatch = COMMON_TYPOS[word];
    return [formatCase(directMatch, isCapitalized, isAllUpper)];
  }

  // 2. Scan dictionary with distance threshold
  const userDict = getUserDictionary();
  const allWords = [...Array.from(BASE_DICTIONARY), ...userDict];

  const maxDist = word.length <= 4 ? 1 : word.length <= 8 ? 2 : 3;

  for (const dictWord of allWords) {
    // Length difference filter for fast pruning
    if (Math.abs(dictWord.length - word.length) > maxDist) continue;

    // First letter heuristic: give preference to same starting letter
    const startSame = dictWord[0] === word[0];
    const dist = damerauLevenshtein(word, dictWord);

    if (dist <= maxDist) {
      results.push({
        word: dictWord,
        distance: dist + (startSame ? 0 : 0.5),
      });
    }
  }

  // Sort by lowest distance first, then length similarity
  results.sort((a, b) => a.distance - b.distance);

  const top = results.slice(0, maxSuggestions).map((r) => formatCase(r.word, isCapitalized, isAllUpper));
  return Array.from(new Set(top));
}

function formatCase(word: string, isCapitalized: boolean, isAllUpper: boolean): string {
  if (isAllUpper) return word.toUpperCase();
  if (isCapitalized) return word.charAt(0).toUpperCase() + word.slice(1);
  return word;
}

// Main tokenizer and typo scanner for a full sentence or paragraph
export function findTyposInText(text: string): TypoMatch[] {
  if (!text || typeof text !== 'string' || text.trim() === '') {
    return [];
  }

  const typos: TypoMatch[] = [];

  // Regex to extract whole words with their precise string offsets
  // Matches Latin alphabet words (including hyphens between word parts like 'end-to-end')
  const wordRegex = /\b[A-Za-z]+(?:'[A-Za-z]+)?\b/g;
  let match: RegExpExecArray | null;

  while ((match = wordRegex.exec(text)) !== null) {
    const rawWord = match[0];
    const startIndex = match.index;
    const endIndex = startIndex + rawWord.length;

    // Skip single letter words (e.g. 'I', 'a')
    if (rawWord.length <= 1) continue;

    // Check if word is valid
    if (!isWordValid(rawWord)) {
      const suggestions = getSuggestions(rawWord, 3);
      typos.push({
        word: rawWord.toLowerCase(),
        originalWord: rawWord,
        startIndex,
        endIndex,
        suggestions,
      });
    }
  }

  return typos;
}

// Quick helper to replace a matched typo in a source string
export function replaceTypoInText(
  sourceText: string,
  typo: TypoMatch,
  correction: string
): string {
  if (!sourceText) return '';
  return (
    sourceText.slice(0, typo.startIndex) +
    correction +
    sourceText.slice(typo.endIndex)
  );
}

// Replace all typos in text with their top suggestion
export function fixAllTyposInText(sourceText: string, typos: TypoMatch[]): string {
  if (!sourceText || typos.length === 0) return sourceText;

  // Process from right to left so indices don't shift
  const sortedTypos = [...typos].sort((a, b) => b.startIndex - a.startIndex);
  let result = sourceText;

  for (const typo of sortedTypos) {
    if (typo.suggestions.length > 0) {
      result =
        result.slice(0, typo.startIndex) +
        typo.suggestions[0] +
        result.slice(typo.endIndex);
    }
  }

  return result;
}
