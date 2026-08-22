export interface RoleSkill {
  name: string;
  category: 'Technical' | 'Soft Skills' | 'Tools & Platforms' | 'Languages' | 'Other';
  popularity?: number; // 1-100
  aliases?: string[];
}

export interface RoleSkillProfile {
  id: string;
  name: string;
  iconName?: string;
  description: string;
  keywords: string[];
  skills: RoleSkill[];
}

export const ROLE_SKILL_PROFILES: RoleSkillProfile[] = [
  {
    id: 'full-stack',
    name: 'Full-Stack Developer / Engineer',
    description: 'Modern end-to-end web & cloud application development',
    keywords: ['full stack', 'fullstack', 'full-stack', 'software engineer', 'software developer', 'web developer', 'application developer'],
    skills: [
      { name: 'TypeScript', category: 'Languages', popularity: 98, aliases: ['ts'] },
      { name: 'JavaScript (ES6+)', category: 'Languages', popularity: 97, aliases: ['js', 'ecmascript'] },
      { name: 'React', category: 'Technical', popularity: 97, aliases: ['reactjs', 'react.js'] },
      { name: 'Node.js', category: 'Technical', popularity: 95, aliases: ['nodejs'] },
      { name: 'Next.js', category: 'Technical', popularity: 92, aliases: ['nextjs'] },
      { name: 'RESTful APIs', category: 'Technical', popularity: 95, aliases: ['rest api', 'api design'] },
      { name: 'GraphQL', category: 'Technical', popularity: 88, aliases: ['apollo'] },
      { name: 'PostgreSQL', category: 'Tools & Platforms', popularity: 92, aliases: ['postgres', 'psql'] },
      { name: 'MongoDB', category: 'Tools & Platforms', popularity: 85, aliases: ['mongo'] },
      { name: 'Redis', category: 'Tools & Platforms', popularity: 87, aliases: ['caching'] },
      { name: 'Docker', category: 'Tools & Platforms', popularity: 92, aliases: ['containers', 'containerization'] },
      { name: 'AWS (Amazon Web Services)', category: 'Tools & Platforms', popularity: 91, aliases: ['aws', 'cloud'] },
      { name: 'Tailwind CSS', category: 'Technical', popularity: 90, aliases: ['tailwind', 'tailwindcss'] },
      { name: 'Microservices Architecture', category: 'Technical', popularity: 89, aliases: ['microservices'] },
      { name: 'CI/CD Pipelines', category: 'Tools & Platforms', popularity: 89, aliases: ['github actions', 'continuous integration'] },
      { name: 'Git & GitHub', category: 'Tools & Platforms', popularity: 96, aliases: ['version control', 'git'] },
      { name: 'System Design & Scalability', category: 'Technical', popularity: 92, aliases: ['system architecture', 'scalability'] },
      { name: 'Unit & Integration Testing (Jest/Playwright)', category: 'Technical', popularity: 86, aliases: ['jest', 'playwright', 'cypress', 'testing'] },
      { name: 'Agile & Scrum', category: 'Soft Skills', popularity: 90, aliases: ['agile', 'scrum', 'sprint planning'] },
      { name: 'Cross-Functional Collaboration', category: 'Soft Skills', popularity: 88 },
      { name: 'Code Review & Mentorship', category: 'Soft Skills', popularity: 85 },
      { name: 'SQL Optimization', category: 'Technical', popularity: 84 },
    ],
  },
  {
    id: 'frontend',
    name: 'Frontend Engineer / UI Developer',
    description: 'Interactive user interfaces, client performance & design systems',
    keywords: ['frontend', 'front-end', 'front end', 'ui engineer', 'ui developer', 'web engineer', 'client engineer'],
    skills: [
      { name: 'React', category: 'Technical', popularity: 99, aliases: ['reactjs'] },
      { name: 'TypeScript', category: 'Languages', popularity: 98, aliases: ['ts'] },
      { name: 'HTML5 & Semantic Markup', category: 'Languages', popularity: 96, aliases: ['html', 'html5'] },
      { name: 'CSS3 & Modern Layouts (Grid/Flexbox)', category: 'Languages', popularity: 96, aliases: ['css', 'css3', 'flexbox', 'grid'] },
      { name: 'Next.js & Server-Side Rendering (SSR)', category: 'Technical', popularity: 94, aliases: ['nextjs', 'ssr', 'ssg'] },
      { name: 'Vue.js', category: 'Technical', popularity: 82, aliases: ['vue', 'vuejs', 'nuxt'] },
      { name: 'State Management (Redux / Zustand)', category: 'Technical', popularity: 91, aliases: ['redux', 'zustand', 'recoil', 'context api'] },
      { name: 'Tailwind CSS', category: 'Technical', popularity: 93, aliases: ['tailwind'] },
      { name: 'Web Performance Optimization (Core Web Vitals)', category: 'Technical', popularity: 92, aliases: ['lighthouse', 'core web vitals', 'performance'] },
      { name: 'Web Accessibility (WCAG / a11y)', category: 'Technical', popularity: 90, aliases: ['a11y', 'accessibility', 'wcag'] },
      { name: 'Design Systems & Component Libraries', category: 'Technical', popularity: 91, aliases: ['storybook', 'shadcn', 'radix ui', 'chakra'] },
      { name: 'Responsive & Mobile-First Design', category: 'Technical', popularity: 95, aliases: ['responsive design', 'mobile-first'] },
      { name: 'Client-side Testing (Jest, React Testing Library)', category: 'Technical', popularity: 89, aliases: ['rtl', 'jest', 'vitest'] },
      { name: 'End-to-End Testing (Cypress / Playwright)', category: 'Technical', popularity: 87, aliases: ['playwright', 'cypress', 'e2e'] },
      { name: 'Webpack / Vite / Build Tooling', category: 'Tools & Platforms', popularity: 88, aliases: ['vite', 'webpack', 'turbopack'] },
      { name: 'REST & GraphQL APIs', category: 'Technical', popularity: 90, aliases: ['graphql', 'rest'] },
      { name: 'Figma to Code Implementation', category: 'Tools & Platforms', popularity: 89, aliases: ['figma'] },
      { name: 'Animation (Framer Motion / GSAP)', category: 'Technical', popularity: 84, aliases: ['framer motion', 'motion', 'gsap'] },
      { name: 'Cross-Browser Compatibility', category: 'Technical', popularity: 87 },
      { name: 'Git & Version Control', category: 'Tools & Platforms', popularity: 94 },
    ],
  },
  {
    id: 'backend',
    name: 'Backend / Systems Engineer',
    description: 'High-throughput APIs, distributed systems, caching & data modeling',
    keywords: ['backend', 'back-end', 'back end', 'systems engineer', 'api engineer', 'distributed systems', 'server engineer'],
    skills: [
      { name: 'Python', category: 'Languages', popularity: 95, aliases: ['django', 'fastapi', 'flask'] },
      { name: 'Java / Spring Boot', category: 'Languages', popularity: 93, aliases: ['java', 'spring', 'spring boot'] },
      { name: 'Go (Golang)', category: 'Languages', popularity: 92, aliases: ['go', 'golang'] },
      { name: 'Node.js & Express', category: 'Technical', popularity: 91, aliases: ['nodejs', 'express', 'nest.js'] },
      { name: 'C# / .NET Core', category: 'Languages', popularity: 88, aliases: ['c#', '.net', 'asp.net'] },
      { name: 'PostgreSQL & SQL Performance Tuning', category: 'Tools & Platforms', popularity: 96, aliases: ['postgres', 'sql', 'query optimization'] },
      { name: 'Distributed Systems & Microservices', category: 'Technical', popularity: 95, aliases: ['microservices', 'distributed systems'] },
      { name: 'Redis Caching & In-Memory Stores', category: 'Tools & Platforms', popularity: 92, aliases: ['redis', 'memcached', 'caching'] },
      { name: 'Apache Kafka & Event-Driven Architecture', category: 'Tools & Platforms', popularity: 90, aliases: ['kafka', 'event-driven', 'rabbitmq', 'pubsub'] },
      { name: 'gRPC & Protocol Buffers', category: 'Technical', popularity: 87, aliases: ['grpc', 'protobuf'] },
      { name: 'Docker & Containerization', category: 'Tools & Platforms', popularity: 94, aliases: ['docker'] },
      { name: 'Kubernetes (K8s)', category: 'Tools & Platforms', popularity: 89, aliases: ['k8s', 'kubernetes'] },
      { name: 'AWS (ECS, Lambda, SQS, S3, RDS)', category: 'Tools & Platforms', popularity: 93, aliases: ['aws', 'lambda', 'sqs'] },
      { name: 'Database Sharding & Replication', category: 'Technical', popularity: 88, aliases: ['replication', 'sharding'] },
      { name: 'API Security & OAuth2 / JWT', category: 'Technical', popularity: 91, aliases: ['oauth', 'jwt', 'auth', 'security'] },
      { name: 'CI/CD & Automated Deployment', category: 'Tools & Platforms', popularity: 88 },
      { name: 'Observability & Monitoring (Datadog, Prometheus)', category: 'Tools & Platforms', popularity: 86, aliases: ['datadog', 'prometheus', 'grafana', 'opentelemetry'] },
      { name: 'Test-Driven Development (TDD)', category: 'Technical', popularity: 84 },
    ],
  },
  {
    id: 'devops-cloud',
    name: 'DevOps & Cloud Infrastructure Engineer',
    description: 'Infrastructure as Code, CI/CD pipelines, container orchestration & reliability (SRE)',
    keywords: ['devops', 'sre', 'site reliability', 'cloud engineer', 'infrastructure', 'platform engineer', 'systems administrator'],
    skills: [
      { name: 'Amazon Web Services (AWS)', category: 'Tools & Platforms', popularity: 98, aliases: ['aws'] },
      { name: 'Google Cloud Platform (GCP)', category: 'Tools & Platforms', popularity: 89, aliases: ['gcp'] },
      { name: 'Microsoft Azure', category: 'Tools & Platforms', popularity: 88, aliases: ['azure'] },
      { name: 'Kubernetes (K8s)', category: 'Tools & Platforms', popularity: 97, aliases: ['k8s', 'kubernetes'] },
      { name: 'Docker & Container Security', category: 'Tools & Platforms', popularity: 96, aliases: ['docker'] },
      { name: 'Terraform & Infrastructure as Code (IaC)', category: 'Tools & Platforms', popularity: 95, aliases: ['terraform', 'iac', 'opentofu'] },
      { name: 'CI/CD (GitHub Actions, GitLab CI, Jenkins)', category: 'Tools & Platforms', popularity: 96, aliases: ['ci/cd', 'github actions', 'gitlab ci', 'jenkins'] },
      { name: 'Linux System Administration & Bash Scripting', category: 'Technical', popularity: 94, aliases: ['linux', 'bash', 'shell'] },
      { name: 'Prometheus & Grafana Monitoring', category: 'Tools & Platforms', popularity: 91, aliases: ['prometheus', 'grafana'] },
      { name: 'Datadog & APM Observability', category: 'Tools & Platforms', popularity: 89, aliases: ['datadog', 'apm', 'new relic'] },
      { name: 'Helm & Kubernetes Manifests', category: 'Tools & Platforms', popularity: 88, aliases: ['helm'] },
      { name: 'Ansible & Configuration Management', category: 'Tools & Platforms', popularity: 85, aliases: ['ansible'] },
      { name: 'ArgoCD & GitOps', category: 'Tools & Platforms', popularity: 87, aliases: ['argocd', 'gitops', 'flux'] },
      { name: 'Service Mesh (Istio / Linkerd)', category: 'Technical', popularity: 82, aliases: ['istio'] },
      { name: 'Site Reliability Engineering (SLOs/SLAs/Error Budgets)', category: 'Technical', popularity: 90, aliases: ['sre', 'slo', 'sla'] },
      { name: 'Cloud Cost Optimization (FinOps)', category: 'Technical', popularity: 85, aliases: ['finops', 'cost optimization'] },
      { name: 'Network Security, VPCs & Cloudflare', category: 'Technical', popularity: 87, aliases: ['vpc', 'cloudflare', 'firewall'] },
    ],
  },
  {
    id: 'data-science-ai',
    name: 'Data Scientist & Machine Learning / AI Engineer',
    description: 'Predictive modeling, deep learning, LLMs, NLP, and MLOps',
    keywords: ['data science', 'data scientist', 'machine learning', 'ml engineer', 'ai engineer', 'artificial intelligence', 'deep learning', 'nlp', 'computer vision'],
    skills: [
      { name: 'Python', category: 'Languages', popularity: 99, aliases: ['python3'] },
      { name: 'SQL & Complex Querying', category: 'Languages', popularity: 96, aliases: ['sql'] },
      { name: 'PyTorch', category: 'Technical', popularity: 94, aliases: ['pytorch', 'torch'] },
      { name: 'TensorFlow & Keras', category: 'Technical', popularity: 88, aliases: ['tensorflow', 'keras'] },
      { name: 'Scikit-Learn', category: 'Technical', popularity: 92, aliases: ['sklearn'] },
      { name: 'Pandas & NumPy', category: 'Technical', popularity: 95, aliases: ['pandas', 'numpy'] },
      { name: 'Large Language Models (LLMs) & Prompt Engineering', category: 'Technical', popularity: 96, aliases: ['llm', 'genai', 'langchain', 'llama-index', 'openai', 'gemini'] },
      { name: 'RAG Architecture & Vector Databases (Pinecone, Chroma)', category: 'Technical', popularity: 93, aliases: ['rag', 'vector db', 'pinecone', 'chroma', 'qdrant'] },
      { name: 'Natural Language Processing (NLP)', category: 'Technical', popularity: 91, aliases: ['nlp', 'transformers', 'spacy', 'bert'] },
      { name: 'Computer Vision (OpenCV, YOLO)', category: 'Technical', popularity: 86, aliases: ['computer vision', 'opencv', 'yolo'] },
      { name: 'MLOps (MLflow, Kubeflow, Weights & Biases)', category: 'Tools & Platforms', popularity: 88, aliases: ['mlflow', 'wandb', 'mlops'] },
      { name: 'Model Evaluation & Hyperparameter Tuning', category: 'Technical', popularity: 89 },
      { name: 'Data Visualization (Matplotlib, Seaborn, Plotly)', category: 'Technical', popularity: 90, aliases: ['plotly', 'seaborn', 'matplotlib'] },
      { name: 'A/B Testing & Statistical Hypothesis Testing', category: 'Technical', popularity: 90, aliases: ['a/b testing', 'statistics'] },
      { name: 'Apache Spark & Big Data (PySpark)', category: 'Tools & Platforms', popularity: 87, aliases: ['spark', 'pyspark', 'databricks'] },
      { name: 'HuggingFace Ecosystem', category: 'Tools & Platforms', popularity: 91, aliases: ['huggingface'] },
    ],
  },
  {
    id: 'data-analyst',
    name: 'Data Analyst & Business Intelligence (BI)',
    description: 'Data transformation, executive dashboards, metric modeling & storytelling',
    keywords: ['data analyst', 'business intelligence', 'bi analyst', 'analytics engineer', 'reporting analyst', 'business analyst'],
    skills: [
      { name: 'Advanced SQL & CTEs', category: 'Languages', popularity: 99, aliases: ['sql', 'postgres', 'mysql', 'window functions'] },
      { name: 'Tableau Desktop & Server', category: 'Tools & Platforms', popularity: 95, aliases: ['tableau'] },
      { name: 'Power BI & DAX Modeling', category: 'Tools & Platforms', popularity: 95, aliases: ['power bi', 'dax', 'powerbi'] },
      { name: 'Advanced Excel & Financial Modeling', category: 'Tools & Platforms', popularity: 94, aliases: ['excel', 'vlookup', 'xlookup', 'pivots', 'macros'] },
      { name: 'Python for Data Analysis (Pandas/Seaborn)', category: 'Languages', popularity: 90, aliases: ['python', 'pandas'] },
      { name: 'Google BigQuery & Snowflake', category: 'Tools & Platforms', popularity: 91, aliases: ['bigquery', 'snowflake', 'data warehouse'] },
      { name: 'dbt (Data Build Tool)', category: 'Tools & Platforms', popularity: 88, aliases: ['dbt'] },
      { name: 'Data Storytelling & Executive Reporting', category: 'Soft Skills', popularity: 92, aliases: ['data storytelling', 'reporting'] },
      { name: 'ETL / ELT Pipeline Architecture', category: 'Technical', popularity: 89, aliases: ['etl', 'elt', 'airflow', 'fivetran'] },
      { name: 'Statistical Analysis & Correlation', category: 'Technical', popularity: 87, aliases: ['statistics'] },
      { name: 'KPI Definition & Metric Frameworks', category: 'Technical', popularity: 92, aliases: ['kpi', 'okr', 'metrics'] },
      { name: 'Google Analytics 4 & Mixpanel', category: 'Tools & Platforms', popularity: 86, aliases: ['ga4', 'mixpanel', 'amplitude'] },
      { name: 'Looker & LookML', category: 'Tools & Platforms', popularity: 85, aliases: ['looker', 'lookml'] },
      { name: 'Cohort & Funnel Analysis', category: 'Technical', popularity: 88 },
      { name: 'Cross-functional Stakeholder Management', category: 'Soft Skills', popularity: 90 },
    ],
  },
  {
    id: 'product-management',
    name: 'Product Manager (PM)',
    description: 'Product strategy, discovery, user empathy, roadmapping & feature delivery',
    keywords: ['product manager', 'technical product manager', 'product lead', 'group product manager', 'director of product', 'pm', 'associate product manager', 'apm'],
    skills: [
      { name: 'Product Strategy & Vision', category: 'Soft Skills', popularity: 98, aliases: ['strategy', 'product strategy'] },
      { name: 'Roadmap Planning & Execution', category: 'Soft Skills', popularity: 97, aliases: ['roadmapping', 'roadmap'] },
      { name: 'Agile & Scrum Frameworks', category: 'Soft Skills', popularity: 95, aliases: ['agile', 'scrum', 'kanban'] },
      { name: 'User Research & Customer Interviews', category: 'Technical', popularity: 92, aliases: ['user research', 'customer discovery'] },
      { name: 'PRD Writing & User Story Definition', category: 'Technical', popularity: 94, aliases: ['prd', 'user stories', 'acceptance criteria'] },
      { name: 'Prioritization Frameworks (RICE / MoSCoW / ICE)', category: 'Technical', popularity: 91, aliases: ['rice', 'moscow', 'prioritization'] },
      { name: 'A/B Testing & Data-Driven Decision Making', category: 'Technical', popularity: 93, aliases: ['a/b testing', 'experimentation', 'hypothesis testing'] },
      { name: 'Go-to-Market Strategy (GTM)', category: 'Soft Skills', popularity: 90, aliases: ['gtm', 'go to market'] },
      { name: 'Jira, Confluence & Linear', category: 'Tools & Platforms', popularity: 93, aliases: ['jira', 'confluence', 'linear'] },
      { name: 'Product Analytics (Amplitude, Mixpanel, Pendo)', category: 'Tools & Platforms', popularity: 91, aliases: ['amplitude', 'mixpanel', 'pendo', 'posthog'] },
      { name: 'Cross-Functional Team Leadership', category: 'Soft Skills', popularity: 96, aliases: ['leadership', 'stakeholder alignment'] },
      { name: 'Wireframing & Prototyping (Figma / Miro)', category: 'Tools & Platforms', popularity: 88, aliases: ['figma', 'miro'] },
      { name: 'Competitive Analysis & Market Sizing', category: 'Technical', popularity: 87 },
      { name: 'SQL for Product Insights', category: 'Languages', popularity: 85, aliases: ['sql'] },
      { name: 'Stakeholder & Executive Communication', category: 'Soft Skills', popularity: 95 },
    ],
  },
  {
    id: 'ui-ux-design',
    name: 'UI/UX & Product Designer',
    description: 'Design systems, interaction design, user research, wireframing & prototyping',
    keywords: ['ui/ux', 'ux designer', 'ui designer', 'product designer', 'ux researcher', 'interaction designer', 'visual designer'],
    skills: [
      { name: 'Figma (Auto Layout, Variants, Components)', category: 'Tools & Platforms', popularity: 99, aliases: ['figma'] },
      { name: 'Design Systems & UI Kit Architecture', category: 'Technical', popularity: 97, aliases: ['design system', 'tokens', 'components'] },
      { name: 'User Research & Usability Testing', category: 'Technical', popularity: 94, aliases: ['user testing', 'usability', 'user interviews'] },
      { name: 'Wireframing & Interactive Prototyping', category: 'Technical', popularity: 96, aliases: ['wireframing', 'prototyping', 'lo-fi', 'hi-fi'] },
      { name: 'Information Architecture & User Flows', category: 'Technical', popularity: 93, aliases: ['ia', 'user flow', 'journey mapping'] },
      { name: 'Responsive Web & Native Mobile Design', category: 'Technical', popularity: 95, aliases: ['mobile design', 'ios design', 'material design'] },
      { name: 'Accessibility (WCAG 2.1 AA/AAA)', category: 'Technical', popularity: 91, aliases: ['a11y', 'wcag', 'color contrast'] },
      { name: 'Micro-interactions & Motion Design', category: 'Technical', popularity: 87, aliases: ['micro-interactions', 'motion', 'framer', 'lottie'] },
      { name: 'Design Handoff & Developer Specs', category: 'Soft Skills', popularity: 92, aliases: ['handoff', 'zeplin'] },
      { name: 'Miro / FigJam Workshops', category: 'Tools & Platforms', popularity: 89, aliases: ['miro', 'figjam'] },
      { name: 'Adobe Creative Suite (Illustrator, Photoshop)', category: 'Tools & Platforms', popularity: 86, aliases: ['photoshop', 'illustrator'] },
      { name: 'Heuristic Evaluation & UX Audits', category: 'Technical', popularity: 88 },
      { name: 'HTML/CSS Basics & Tech Feasibility', category: 'Languages', popularity: 85, aliases: ['html', 'css'] },
      { name: 'Design Thinking Facilitation', category: 'Soft Skills', popularity: 90 },
    ],
  },
  {
    id: 'mobile-dev',
    name: 'Mobile Application Developer (iOS / Android / Cross-Platform)',
    description: 'Native & cross-platform mobile apps, offline sync, performance & App Store publishing',
    keywords: ['mobile developer', 'ios developer', 'android developer', 'react native', 'flutter', 'mobile engineer', 'swift developer', 'kotlin developer'],
    skills: [
      { name: 'React Native & Expo', category: 'Technical', popularity: 95, aliases: ['react native', 'expo'] },
      { name: 'Flutter & Dart', category: 'Technical', popularity: 92, aliases: ['flutter', 'dart'] },
      { name: 'iOS Development (Swift, SwiftUI, UIKit)', category: 'Technical', popularity: 94, aliases: ['swift', 'swiftui', 'uikit', 'xcode'] },
      { name: 'Android Development (Kotlin, Jetpack Compose)', category: 'Technical', popularity: 94, aliases: ['kotlin', 'jetpack compose', 'android studio'] },
      { name: 'TypeScript / JavaScript', category: 'Languages', popularity: 92, aliases: ['typescript', 'javascript'] },
      { name: 'Mobile State Management (Redux, MobX, Provider)', category: 'Technical', popularity: 90, aliases: ['redux', 'bloc', 'provider'] },
      { name: 'App Store & Google Play Deployment CI/CD', category: 'Tools & Platforms', popularity: 92, aliases: ['app store', 'fastlane', 'testflight', 'play store'] },
      { name: 'Push Notifications & Firebase (FCM / APNs)', category: 'Tools & Platforms', popularity: 91, aliases: ['fcm', 'push notifications', 'firebase'] },
      { name: 'Offline Storage & Database (SQLite, Realm, WatermelonDB)', category: 'Tools & Platforms', popularity: 89, aliases: ['sqlite', 'realm', 'room', 'coredata'] },
      { name: 'REST & GraphQL API Integration', category: 'Technical', popularity: 93 },
      { name: 'Mobile UI/UX Best Practices (HIG / Material Design)', category: 'Technical', popularity: 90, aliases: ['material design', 'hig'] },
      { name: 'Performance Profiling & Memory Management', category: 'Technical', popularity: 87 },
      { name: 'Bluetooth / BLE & Geolocation APIs', category: 'Technical', popularity: 82 },
    ],
  },
  {
    id: 'qa-automation',
    name: 'QA & Test Automation Engineer',
    description: 'Test frameworks, end-to-end automation, performance testing & quality assurance',
    keywords: ['qa', 'quality assurance', 'test engineer', 'automation engineer', 'sdet', 'software test engineer', 'test lead'],
    skills: [
      { name: 'Selenium WebDriver', category: 'Tools & Platforms', popularity: 95, aliases: ['selenium'] },
      { name: 'Playwright & Cypress', category: 'Tools & Platforms', popularity: 96, aliases: ['playwright', 'cypress'] },
      { name: 'API Testing (Postman, REST Assured)', category: 'Tools & Platforms', popularity: 94, aliases: ['postman', 'rest assured'] },
      { name: 'JavaScript / TypeScript', category: 'Languages', popularity: 93 },
      { name: 'Python / PyTest', category: 'Languages', popularity: 91, aliases: ['pytest', 'python testing'] },
      { name: 'Java / TestNG / JUnit', category: 'Languages', popularity: 90, aliases: ['junit', 'testng'] },
      { name: 'CI/CD Test Integration (GitHub Actions / Jenkins)', category: 'Tools & Platforms', popularity: 92 },
      { name: 'Performance & Load Testing (JMeter, k6, Gatling)', category: 'Tools & Platforms', popularity: 88, aliases: ['jmeter', 'k6', 'gatling'] },
      { name: 'Behavior-Driven Development (BDD / Cucumber)', category: 'Technical', popularity: 87, aliases: ['cucumber', 'bdd', 'gherkin'] },
      { name: 'Test Strategy & Test Plan Documentation', category: 'Technical', popularity: 93, aliases: ['test plan', 'test cases'] },
      { name: 'Bug Tracking & Triage (Jira / Xray)', category: 'Tools & Platforms', popularity: 91, aliases: ['jira', 'xray', 'testrail'] },
      { name: 'Mobile App Testing (Appium)', category: 'Tools & Platforms', popularity: 85, aliases: ['appium'] },
      { name: 'Regression & Smoke Testing', category: 'Technical', popularity: 94 },
    ],
  },
  {
    id: 'cybersecurity',
    name: 'Cybersecurity & InfoSec Specialist',
    description: 'Vulnerability assessment, cloud security, SIEM, penetration testing & compliance',
    keywords: ['security', 'cybersecurity', 'infosec', 'soc analyst', 'penetration tester', 'security engineer', 'information security', 'ciso'],
    skills: [
      { name: 'Vulnerability Assessment & Penetration Testing', category: 'Technical', popularity: 95, aliases: ['pen testing', 'ethical hacking'] },
      { name: 'SIEM & SOC Operations (Splunk, Sentinel, ELK)', category: 'Tools & Platforms', popularity: 94, aliases: ['splunk', 'siem', 'sentinel'] },
      { name: 'Cloud Security (AWS IAM, GuardDuty, CSPM)', category: 'Tools & Platforms', popularity: 93, aliases: ['cloud security', 'iam'] },
      { name: 'Network Security & Firewalls (Wireshark, Nmap)', category: 'Technical', popularity: 92, aliases: ['wireshark', 'nmap', 'packet analysis'] },
      { name: 'Identity & Access Management (IAM / Okta / Azure AD)', category: 'Tools & Platforms', popularity: 91, aliases: ['okta', 'saml', 'oauth', 'azure ad'] },
      { name: 'Incident Response & Threat Hunting', category: 'Technical', popularity: 92, aliases: ['incident response', 'forensics'] },
      { name: 'OWASP Top 10 & Secure Code Review', category: 'Technical', popularity: 94, aliases: ['owasp', 'appsec', 'sast', 'dast'] },
      { name: 'Compliance Frameworks (SOC2, ISO 27001, GDPR, HIPAA, NIST)', category: 'Technical', popularity: 93, aliases: ['soc2', 'iso 27001', 'nist', 'gdpr'] },
      { name: 'Python / Bash for Security Automation', category: 'Languages', popularity: 89 },
      { name: 'Zero Trust Architecture', category: 'Technical', popularity: 88 },
      { name: 'Cryptography & PKI Infrastructure', category: 'Technical', popularity: 86, aliases: ['pki', 'ssl', 'tls'] },
    ],
  },
  {
    id: 'project-management',
    name: 'Project / Program Manager & Scrum Master',
    description: 'Agile methodologies, sprint execution, resource scheduling & stakeholder leadership',
    keywords: ['project manager', 'program manager', 'scrum master', 'agile coach', 'pmo', 'delivery manager', 'technical program manager', 'tpm'],
    skills: [
      { name: 'Agile & Scrum Delivery', category: 'Soft Skills', popularity: 98, aliases: ['scrum', 'agile'] },
      { name: 'Jira, Confluence & Asana', category: 'Tools & Platforms', popularity: 97, aliases: ['jira', 'confluence', 'asana', 'clickup'] },
      { name: 'Sprint Planning & Backlog Grooming', category: 'Technical', popularity: 95, aliases: ['sprint planning', 'backlog'] },
      { name: 'Risk Management & Mitigation Planning', category: 'Technical', popularity: 93, aliases: ['risk management'] },
      { name: 'Stakeholder Alignment & Executive Reporting', category: 'Soft Skills', popularity: 96 },
      { name: 'Budgeting & Resource Allocation', category: 'Technical', popularity: 91, aliases: ['budgeting', 'forecasting'] },
      { name: 'Timeline Tracking & Critical Path Method (Gantt)', category: 'Technical', popularity: 92, aliases: ['gantt', 'critical path', 'milestones'] },
      { name: 'Kanban & Lean Methodologies', category: 'Technical', popularity: 90, aliases: ['kanban', 'lean'] },
      { name: 'Change Management & Process Optimization', category: 'Soft Skills', popularity: 89 },
      { name: 'PMP / PMI & Prince2 Methodologies', category: 'Technical', popularity: 88, aliases: ['pmp', 'prince2'] },
      { name: 'Cross-Functional Team Leadership', category: 'Soft Skills', popularity: 95 },
      { name: 'Vendor & Contract Management', category: 'Soft Skills', popularity: 86 },
    ],
  },
  {
    id: 'marketing-growth',
    name: 'Marketing, Growth & Digital Strategy',
    description: 'SEO/SEM, content strategy, performance marketing, marketing automation & analytics',
    keywords: ['marketing', 'growth manager', 'growth marketer', 'seo', 'sem', 'digital marketing', 'content marketing', 'performance marketing', 'demand gen'],
    skills: [
      { name: 'Search Engine Optimization (Technical & On-Page SEO)', category: 'Technical', popularity: 96, aliases: ['seo', 'ahrefs', 'semrush'] },
      { name: 'Google Analytics 4 & Data Studio / Looker', category: 'Tools & Platforms', popularity: 95, aliases: ['ga4', 'google analytics', 'looker studio'] },
      { name: 'Google Ads & Paid Search (SEM / PPC)', category: 'Tools & Platforms', popularity: 93, aliases: ['google ads', 'sem', 'ppc'] },
      { name: 'Meta Ads Manager & Paid Social Acquisition', category: 'Tools & Platforms', popularity: 92, aliases: ['facebook ads', 'meta ads', 'linkedin ads'] },
      { name: 'Marketing Automation & Email Campaigns (HubSpot / Klaviyo)', category: 'Tools & Platforms', popularity: 93, aliases: ['hubspot', 'klaviyo', 'mailchimp', 'marketo'] },
      { name: 'Conversion Rate Optimization (CRO & Landing Pages)', category: 'Technical', popularity: 91, aliases: ['cro', 'unbounce', 'vwo'] },
      { name: 'A/B Testing & Funnel Experimentation', category: 'Technical', popularity: 92 },
      { name: 'Content Marketing & Copywriting Strategy', category: 'Soft Skills', popularity: 90, aliases: ['copywriting', 'content strategy'] },
      { name: 'Product-Led Growth (PLG)', category: 'Technical', popularity: 87, aliases: ['plg'] },
      { name: 'Customer Lifecycle & Retention Strategy', category: 'Technical', popularity: 89, aliases: ['retention', 'churn reduction'] },
      { name: 'CRM Management (Salesforce / HubSpot)', category: 'Tools & Platforms', popularity: 90, aliases: ['crm', 'salesforce'] },
    ],
  },
  {
    id: 'finance-accounting',
    name: 'Finance, Investment & Accounting Specialist',
    description: 'Financial modeling, valuation, budgeting, forecasting, reporting & ERP systems',
    keywords: ['finance', 'financial analyst', 'accountant', 'cpa', 'controller', 'investment banking', 'fp&a', 'auditor'],
    skills: [
      { name: 'Financial Modeling & DCF Valuation', category: 'Technical', popularity: 97, aliases: ['financial modeling', 'dcf', 'lbo'] },
      { name: 'Advanced Microsoft Excel (VBA, Power Query, Macros)', category: 'Tools & Platforms', popularity: 98, aliases: ['excel', 'vba', 'power query'] },
      { name: 'Financial Planning & Analysis (FP&A)', category: 'Technical', popularity: 95, aliases: ['fp&a', 'budgeting', 'forecasting'] },
      { name: 'GAAP & IFRS Accounting Standards', category: 'Technical', popularity: 94, aliases: ['gaap', 'ifrs'] },
      { name: 'Variance Analysis & P&L Management', category: 'Technical', popularity: 92, aliases: ['p&l', 'variance analysis'] },
      { name: 'ERP Systems (SAP, NetSuite, Oracle)', category: 'Tools & Platforms', popularity: 91, aliases: ['netsuite', 'sap', 'oracle'] },
      { name: 'SQL for Financial Data Queries', category: 'Languages', popularity: 87, aliases: ['sql'] },
      { name: 'Cash Flow Management & Working Capital', category: 'Technical', popularity: 90 },
      { name: 'Auditing & Internal Controls (SOX Compliance)', category: 'Technical', popularity: 88, aliases: ['sox', 'audit'] },
      { name: 'QuickBooks & Xero', category: 'Tools & Platforms', popularity: 86, aliases: ['quickbooks', 'xero'] },
      { name: 'Executive Presentation & Financial Storytelling', category: 'Soft Skills', popularity: 92 },
    ],
  },
  {
    id: 'sales-business',
    name: 'Sales & Business Development Executive',
    description: 'B2B enterprise sales, account management, pipeline growth & contract negotiation',
    keywords: ['sales', 'account executive', 'business development', 'bdr', 'sdr', 'sales manager', 'account manager', 'sales director'],
    skills: [
      { name: 'Enterprise B2B Solution Selling', category: 'Soft Skills', popularity: 97, aliases: ['enterprise sales', 'b2b sales'] },
      { name: 'Salesforce CRM & Pipeline Management', category: 'Tools & Platforms', popularity: 96, aliases: ['salesforce', 'crm'] },
      { name: 'Sales Prospecting & Outbound Lead Generation', category: 'Technical', popularity: 93, aliases: ['prospecting', 'lead generation', 'cold outreach'] },
      { name: 'Contract Negotiation & Deal Closing', category: 'Soft Skills', popularity: 95, aliases: ['negotiation', 'closing'] },
      { name: 'Sales Enablement Tools (Apollo, ZoomInfo, Outreach)', category: 'Tools & Platforms', popularity: 91, aliases: ['zoominfo', 'outreach', 'salesloft', 'apollo'] },
      { name: 'Discovery Calls & Value Proposition Pitching', category: 'Soft Skills', popularity: 94 },
      { name: 'MEDDIC / BANT Qualification Frameworks', category: 'Technical', popularity: 90, aliases: ['meddic', 'bant'] },
      { name: 'Key Account Management & Retention (Upsell/Cross-sell)', category: 'Soft Skills', popularity: 92, aliases: ['account management', 'upselling'] },
      { name: 'Revenue Forecasting & Quota Achievement', category: 'Technical', popularity: 93 },
      { name: 'Client Relationship Management', category: 'Soft Skills', popularity: 95 },
    ],
  },
  {
    id: 'hr-recruiting',
    name: 'Human Resources & Talent Acquisition',
    description: 'Technical recruiting, talent sourcing, employee engagement, HR compliance & onboarding',
    keywords: ['hr', 'human resources', 'recruiter', 'talent acquisition', 'people operations', 'people partner', 'hr business partner', 'hrbp'],
    skills: [
      { name: 'Technical & Executive Talent Sourcing', category: 'Technical', popularity: 97, aliases: ['sourcing', 'talent acquisition', 'headhunting'] },
      { name: 'Applicant Tracking Systems (Greenhouse, Lever, Workday)', category: 'Tools & Platforms', popularity: 96, aliases: ['greenhouse', 'lever', 'workday', 'ats'] },
      { name: 'LinkedIn Recruiter & Boolean Search', category: 'Tools & Platforms', popularity: 95, aliases: ['linkedin recruiter', 'boolean search'] },
      { name: 'Candidate Interviewing & Structured Evaluations', category: 'Soft Skills', popularity: 94, aliases: ['interviewing', 'behavioral interviewing'] },
      { name: 'Employee Onboarding & Retention Programs', category: 'Technical', popularity: 92, aliases: ['onboarding'] },
      { name: 'HR Policies & Employment Labor Law Compliance', category: 'Technical', popularity: 91, aliases: ['hr compliance', 'labor law'] },
      { name: 'Performance Management & OKRs', category: 'Soft Skills', popularity: 90, aliases: ['performance management'] },
      { name: 'Compensation & Benefits Benchmarking', category: 'Technical', popularity: 88, aliases: ['compensation', 'benefits'] },
      { name: 'Diversity, Equity & Inclusion (DEI) Initiatives', category: 'Soft Skills', popularity: 89, aliases: ['dei'] },
      { name: 'HR Information Systems (BambooHR, Rippling, Gusto)', category: 'Tools & Platforms', popularity: 90, aliases: ['bamboohr', 'rippling', 'gusto'] },
    ],
  },
];

