export type Instructor = {
  name: string;
  role?: string;
  title: string;
  company: string;
  initials: string;
  bio: string;
  linkedin?: string;
};

export type Module = {
  week: string;
  title: string;
  topics: string[];
};

export type Testimonial = {
  quote: string;
  name: string;
  role: string;
  company: string;
  initials: string;
  outcome: string;
};

export type Faq = {
  question: string;
  answer: string;
};

export type Fellowship = {
  slug: string;
  name: string;
  tagline: string;
  description: string;
  badge: string;
  format: string;
  duration: string;
  startDate: string;
  level: string;
  price: string;
  originalPrice: string;
  enrollmentDeadline: string;
  showPrice?: boolean;
  totalLearners: string;
  rating: string;
  completionRate: string;
  outcomes: string[];
  whoIsThisFor: { title: string; desc: string }[];
  curriculum: Module[];
  instructors: Instructor[];
  testimonials: Testimonial[];
  faqs: Faq[];
  hiringPartners: string[];
};

const sharedInstructors: Instructor[] = [
  {
    name: 'Ranjana Chowdaiah',
    role: 'Lead Trainer',
    title: 'Business Intelligence & Analytics Consultant',
    company: 'Xerox',
    initials: 'RC',
    bio: 'Lead Trainer at RiseWithData. Business Intelligence and Analytics Consultant at Xerox with deep expertise in Power BI, data modeling, and enterprise reporting. Brings real-world BI project experience to every session.',
    linkedin: 'https://www.linkedin.com/in/ranjana-b-8b109027/',
  },
  {
    name: 'Lokesh Penugonda',
    role: 'Support Trainer',
    title: 'Senior Business Intelligence Analyst',
    company: 'RiseWithData',
    initials: 'LP',
    bio: 'Support Trainer at RiseWithData. Senior Business Intelligence Analyst with hands-on experience building scalable Power BI solutions. Dedicated to helping students turn data into clear, actionable insights.',
  },
];

const sharedTestimonials: Testimonial[] = [
  {
    quote: 'This fellowship transformed how I think about data. I went from making basic bar charts to building executive reports used by our C-suite.',
    name: 'Jordan Kim',
    role: 'Data Analyst',
    company: 'Google',
    initials: 'JK',
    outcome: 'Promoted within 3 months',
  },
  {
    quote: 'The live cohort format was a game changer. Real feedback, real projects, and instructors who have actually done this work.',
    name: 'Sofia Reyes',
    role: 'Business Intelligence Analyst',
    company: 'Nike',
    initials: 'SR',
    outcome: '42% salary increase',
  },
  {
    quote: 'I had zero Power BI experience. Eight weeks later I had a portfolio of 5 production-quality reports and a job offer.',
    name: 'Darius Thompson',
    role: 'Junior Data Analyst → Senior Analyst',
    company: 'Accenture',
    initials: 'DT',
    outcome: 'Hired in under 60 days',
  },
];

const sharedFaqs: Faq[] = [
  {
    question: 'Do I need prior data experience to join?',
    answer:
      'Basic Excel or spreadsheet experience is helpful but not required. The fellowship starts from foundational concepts and progressively builds toward advanced analytics.',
  },
  {
    question: 'How many hours per week does this require?',
    answer:
      'Plan for 8–10 hours per week: 2 live sessions (2 hours each), plus hands-on project work. Sessions are recorded if you miss one.',
  },
  {
    question: 'What tools and software will I need?',
    answer:
      'Power BI Desktop (free), a Microsoft 365 account (free tier works), and access to the provided datasets. All setup is covered in Week 1.',
  },
  {
    question: 'Is there a certificate upon completion?',
    answer:
      'Yes. You receive a verified RiseWithData Fellowship Certificate and a shareable portfolio link showcasing your real-world projects.',
  },
  {
    question: 'Will this help me get a job?',
    answer:
      '87% of our graduates report a promotion or new role within 6 months. We include career coaching, resume review, and LinkedIn optimization.',
  },
];

const sharedHiringPartners = [
  'Microsoft', 'Google', 'Amazon', 'Deloitte', 'PwC', 'KPMG',
  'Accenture', 'IBM', 'Nike', 'JPMorgan',
];

