import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const courses  = [
  'Power BI Data Analyst Fellowship',
  'Cohort Washington',
  'Cohort Lincoln',
];
const trainers = ['Sarah Johnson', 'Michael Chen', 'Priya Patel', 'David Williams', null];
const statuses = ['PENDING', 'PENDING', 'PENDING', 'APPROVED', 'APPROVED', 'REJECTED'];

const students = [
  { first: 'Emily',   last: 'Carter',    email: 'emily.carter@gmail.com',    linkedin: 'emily-carter-data',    zip: '10001' },
  { first: 'James',   last: 'Thompson',  email: 'james.thompson@outlook.com', linkedin: 'james-thompson-bi',    zip: '30301' },
  { first: 'Sophia',  last: 'Martinez',  email: 'sophia.m@yahoo.com',         linkedin: 'sophiamartinez',       zip: '77001' },
  { first: 'Liam',    last: 'Anderson',  email: 'liam.anderson@gmail.com',    linkedin: 'liam-anderson-dev',    zip: '60601' },
  { first: 'Olivia',  last: 'Wilson',    email: 'olivia.wilson@hotmail.com',  linkedin: 'olivia-wilson-analyst',zip: '98101' },
  { first: 'Noah',    last: 'Jackson',   email: 'noah.jackson@gmail.com',     linkedin: 'noahjackson',          zip: '85001' },
  { first: 'Ava',     last: 'White',     email: 'ava.white@gmail.com',        linkedin: 'ava-white-data',       zip: '19101' },
  { first: 'William', last: 'Harris',    email: 'william.harris@outlook.com', linkedin: 'william-harris',       zip: '48201' },
  { first: 'Isabella',last: 'Lewis',     email: 'isabella.lewis@gmail.com',   linkedin: 'isabella-lewis-bi',    zip: '32801' },
  { first: 'Mason',   last: 'Clark',     email: 'mason.clark@yahoo.com',      linkedin: 'masonclark',           zip: '80201' },
  { first: 'Mia',     last: 'Robinson',  email: 'mia.robinson@gmail.com',     linkedin: 'mia-robinson-analyst', zip: '94101' },
  { first: 'Ethan',   last: 'Walker',    email: 'ethan.walker@hotmail.com',   linkedin: 'ethan-walker-data',    zip: '45201' },
  { first: 'Charlotte',last: 'Hall',     email: 'charlotte.hall@gmail.com',   linkedin: 'charlottehall',        zip: '55401' },
  { first: 'Oliver',  last: 'Young',     email: 'oliver.young@outlook.com',   linkedin: 'oliver-young-bi',      zip: '64101' },
  { first: 'Amelia',  last: 'Allen',     email: 'amelia.allen@gmail.com',     linkedin: 'amelia-allen-data',    zip: '73101' },
  { first: 'Aiden',   last: 'Scott',     email: 'aiden.scott@gmail.com',      linkedin: 'aiden-scott-analyst',  zip: '46201' },
  { first: 'Harper',  last: 'Green',     email: 'harper.green@yahoo.com',     linkedin: 'harpergreen',          zip: '37201' },
  { first: 'Lucas',   last: 'Adams',     email: 'lucas.adams@gmail.com',      linkedin: 'lucas-adams-bi',       zip: '70801' },
  { first: 'Evelyn',  last: 'Baker',     email: 'evelyn.baker@outlook.com',   linkedin: 'evelyn-baker-data',    zip: '35201' },
  { first: 'Logan',   last: 'Nelson',    email: 'logan.nelson@gmail.com',     linkedin: 'logan-nelson-analyst', zip: '66601' },
  { first: 'Abigail', last: 'Mitchell',  email: 'abigail.mitchell@gmail.com', linkedin: 'abigailmitchell',      zip: '97201' },
  { first: 'Jackson', last: 'Carter',    email: 'jackson.carter@hotmail.com', linkedin: 'jackson-carter-bi',    zip: '84101' },
  { first: 'Ella',    last: 'Perez',     email: 'ella.perez@gmail.com',       linkedin: 'ella-perez-data',      zip: '85701' },
  { first: 'Sebastian',last: 'Roberts',  email: 'sebastian.roberts@outlook.com','linkedin': 'sebastianroberts', zip: '78201' },
  { first: 'Scarlett', last: 'Turner',   email: 'scarlett.turner@gmail.com',  linkedin: 'scarlett-turner-bi',   zip: '89101' },
];

function randomItem(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

function randomDate(daysAgo) {
  const d = new Date();
  d.setDate(d.getDate() - Math.floor(Math.random() * daysAgo));
  return d;
}

const records = students.map((s, i) => ({
  firstName:           s.first,
  lastName:            s.last,
  email:               s.email,
  zipcode:             s.zip,
  linkedinName:        s.linkedin,
  courseApplied:       randomItem(courses),
  trainer:             randomItem(trainers),
  status:              randomItem(statuses),
  resumeFileName:      `${s.first.toLowerCase()}_${s.last.toLowerCase()}_resume.pdf`,
  resumeFileType:      'application/pdf',
  resumeFileSizeBytes: 100000 + i * 12345,
  createdAt:           randomDate(90),
}));

const result = await prisma.studentApplication.createMany({ data: records });
console.log(`✅ Inserted ${result.count} student applications`);
await prisma.$disconnect();