/**
 * Detect the most applicable RoleSkillProfile based on user title and work experiences.
 */
export function detectRoleProfile(
  title?: string,
  experienceRoles: string[] = []
): RoleSkillProfile {
  const combinedText = [
    title || '',
    ...experienceRoles,
  ]
    .join(' ')
    .toLowerCase();

  if (!combinedText.trim()) {
    return ROLE_SKILL_PROFILES[0]; // Full-stack default
  }

  let bestMatch: RoleSkillProfile = ROLE_SKILL_PROFILES[0];
  let highestScore = 0;

  for (const profile of ROLE_SKILL_PROFILES) {
    let score = 0;
    for (const keyword of profile.keywords) {
      if (combinedText.includes(keyword)) {
        score += keyword.length * 2; // longer match = higher weight
      }
    }
    // Also check skill mentions
    for (const skill of profile.skills.slice(0, 8)) {
      if (combinedText.includes(skill.name.toLowerCase())) {
        score += 3;
      }
    }

    if (score > highestScore) {
      highestScore = score;
      bestMatch = profile;
    }
  }

  return bestMatch;
}

/**
 * Retrieve skill auto-suggestions filtered and ranked by user keystrokes & role context.
 */
export function getSkillAutoSuggestions({
  query = '',
  roleProfileId,
  existingSkillNames = [],
  limit = 8,
}: {
  query?: string;
  roleProfileId?: string;
  existingSkillNames?: string[];
  limit?: number;
}): RoleSkill[] {
  const cleanQuery = query.trim().toLowerCase();
  const existingSet = new Set(existingSkillNames.map((s) => s.trim().toLowerCase()));

  // Active or selected profile
  const activeProfile =
    ROLE_SKILL_PROFILES.find((p) => p.id === roleProfileId) || ROLE_SKILL_PROFILES[0];

  // Collect all skills across profiles (deduplicated by name)
  const allSkillsMap = new Map<string, RoleSkill>();

  // Prioritize active role skills
  activeProfile.skills.forEach((s) => {
    allSkillsMap.set(s.name.toLowerCase(), { ...s, popularity: (s.popularity || 80) + 15 });
  });

  // Add all other roles skills
  ROLE_SKILL_PROFILES.forEach((profile) => {
    if (profile.id !== activeProfile.id) {
      profile.skills.forEach((s) => {
        const key = s.name.toLowerCase();
        if (!allSkillsMap.has(key)) {
          allSkillsMap.set(key, s);
        }
      });
    }
  });

  const pool = Array.from(allSkillsMap.values()).filter(
    (s) => !existingSet.has(s.name.toLowerCase())
  );

  // If query is empty, return top popular skills for this role
  if (!cleanQuery) {
    return pool.sort((a, b) => (b.popularity || 50) - (a.popularity || 50)).slice(0, limit);
  }

  // Calculate matching scores
  const scored = pool
    .map((skill) => {
      const lowerName = skill.name.toLowerCase();
      let matchScore = 0;

      if (lowerName === cleanQuery) {
        matchScore = 200;
      } else if (lowerName.startsWith(cleanQuery)) {
        matchScore = 120 - lowerName.indexOf(cleanQuery);
      } else if (lowerName.includes(cleanQuery)) {
        matchScore = 80 - lowerName.indexOf(cleanQuery);
      } else if (
        skill.aliases?.some(
          (alias) => alias.toLowerCase() === cleanQuery || alias.toLowerCase().startsWith(cleanQuery)
        )
      ) {
        matchScore = 100;
      }

      // Add popularity bonus
      if (matchScore > 0) {
        matchScore += (skill.popularity || 50) * 0.2;
      }

      return { skill, score: matchScore };
    })
    .filter((item) => item.score > 0)
    .sort((a, b) => b.score - a.score);

  return scored.map((item) => item.skill).slice(0, limit);
}
