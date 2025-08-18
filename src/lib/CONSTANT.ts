import client1 from '../../public/client1.png';
import client2 from '../../public/client2.png';
import client3 from '../../public/client3.png';
import client4 from '../../public/client4.png';
import client5 from '../../public/client5.png';

export const CLIENTS = [
  { alt: 'client1', logo: client1 },
  { alt: 'client2', logo: client2 },
  { alt: 'client3', logo: client3 },
  { alt: 'client4', logo: client4 },
  { alt: 'client5', logo: client5 },
];

export const USERS = [
  {
    name: 'Sarah Chen',
    message:
      'Arcane transformed our startup workflow completely. Having all our docs, tasks, and team communication in one place increased our productivity by 300%. Best investment we made this year.',
    role: 'Startup Founder',
    company: 'TechFlow'
  },
  {
    name: 'Marcus Rodriguez',
    message:
      "Finally, a workspace that doesn't make me switch between 10 different apps. Arcane's seamless integration between notes, databases, and project management is incredible.",
    role: 'Product Manager',
    company: 'InnovateCorp'
  },
  {
    name: 'Emily Thompson',
    message:
      "As a freelancer, I needed something that could handle client projects, invoicing, and creative work. Arcane does it all without breaking the bank. Game changer!",
    role: 'Creative Director',
    company: 'Freelancer'
  },
  {
    name: 'David Kim',
    message:
      'Our remote team of 50+ people collaborates seamlessly on Arcane. Real-time editing, version control, and project tracking have never been this smooth.',
    role: 'Engineering Lead',
    company: 'CloudScale'
  },
  {
    name: 'Jessica Park',
    message:
      "I've tried Notion, Slack, Asana - you name it. Arcane combines the best of all worlds with a beautiful, intuitive interface that my whole team actually wants to use.",
    role: 'Operations Director',
    company: 'GrowthLab'
  },
  {
    name: 'Ahmed Hassan',
    message:
      "The AI-powered content suggestions and automated workflows saved our team 20+ hours per week. Arcane pays for itself in productivity gains.",
    role: 'Digital Marketing Manager',
    company: 'BrandForge'
  },
  {
    name: 'Lisa Wang',
    message:
      'Migrating from our old toolstack to Arcane was seamless. The import tools worked flawlessly, and now our data is actually organized and searchable.',
    role: 'Data Analyst',
    company: 'InsightCo'
  },
  {
    name: 'Robert Johnson',
    message:
      "Educational content creation has never been easier. Arcane's collaboration features help our distributed team create courses that engage thousands of students.",
    role: 'Education Director',
    company: 'LearnHub'
  },
  {
    name: 'Priya Sharma',
    message:
      "The customizable templates and workflow automations fit perfectly into our agency's client management process. Our clients love the transparency too.",
    role: 'Agency Owner',
    company: 'Creative Solutions'
  },
  {
    name: 'Tom Mitchell',
    message:
      "As a developer, I appreciate Arcane's API and integration capabilities. It connects with our entire tech stack while keeping everything user-friendly for non-tech team members.",
    role: 'Software Architect',
    company: 'DevOps Pro'
  },
];

export const PRICING_CARDS = [
  {
    planType: 'Free Plan',
    price: '0',
    description: 'Perfect for personal use and small teams',
    highlightFeature: 'Get started for free',
    freatures: [
      'Up to 3 workspaces',
      '1GB file storage',
      'Basic templates library',
      'Real-time collaboration',
      'Mobile app access',
      'Community support',
    ],
  },
  {
    planType: 'Pro Plan',
    price: '12',
    description: 'Billed annually. $15 billed monthly',
    highlightFeature: 'Everything in Free +',
    freatures: [
      'Unlimited workspaces',
      '100GB file storage',
      'Advanced AI assistance',
      'Custom templates',
      'Advanced integrations',
      'Priority support',
      'Version history',
      'Team analytics',
    ],
  },
  {
    planType: 'Enterprise',
    price: '25',
    description: 'Custom pricing for large teams',
    highlightFeature: 'Everything in Pro +',
    freatures: [
      'Unlimited storage',
      'Advanced security (SSO, SAML)',
      'Custom integrations',
      'Dedicated success manager',
      'SLA guarantees',
      'Advanced admin controls',
      'Audit logs',
      'White-label options',
    ],
  },
];

export const PRICING_PLANS = { 
  proplan: 'Pro Plan', 
  freeplan: 'Free Plan',
  enterprise: 'Enterprise'
};

export const MAX_FOLDERS_FREE_PLAN = 3;

export const FEATURES = [
  {
    title: 'AI-Powered Content',
    description: 'Smart suggestions, auto-completion, and content generation to boost your productivity.',
    icon: '🤖'
  },
  {
    title: 'Real-time Collaboration',
    description: 'Work together seamlessly with live editing, comments, and instant synchronization.',
    icon: '👥'
  },
  {
    title: 'All-in-One Workspace',
    description: 'Notes, tasks, databases, calendars, and whiteboards - everything in one place.',
    icon: '🚀'
  },
  {
    title: 'Advanced Integrations', 
    description: 'Connect with your favorite tools like Slack, GitHub, Google Drive, and 100+ more.',
    icon: '🔗'
  },
  {
    title: 'Powerful Search',
    description: 'Find anything instantly with our advanced search across all your content and files.',
    icon: '🔍'
  },
  {
    title: 'Enterprise Security',
    description: 'Bank-level encryption, SSO, SAML, and compliance with SOC 2 and GDPR.',
    icon: '🔒'
  }
];

export const STATS = [
  { number: '100K+', label: 'Active Users' },
  { number: '50M+', label: 'Documents Created' },
  { number: '99.9%', label: 'Uptime' },
  { number: '4.9/5', label: 'User Rating' }
];