const sharedWhoIsThisFor = [
  {
    title: 'Career Switchers',
    desc: 'Professionals moving into data & analytics from other fields who need job-ready Power BI skills quickly.',
  },
  {
    title: 'Excel Power Users',
    desc: 'Analysts who rely on Excel and want to level up to enterprise-grade BI reports and automation.',
  },
  {
    title: 'BI Beginners',
    desc: 'Recent graduates or early-career professionals building their first analytics portfolio.',
  },
  {
    title: 'Business Analysts',
    desc: 'BAs who want to add self-service data visualization to their skill set and drive faster decisions.',
  },
];

const sharedOutcomes = [
  'Clean and prepare messy data with Power Query',
  'Build star-schema models and DAX measures that calculate KPIs correctly',
  'Design and publish business dashboards for HR, marketing, and retail',
  'Ingest data into a Fabric Lakehouse and Warehouse, and clean it with notebooks',
  'Apply medallion architecture with Bronze, Silver, and Gold layers',
  'Build end-to-end Fabric projects with pipelines, notebooks, and a semantic model',
  'Learn from five senior industry professionals and get their feedback',
  'Present six real projects on a portfolio website, backed by a reviewed resume',
];

const sharedCurriculum: Module[] = [
  {
    week: 'Week 1',
    title: 'Core BI Concepts & Power BI Fundamentals',
    topics: [
      'What BI is and how data becomes insight',
      'Power BI Desktop vs. Service; Report, Table, and Model views',
      'Connecting to Excel, CSV, web, and databases (Import vs. DirectQuery)',
      'Core visuals, filters, and slicers',
      'Outcome: you can build reports in Power BI',
    ],
  },
  {
    week: 'Week 2',
    title: 'Power Query: Cleaning & Shaping Data',
    topics: [
      'Fixing data types, removing duplicates and errors',
      'Splitting and merging columns, filtering rows',
      'Pivot and unpivot, append and merge queries',
      'Applied steps for repeatable transformations',
      'Outcome: a clean, analysis-ready dataset',
    ],
  },
  {
    week: 'Week 3',
    title: 'Data Modeling: Star Schema & Relationships',
    topics: [
      'Fact and dimension tables, star schema',
      'Primary and foreign keys',
      'Relationships: cardinality and filter direction',
      'Building a date table and organizing the model for speed and accuracy',
      'Outcome: a star-schema model with a date table',
    ],
  },
  {
    week: 'Week 4',
    title: 'DAX Essentials & Dashboard Design',
    topics: [
      'DAX measures: SUM, CALCULATE, IF, filter context',
      'Basic time intelligence to build KPIs',
      'Choosing visuals, drill-through, and tooltips',
      'Layout and color principles, publishing to Power BI Service',
      'Outcome: a KPI dashboard published to Power BI Service',
    ],
  },
  {
    week: 'Week 5',
    title: 'Project 1: HR & People Analytics',
    topics: [
      'Workforce metrics: headcount, attrition, hiring, and tenure',
      'Cleaning, modeling, and DAX applied end to end',
      'Answering the questions HR leaders ask',
      'Outcome: an HR dashboard for your portfolio',
    ],
  },
  {
    week: 'Week 6',
    title: 'Project 2: Marketing Analytics',
    topics: [
      'Campaign performance across channels',
      'Spend, conversions, cost per acquisition, and ROI',
      'Showing which campaigns and audiences are worth the budget',
      'Outcome: a marketing performance dashboard',
    ],
  },
  {
    week: 'Week 7',
    title: 'Project 3: Retail & Sales Analytics',
    topics: [
      'Sales, products, stores, and customers',
      'Revenue trends, best and worst sellers, basket behavior, seasonality',
      'Time intelligence to compare periods and spot growth',
      'Outcome: a retail sales dashboard',
    ],
  },
  {
    week: 'Week 8',
    title: 'Fabric Core Concepts: OneLake, Lakehouse & the Bronze Layer',
    topics: [
      'What Microsoft Fabric is: OneLake, workspaces, and the lakehouse',
      'Ingesting files and databases with Data Factory pipelines and Dataflows Gen2',
      'Landing raw data in the Bronze layer as Delta tables',
      'Outcome: a lakehouse with raw data landed in Bronze',
    ],
  },
  {
    week: 'Week 9',
    title: 'Medallion Architecture: Silver & Gold with Notebooks',
    topics: [
      'Fabric notebooks with PySpark and SQL',
      'Cleaning and validating data into the Silver layer',
      'Modeling business-ready Gold tables',
      'Scheduled pipelines to automate the flow',
      'Outcome: an automated Bronze-to-Silver-to-Gold pipeline',
    ],
  },
  {
    week: 'Week 10',
    title: 'End-to-End Solution & Portfolio Launch',
    topics: [
      'The full medallion pipeline: Bronze to Silver to Gold',
      'Fabric Warehouse, semantic model, and a Power BI report on top',
      'Turning all six projects into a portfolio website with case studies',
      'Outcome: a complete Fabric solution and your portfolio website',
    ],
  },
];

