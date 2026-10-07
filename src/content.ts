export const presentationUrl =
  'https://docs.google.com/presentation/d/1iFFBQPyygs-H0GvaRIWCflWeG6z2dox5zJ8zE1vx5Ps/edit?usp=sharing';

export type PortfolioPhoto = {
  src: string;
  alt: string;
  title: string;
  category: string;
  position?: string;
};

// Photographs and event details from the owner’s supplied Google Slides portfolio.
export const portfolioPhotos: PortfolioPhoto[] = [
  {
    src: `${import.meta.env.BASE_URL}images/portfolio/bridal-shower-backdrop.jpg`,
    alt: 'Ivory draped arches and greenery at Lydia’s bridal shower',
    title: 'The bridal shower',
    category: 'WEDDING OF CANA · 50 GUESTS',
    position: 'center',
  },
  {
    src: `${import.meta.env.BASE_URL}images/portfolio/engagement-arch.jpg`,
    alt: 'White fabric and greenery decorating an outdoor engagement-party arch',
    title: 'The engagement celebration',
    category: 'ENGAGEMENT PARTY · 70 GUESTS',
    position: 'center 42%',
  },
  {
    src: `${import.meta.env.BASE_URL}images/portfolio/baby-shower-desserts.jpg`,
    alt: 'A full dessert table with a floral cake and coordinated treats',
    title: 'Something sweet, thoughtfully arranged.',
    category: 'BABY IN BLOOM · 100 GUESTS',
    position: 'center',
  },
  {
    src: `${import.meta.env.BASE_URL}images/portfolio/rehearsal-dinner.jpg`,
    alt: 'A long outdoor restaurant table set for a family-style rehearsal dinner',
    title: 'The night before the big day.',
    category: 'REHEARSAL DINNER · 50 GUESTS',
    position: 'center 54%',
  },
  {
    src: `${import.meta.env.BASE_URL}images/portfolio/baptism-backdrop.jpg`,
    alt: 'A white-and-gold balloon arch surrounding a baptism welcome backdrop',
    title: 'A gathering full of meaning.',
    category: 'BAPTISM CELEBRATION · 100 GUESTS',
    position: 'center 40%',
  },
  {
    src: `${import.meta.env.BASE_URL}images/portfolio/bridal-welcome-sign.jpg`,
    alt: 'A mirrored bridal-shower welcome sign framed with white fabric and greenery',
    title: 'A warm welcome, from the very start.',
    category: 'WELCOME SIGNS & PERSONAL DETAILS',
    position: 'center 40%',
  },
  {
    src: `${import.meta.env.BASE_URL}images/portfolio/bridal-shower-details.jpg`,
    alt: 'Coordinated bridal-shower favors and printed activity cards',
    title: 'The little things, made personal.',
    category: 'BRIDAL SHOWER · THOUGHTFUL DETAILS',
    position: 'center',
  },
  {
    src: `${import.meta.env.BASE_URL}images/portfolio/engagement-cake.jpg`,
    alt: 'A white engagement cake with flowers beside photographs and champagne glasses',
    title: 'A reason to celebrate.',
    category: 'ENGAGEMENT PARTY · THE FINISHING TOUCHES',
    position: 'center',
  },
];

export const tiers = [
  {
    number: '01',
    name: 'The final details',
    timing: 'One week out',
    label: 'A steady hand, right on time.',
    you: [
      'Create your timeline',
      'Plan set up & clean up',
      'Book all vendors',
      'Plan your rehearsal dinner',
    ],
    meTitle: 'I EXECUTE',
    me: [
      'Review your timeline',
      'Be the point of contact for vendors',
      'Solve problems as they come up',
      'Stay with you from the moment you wake up until you get home',
      'Attend your rehearsal dinner',
    ],
  },
  {
    number: '02',
    name: 'Room to breathe',
    timing: 'One month out',
    label: 'Bring the plans. I’ll bring it together.',
    you: ['Book all your vendors'],
    meTitle: 'I PLAN & EXECUTE',
    me: [
      'Look at all the details',
      'Create your timeline',
      'Confirm all vendors',
      'Create set up & clean up plans',
      'Stay with you from the moment you wake up until you get home',
      'Plan your rehearsal dinner',
      'Plan your morning brunch',
    ],
  },
  {
    number: '03',
    name: 'A little more magic',
    timing: 'Two months out',
    label: 'More time together. More off your plate.',
    you: ['Book your venue, florist & major vendors'],
    meTitle: 'I PLAN & EXECUTE',
    me: ['Day-of coordination', 'Research & book your remaining vendors'],
    vendors: [
      'Cake',
      'DJ & entertainment',
      'Hair & makeup',
      'Rentals',
      'Transportation',
      'Party favors',
    ],
  },
];

export const faqs = [
  {
    question: 'When should we start working together?',
    answer:
      'The earlier I come in, the more I can take off your plate. Choose one week, one month, or two months out depending on where you are in the planning process and how much support you want. We’ll talk through the right fit in your consultation.',
  },
  {
    question: 'How does the $500 weekly rate work?',
    answer:
      'Planning and coordination support is $500 per week. The tier describes when I join your planning process and what support is included. We’ll confirm your dates, the number of weeks, and the full scope together before you book.',
  },
  {
    question: 'Is this just for weddings?',
    answer:
      'Weddings are a big part of the story, but meaningful gatherings come in all shapes. Tell me about your celebration in the consultation form and we can explore the support it needs.',
  },
  {
    question: 'What if I’ve already planned most of my day?',
    answer:
      'That’s exactly what the one-week tier is for. You bring your booked vendors, timeline, and set up and clean up plans. I’ll review the details, be the point of contact, and help keep everything moving so you can enjoy the day.',
  },
];
