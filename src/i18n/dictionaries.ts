export type Locale = 'en' | 'ar';

/*
 * Headline with one accented word.
 * EN: the accent is italic (+ colour). AR: colour only — Arabic uses no italics
 * (neutralised via `[lang="ar"] em { font-style: normal }` in globals.css).
 */
export interface AccentText {
  lead: string;
  accent: string;
  tail: string;
}

const en = {
  nav: {
    links: [
      { label: 'Services', href: '#services' },
      { label: 'Products', href: '#products' },
      { label: 'Studio', href: '#studio' },
      { label: 'Process', href: '#process' },
      { label: 'Tools', href: '/tools' },
    ],
    cta: 'Start a project',
    menuTagline: 'Software, built with conviction',
    toggle: 'عربي',
    toggleAria: 'Switch to Arabic',
    ariaPrimary: 'Primary',
    ariaMobile: 'Mobile',
    ariaMenuTitle: 'Navigation menu',
    ariaOpen: 'Open navigation menu',
    ariaBackToTop: 'IQAAN — back to top',
  },
  hero: {
    ariaLabel: 'Introduction',
    eyebrow: 'Software & Product Studio',
    /* pre renders on its own line (omitted when empty) */
    title: {
      pre: 'Software, built',
      mid: 'with',
      accent: 'conviction',
      post: '.',
    } as { pre: string; mid: string; accent: string; post: string },
    sub: 'IQAAN designs and engineers custom software, SaaS platforms, and products — for companies that refuse to ship the ordinary.',
    ctaPrimary: 'Start your project',
    ctaSecondary: 'Explore services',
    trust: 'Trusted by teams on four continents · Free consultation',
  },
  trustedBy: {
    ariaLabel: 'Trusted by',
    eyebrow: 'Trusted by teams at',
  },
  services: {
    ariaLabel: 'Services',
    eyebrow: '01 — Services',
    heading: { lead: 'Three ways we ', accent: 'build', tail: '.' } as AccentText,
    items: [
      {
        title: 'Custom Software Development',
        description:
          'Bespoke systems shaped around the way you work — from enterprise applications to the APIs that hold them together.',
        features: [
          'Enterprise Applications',
          'API Development & Integration',
          'Legacy Modernization',
          'Microservices Architecture',
        ],
      },
      {
        title: 'SaaS Platform Development',
        description:
          'Multi-tenant platforms engineered to grow with you — from first user to global scale.',
        features: [
          'Multi-tenant Architecture',
          'Subscription Management',
          'Real-time Analytics',
          'Auto-scaling Infrastructure',
        ],
      },
      {
        title: 'Product Engineering',
        description:
          'From first sketch to shipped product — engineering and design practiced as one discipline.',
        features: [
          'MVP Development',
          'UI/UX Design',
          'Quality Assurance',
          'DevOps & CI/CD',
        ],
      },
    ],
    rowAria: (title: string) => `Start a project — ${title}`,
  },
  products: {
    ariaLabel: 'Products',
    eyebrow: '02 — Products',
    heading: { lead: 'Products & ', accent: 'ventures', tail: '.' } as AccentText,
    intro: '',
    explore: 'Explore product',
    items: [
      {
        label: 'Venture 01',
        title: 'IQAAN Analytics Pro',
        description:
          'Enterprise analytics that turns raw data into decisions — real-time dashboards, AI-powered predictions, and reporting on autopilot.',
        features: ['Real-time Dashboards', 'AI Predictions', 'Custom Reports', 'Data Pipeline'],
      },
      {
        label: 'Venture 02',
        title: 'IQAAN CloudOps',
        description:
          'One plane of glass for your cloud — infrastructure, deployments, cost, and security across every environment you run.',
        features: ['Auto Scaling', 'Cost Optimization', 'Multi-cloud Support', 'Security Compliance'],
      },
    ],
  },
  manifesto: {
    ariaLabel: 'The IQAAN Standard',
    eyebrow: '03 — The IQAAN Standard',
    statement: {
      lead: 'We believe software is a craft. Every decision — architectural, visual, human — is made with ',
      accent: 'conviction',
      tail: ', or not at all.',
    } as AccentText,
    glossTop: 'iʿqān',
    glossBottom: 'deep conviction',
    principles: [
      {
        title: 'Precision over pace',
        line: 'We would rather ship it right than ship it first. Deadlines serve the work.',
      },
      {
        title: 'Design is not decoration',
        line: 'Structure, flow, and clarity are designed from the first commit — never applied at the end.',
      },
      {
        title: 'Own the outcome',
        line: 'Accountability does not end at launch. We answer to the numbers, and to the people behind them.',
      },
    ],
  },
  stats: {
    ariaLabel: 'Studio statistics',
    labels: ['Projects Delivered', 'Global Clients', 'Uptime Guarantee', 'Expert Engineers'],
  },
  process: {
    ariaLabel: 'Process',
    eyebrow: '04 — Process',
    heading: { lead: 'From first call to ', accent: 'launch', tail: '.' } as AccentText,
    steps: [
      {
        title: 'Discovery & Strategy',
        description:
          'We learn your business, your users, and the problem worth solving — then chart the technical strategy.',
      },
      {
        title: 'Design & Architecture',
        description:
          'Interfaces and systems designed together — intuitive to use, built to last.',
      },
      {
        title: 'Development & Testing',
        description:
          'Agile builds with continuous integration, rigorous testing, and progress you can see.',
      },
      {
        title: 'Launch & Scale',
        description:
          'Seamless deployment, constant monitoring, and the optimization production demands.',
      },
    ],
  },
  testimonials: {
    ariaLabel: 'Client voices',
    eyebrow: '05 — Client voices',
    heading: { lead: 'In their ', accent: 'words', tail: '.' } as AccentText,
    featured: {
      name: 'Sarah Chen',
      title: 'CTO of TechVenture',
      initials: 'SC',
      quote:
        'IQAAN transformed our legacy systems into a modern, scalable platform. The new system handles 10x our previous load with zero downtime.',
    },
    items: [
      {
        name: 'Marcus Rodriguez',
        title: 'CEO of DataSphere',
        initials: 'MR',
        quote:
          'The best decision we made. On time, on budget, outstanding quality — our user base grew 300% in the first quarter after launch.',
      },
      {
        name: 'Emily Watson',
        title: 'VP Engineering at CloudNine',
        initials: 'EW',
        quote:
          "IQAAN doesn't just write code — they become true partners in your success. Their product thinking helped us avoid costly mistakes and ship faster.",
      },
    ],
    starsAria: (n: number) => `${n} out of 5 stars`,
  },
  cta: {
    ariaLabel: 'Contact',
    eyebrow: '06 — Start',
    heading: {
      lead: 'Let’s build something ',
      accent: 'worth believing in',
      tail: '.',
    } as AccentText,
    sub: 'Tell us what you’re building. The first consultation is free, and we reply to every message.',
    formHeading: 'Send a message',
    formNote: 'We reply within 24 hours',
    labels: { name: 'Name', email: 'Email', company: 'Company', message: 'Message' },
    placeholders: {
      name: 'Jane Cooper',
      email: 'jane@company.com',
      company: 'Company Inc.',
      message: 'What are you building, and when does it need to ship?',
    },
    submit: 'Send message',
    sending: 'Sending',
    success: 'Thank you — we’ll be in touch within 24 hours.',
  },
  footer: {
    tagline: 'Software, built with conviction.',
    brandLatin: 'IQAAN',
    columns: { services: 'Services', company: 'Company', contact: 'Contact' },
    serviceLinks: [
      'Custom Development',
      'SaaS Solutions',
      'Product Engineering',
      'Cloud Services',
      'Consulting',
    ],
    companyLinks: ['About Us', 'Careers', 'Blog', 'Case Studies', 'Contact', 'Developer Tools'],
    contact: {
      email: 'hello@iqaan.com',
      phone: '+1 (555) 123-4567',
      location: 'San Francisco, CA',
    },
    newsletter: 'Newsletter',
    newsletterAria: 'Subscribe to newsletter',
    copyright: '© 2026 IQAAN — All rights reserved',
    bottomLinks: ['Privacy Policy', 'Terms of Service', 'Cookie Policy'],
  },
  notFound: {
    eyebrow: 'Error — Page not found',
    title: 'This page doesn’t exist — yet.',
    home: 'Return home',
  },
};

