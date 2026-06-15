export type Instructor = {
  name: string;
  title: string;
  company: string;
  initials: string;
  bio: string;
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
    name: 'Aisha Patel',
    title: 'Senior Data Analyst',
    company: 'Microsoft',
    initials: 'AP',
    bio: '10+ years building enterprise Power BI dashboards at Microsoft and Fortune 500 companies. Certified Microsoft Power BI expert who has trained over 3,000 analysts globally.',
  },
  {
    name: 'Marcus Williams',
    title: 'BI Architect',
    company: 'Deloitte',
    initials: 'MW',
    bio: 'Led data transformation projects across finance, healthcare, and retail at Deloitte. Specializes in DAX optimization, data modeling, and scalable reporting pipelines.',
  },
  {
    name: 'Priya Nair',
    title: 'Analytics Manager',
    company: 'Amazon',
    initials: 'PN',
    bio: 'Built Amazon\'s internal analytics training program. Passionate about making data accessible to non-technical stakeholders through visual storytelling.',
  },
];

const sharedTestimonials: Testimonial[] = [
  {
    quote: 'This fellowship transformed how I think about data. I went from making basic bar charts to building executive dashboards used by our C-suite.',
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
    quote: 'I had zero Power BI experience. Eight weeks later I had a portfolio of 5 production-quality dashboards and a job offer.',
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
    question: 'What is the refund policy?',
    answer:
      'We offer a full refund within 7 days of the cohort start date, no questions asked. After that, you can transfer to the next cohort.',
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
    desc: 'Analysts who rely on Excel and want to level up to enterprise-grade BI dashboards and automation.',
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
  'Build production-ready Power BI dashboards from scratch',
  'Master DAX formulas and calculated measures',
  'Design star-schema data models for performance',
  'Connect and transform data with Power Query (M language)',
  'Create real-time reports with DirectQuery and incremental refresh',
  'Apply advanced visual storytelling and UX principles',
  'Publish, share, and manage reports in Power BI Service',
  'Present insights to executive stakeholders with confidence',
];

const sharedCurriculum: Module[] = [
  {
    week: 'Week 1',
    title: 'Power BI Fundamentals',
    topics: [
      'Navigating the Power BI ecosystem',
      'Connecting to Excel, CSV, and SQL sources',
      'Building your first interactive report',
      'Publishing to Power BI Service',
    ],
  },
  {
    week: 'Week 2',
    title: 'Data Modeling & Relationships',
    topics: [
      'Star schema vs. flat file design',
      'Defining table relationships',
      'Creating date tables and time intelligence',
      'Best practices for scalable models',
    ],
  },
  {
    week: 'Week 3',
    title: 'Power Query & Data Transformation',
    topics: [
      'ETL fundamentals in Power Query',
      'Cleaning and reshaping messy data',
      'Merging and appending queries',
      'M language basics for custom transforms',
    ],
  },
  {
    week: 'Week 4',
    title: 'DAX Deep Dive',
    topics: [
      'Calculated columns vs. measures',
      'CALCULATE, FILTER, and context transition',
      'Time intelligence: YTD, MoM, rolling averages',
      'Advanced DAX patterns used in production',
    ],
  },
  {
    week: 'Week 5',
    title: 'Advanced Visualizations',
    topics: [
      'Choosing the right chart for the story',
      'Custom visuals and AppSource marketplace',
      'Conditional formatting and dynamic titles',
      'Drill-through, tooltips, and bookmarks',
    ],
  },
  {
    week: 'Week 6',
    title: 'Power BI Service & Administration',
    topics: [
      'Workspaces, apps, and sharing permissions',
      'Scheduled refresh and gateway setup',
      'Row-level security (RLS)',
      'Monitoring usage and performance',
    ],
  },
  {
    week: 'Week 7',
    title: 'Real-World Capstone Project',
    topics: [
      'End-to-end dashboard from raw data',
      'Industry dataset: finance, retail, or HR track',
      'Peer review and instructor feedback',
      'Portfolio presentation prep',
    ],
  },
  {
    week: 'Week 8',
    title: 'Career Launch & Certification',
    topics: [
      'Demo Day: live portfolio presentations',
      'Resume and LinkedIn profile review',
      'Interview prep: data case studies',
      'Fellowship certificate & next steps',
    ],
  },
];

export const fellowships: Fellowship[] = [
  {
    slug: 'power-bi-data-analyst-fellowship',
    name: 'Power BI Data Analyst Fellowship',
    tagline: 'Go from zero to job-ready Power BI analyst in 8 weeks.',
    description:
      'A live, cohort-based fellowship designed to take you from data novice to confident Power BI analyst. Work on real industry datasets, get weekly instructor feedback, and graduate with a portfolio that gets you hired.',
    badge: 'Most Popular',
    format: 'Live Online',
    duration: '8 Weeks',
    startDate: 'Rolling Cohorts',
    level: 'Beginner – Intermediate',
    price: '$1,297',
    originalPrice: '$1,897',
    enrollmentDeadline: 'Limited seats per cohort',
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
    name: 'Cohort Washington',
    tagline: 'Power BI Data Analyst Fellowship — Summer 2025 cohort.',
    description:
      'Cohort Washington is our July intake of the Power BI Data Analyst Fellowship. Join a tight-knit group of 30 analysts, get live instruction twice a week, and build a portfolio of real dashboards by August.',
    badge: 'Starts July 4',
    format: 'Live Online',
    duration: '8 Weeks',
    startDate: 'July 4, 2025',
    level: 'Beginner – Intermediate',
    price: '$1,297',
    originalPrice: '$1,897',
    enrollmentDeadline: 'June 27, 2025',
    showPrice: false,
    totalLearners: '30 seats',
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
    tagline: 'Power BI Data Analyst Fellowship — Fall 2025 cohort.',
    description:
      'Cohort Lincoln is our September intake of the Power BI Data Analyst Fellowship. A focused cohort of 30 learners working through the full curriculum together, with dedicated office hours and peer accountability.',
    badge: 'Starts Sep 5',
    format: 'Live Online',
    duration: '8 Weeks',
    startDate: 'September 5, 2025',
    level: 'Beginner – Intermediate',
    price: '$1,297',
    originalPrice: '$1,897',
    enrollmentDeadline: 'August 29, 2025',
    showPrice: false,
    totalLearners: '30 seats',
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