export const fellowships: Fellowship[] = [
  {
    slug: 'power-bi-data-analyst-fellowship',
    name: 'Data Analyst Fellowship',
    tagline: '',
    description:
      'A live, cohort-based fellowship designed to take you from data novice to confident data analyst. Work on real industry datasets, get weekly instructor feedback, and graduate with a portfolio that gets you hired.',
    badge: 'Most Popular',
    format: 'Live Online',
    duration: '10 weeks',
    startDate: 'Rolling Cohorts',
    level: '10:00 – 11:15 AM ET, Saturdays & Sundays',
    price: '$1,297',
    originalPrice: '$1,897',
    enrollmentDeadline: '20 seats per cohort',
    showPrice: false,
    totalLearners: '3,400+',
    rating: '4.9',
    completionRate: '91%',
    outcomes: sharedOutcomes,
    whoIsThisFor: sharedWhoIsThisFor,
    curriculum: sharedCurriculum,
    instructors: sharedInstructors,
    testimonials: sharedTestimonials,
    faqs: sharedFaqs,
    hiringPartners: sharedHiringPartners,
  },
  {
    slug: 'cohort-washington',
    name: 'November Cohort',
    tagline: 'Data Analyst Fellowship — November 2026 cohort.',
    description:
      'November Cohort is our November intake of the Data Analyst Fellowship. Join a tight-knit group of 20 students, get live instruction twice a week, and build a portfolio of real projects.',
    badge: 'Starts November 28st',
    format: 'Live Online',
    duration: '10 weeks',
    startDate: 'November 28, 2026',
    level: '10:00 – 11:15 AM ET, Saturdays & Sundays',
    price: '$1,297',
    originalPrice: '$1,897',
    enrollmentDeadline: 'July 27, 2026',
    showPrice: false,
    totalLearners: '20 seats',
    rating: '4.9',
    completionRate: '91%',
    outcomes: sharedOutcomes,
    whoIsThisFor: sharedWhoIsThisFor,
    curriculum: sharedCurriculum,
    instructors: sharedInstructors,
    testimonials: sharedTestimonials,
    faqs: sharedFaqs,
    hiringPartners: sharedHiringPartners,
  },
  {
    slug: 'cohort-lincoln',
    name: 'Cohort Lincoln',
    tagline: 'Data Analyst Fellowship — Fall 2026 cohort.',
    description:
      'Cohort Lincoln is our September intake of the Data Analyst Fellowship. A focused cohort of 30 learners working through the full curriculum together, with dedicated office hours and peer accountability.',
    badge: 'Starts Sep 5',
    format: 'Live Online',
    duration: '10 weeks',
    startDate: 'September 5, 2026',
    level: 'Beginner – Intermediate',
    price: '$1,297',
    originalPrice: '$1,897',
    enrollmentDeadline: 'October 29, 2026',
    showPrice: false,
    totalLearners: '20 seats',
    rating: '4.9',
    completionRate: '91%',
    outcomes: sharedOutcomes,
    whoIsThisFor: sharedWhoIsThisFor,
    curriculum: sharedCurriculum,
    instructors: sharedInstructors,
    testimonials: sharedTestimonials,
    faqs: sharedFaqs,
    hiringPartners: sharedHiringPartners,
  },
];

export function getFellowshipBySlug(slug: string): Fellowship | undefined {
  return fellowships.find((f) => f.slug === slug);
}