export type Dictionary = typeof en;

const ar: Dictionary = {
  nav: {
    links: [
      { label: 'الخدمات', href: '#services' },
      { label: 'المنتجات', href: '#products' },
      { label: 'الاستوديو', href: '#studio' },
      { label: 'منهجيتنا', href: '#process' },
      { label: 'أدوات', href: '/tools' },
    ],
    cta: 'ابدأ مشروعك',
    menuTagline: 'برمجيات تُبنى باليقين',
    toggle: 'EN',
    toggleAria: 'التبديل إلى الإنجليزية',
    ariaPrimary: 'الرئيسية',
    ariaMobile: 'للهاتف',
    ariaMenuTitle: 'قائمة التنقل',
    ariaOpen: 'فتح قائمة التنقل',
    ariaBackToTop: 'إيقان — العودة إلى الأعلى',
  },
  hero: {
    ariaLabel: 'مقدمة',
    eyebrow: 'استوديو برمجيات ومنتجات رقمية',
    title: {
      pre: '',
      mid: 'برمجيات تُبنى',
      accent: 'باليقين',
      // No terminal punctuation: a lone "." strands after the inline-block
      // accent span in RTL bidi; Arabic display headlines read cleaner bare.
      post: '',
    },
    sub: 'تصمم إيقان وتبني برمجيات مخصصة ومنصات SaaS ومنتجات رقمية للشركات التي لا تقبل بالمألوف.',
    ctaPrimary: 'ابدأ مشروعك',
    ctaSecondary: 'استكشف خدماتنا',
    trust: 'موثوق من فرق في أربع قارات · استشارة مجانية',
  },
  trustedBy: {
    ariaLabel: 'موثوقية',
    eyebrow: 'موثوق من فرق لدى',
  },
  services: {
    ariaLabel: 'الخدمات',
    eyebrow: '01 — خدمات',
    heading: { lead: 'ثلاث ركائز ', accent: 'نبني', tail: ' عليها.' },
    items: [
      {
        title: 'تطوير البرمجيات المخصصة',
        description:
          'نبني أنظمة برمجية تفصيلية تُقارب احتياجات عملك بدقة، من الأنظمة المؤسسية إلى تطبيقات المستهلكين.',
        features: [
          'تطبيقات مؤسسية',
          'تطوير الواجهات البرمجية والتكامل',
          'تحديث الأنظمة القديمة',
          'معمارية الخدمات المصغرة',
        ],
      },
      {
        title: 'تطوير منصات SaaS',
        description:
          'منصات متعددة المستأجرين قابلة للتوسع تنمو مع أعمالك، من إدارة الاشتراكات إلى التحليلات اللحظية.',
        features: [
          'معمارية متعددة المستأجرين',
          'إدارة الاشتراكات',
          'تحليلات لحظية',
          'بنية تحتية تلقائية التوسع',
        ],
      },
      {
        title: 'هندسة المنتجات',
        description:
          'نحوّل رؤيتك إلى منتجات جاهزة للسوق، بجمع التميّز التقني مع تصميم يخدم المستخدم.',
        features: [
          'تطوير المنتج الأولي MVP',
          'تصميم UI/UX',
          'ضمان الجودة',
          'DevOps وCI/CD',
        ],
      },
    ],
    rowAria: (title: string) => `ابدأ مشروعك — ${title}`,
  },
  products: {
    ariaLabel: 'المنتجات',
    eyebrow: '02 — المنتجات',
    heading: { lead: 'منتجاتنا و', accent: 'رياداتنا', tail: '.' },
    intro: 'حلول جاهزة للنشر، مبنية للتوسع.',
    explore: 'استكشف المنتج',
    items: [
      {
        label: 'Venture 01',
        title: 'IQAAN Analytics Pro',
        description:
          'تحليلات مؤسسية تحوّل البيانات الخام إلى قرارات — لوحات لحظية وتنبؤات بالذكاء الاصطناعي وتقارير تعمل تلقائياً.',
        features: [
          'لوحات لحظية',
          'تنبؤات بالذكاء الاصطناعي',
          'تقارير مخصصة',
          'خطوط بيانات',
        ],
      },
      {
        label: 'Venture 02',
        title: 'IQAAN CloudOps',
        description:
          'لوحة واحدة شفافة لسحابتك — البنية التحتية والنشر والتكاليف والأمان عبر كل بيئات التشغيل لديك.',
        features: [
          'تحجيم تلقائي',
          'تحسين التكاليف',
          'دعم متعدد السحابات',
          'امتثال أمني',
        ],
      },
    ],
  },
  manifesto: {
    ariaLabel: 'معيار إيقان',
    eyebrow: '03 — معيار إيقان',
    statement: {
      lead: 'نؤمن أن البرمجيات حرفة. كل قرار — معماري أو بصري أو إنساني — يُتخذ ',
      accent: 'بيقين',
      tail: '، أو لا يُتخذ أصلاً.',
    },
    glossTop: 'iʿqān',
    glossBottom: 'deep conviction',
    principles: [
      {
        title: 'الدقة قبل السرعة',
        line: 'لا نبني بسرعة على حساب الإتقان؛ نبني صحيحاً من أول مرة.',
      },
      {
        title: 'التصميم ليس زخرفة',
        line: 'الشكل يتبع الوظيفة، والوظيفة تُصمم بعناية.',
      },
      {
        title: 'نمتلك النتيجة',
        line: 'من أول سطر برمجي حتى الإطلاق وما بعده — نحن معك.',
      },
    ],
  },
  stats: {
    ariaLabel: 'إحصاءات الاستوديو',
    labels: ['مشروع منجز', 'عميل حول العالم', 'جهوزية مضمونة', 'مهندس متخصص'],
  },
  process: {
    ariaLabel: 'منهجيتنا',
    eyebrow: '04 — منهجيتنا',
    heading: { lead: 'من أول اجتماع إلى ', accent: 'الإطلاق', tail: '.' },
    steps: [
      {
        title: 'الاكتشاف والاستراتيجية',
        description:
          'نغوص في أهداف عملك واحتياجات مستخدميك ومشهد السوق لنصيغ استراتيجية تقنية رابحة.',
      },
      {
        title: 'التصميم والمعمارية',
        description:
          'نصمم واجهات بديهية ومعماريات أنظمة قابلة للصمود أمام الزمن.',
      },
      {
        title: 'التطوير والاختبار',
        description:
          'تطوير رشيق مع تكامل مستمر واختبارات صارمة ومتابعة شفافة.',
      },
      {
        title: 'الإطلاق والتوسع',
        description:
          'نشر سلس ومراقبة وتحسين مستمر ليحظى منتجك بالازدهار في الإنتاج.',
      },
    ],
  },
  testimonials: {
    ariaLabel: 'شهادات العملاء',
    eyebrow: '05 — شهادات العملاء',
    heading: { lead: 'ماذا يقول ', accent: 'عملاؤنا', tail: '.' },
    featured: {
      name: 'Sarah Chen',
      title: 'الرئيس التقني، TechVenture',
      initials: 'SC',
      quote:
        'حوّلت إيقان أنظمتنا القديمة إلى منصة حديثة قابلة للتوسع. خبرتهم وتفانيهم في الجودة تجاوز كل توقعاتنا — النظام الجديد يتحمل عشرة أضعاف الحمل السابق دون أي توقف.',
    },
    items: [
      {
        name: 'Marcus Rodriguez',
        title: 'الرئيس التنفيذي، DataSphere',
        initials: 'MR',
        quote:
          'العمل مع إيقان على منصتنا كان أفضل قرار اتخذناه. سلموا في الوقت وبحدود الميزانية، وبجودة مذهلة. قاعدتنا من المستخدمين نمت 300% في الربع الأول بعد الإطلاق.',
      },
      {
        name: 'Emily Watson',
        title: 'نائب الهندسة، CloudNine',
        initials: 'EW',
        quote:
          'فريق إيقان لا يكتب الشيفرة فحسب — بل يصبح شريكاً حقيقياً في نجاحك. تفكيرهم المنتجي وخبرتهم المعمارية ساعدتنا على تجنب أخطاء مكلفة والإطلاق أسرع.',
      },
    ],
    starsAria: (n: number) => `${n} من 5 نجوم`,
  },
  cta: {
    ariaLabel: 'تواصل',
    eyebrow: '06 — البداية',
    heading: {
      lead: 'لنبنِ شيئاً يستحق ',
      accent: 'الإيمان',
      tail: ' به.',
    },
    sub: 'لنتحدث كيف تحوّل إيقان أفكارك إلى حلول رقمية مؤثرة. استشارتك الأولى مجانية.',
    formHeading: 'أرسل رسالة',
    formNote: 'نرد خلال 24 ساعة',
    labels: {
      name: 'الاسم الكامل',
      email: 'البريد الإلكتروني',
      company: 'الشركة',
      message: 'رسالتك',
    },
    placeholders: {
      name: 'الاسم الكريم',
      email: 'name@example.com',
      company: 'اسم شركتك',
      message: 'حدثنا عن مشروعك وأهدافك وجدولك الزمني…',
    },
    submit: 'إرسال الرسالة',
    sending: 'جارٍ الإرسال…',
    success: 'وصلت رسالتك — سنعاود التواصل قريباً.',
  },
  footer: {
    tagline: 'برمجيات تُبنى باليقين.',
    brandLatin: 'IQAAN',
    columns: { services: 'الخدمات', company: 'الشركة', contact: 'تواصل معنا' },
    serviceLinks: [
      'تطوير مخصص',
      'حلول SaaS',
      'هندسة المنتجات',
      'خدمات سحابية',
      'استشارات',
    ],
    companyLinks: ['من نحن', 'الوظائف', 'المدونة', 'دراسات الحالة', 'تواصل معنا', 'أدوات المطورين'],
    contact: {
      email: 'hello@iqaan.com',
      phone: '+1 (555) 123-4567',
      location: 'سان فرانسيسكو، كاليفورنيا',
    },
    newsletter: 'اشترك في نشرتنا',
    newsletterAria: 'اشترك في النشرة البريدية',
    copyright: '© 2026 إيقان — جميع الحقوق محفوظة',
    bottomLinks: ['سياسة الخصوصية', 'شروط الخدمة', 'سياسة ملفات تعريف الارتباط'],
  },
  notFound: {
    eyebrow: 'Error — Page not found',
    title: 'هذه الصفحة غير موجودة — بعد.',
    home: 'العودة إلى الرئيسية',
  },
};

export const dictionaries: Record<Locale, Dictionary> = { en, ar };
