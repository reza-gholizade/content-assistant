
import { TranslationStrings, Language, PageType, ContentTone, Frequency } from './types';

export const TRANSLATIONS: Record<Language, TranslationStrings> = {
  fa: {
    appName: 'دستیار اینستاگرام',
    tagline: 'تولید محتوای حرفه‌ای در چند ثانیه با هوش مصنوعی',
    startBtn: 'شروع برنامه‌ریزی محتوا',
    step: 'مرحله',
    next: 'بعدی',
    prev: 'قبلی',
    generate: 'تولید محتوا',
    pageTypeLabel: 'نوع پیج شما چیست؟',
    topicLabel: 'موضوع اصلی پیج شما چیست؟',
    topicPlaceholder: 'مثال: لوازم آرایشی و روتین پوستی',
    audienceLabel: 'مخاطب هدف شما (اختیاری)',
    ageRangeLabel: 'محدوده سنی مخاطبان (بکشید تا انتخاب شود)',
    genderPlaceholder: 'جنسیت (خانم‌ها، آقایان، همه)',
    concernPlaceholder: 'دغدغه اصلی مخاطب شما چیست؟',
    toneLabel: 'لحن محتوا چگونه باشد؟',
    frequencyLabel: 'تعداد پست در هفته؟',
    loading: 'در حال تولید محتوای جادویی برای شما...',
    copy: 'کپی',
    copied: 'کپی شد!',
    calendarTab: 'تقویم محتوایی',
    captionsTab: 'کپشن‌ها',
    hashtagsTab: 'هشتگ‌ها',
    ideasTab: 'ایده‌های استوری و ریلز',
    chatTitle: 'مشاوره محتوا',
    chatPlaceholder: 'سوالی در مورد اینستاگرام دارید؟ بپرسید...',
    effectLabel: 'چه تأثیری می‌خواهید روی مخاطب بگذارید؟',
    personaLabel: 'شما را با چه شخصیتی بشناسند؟',
    editNotice: 'می‌توانید متن کپشن را قبل از کپی کردن ویرایش کنید.',
    finalDetailsLabel: 'جزییات نهایی و نکات خاص (اختیاری)',
    finalDetailsPlaceholder: 'مثلاً: روی تخفیف آخر هفته تاکید کن یا از کلمات خاصی استفاده کن...'
  },
  en: {
    appName: 'Insta Assistant',
    tagline: 'Professional content generation in seconds with AI',
    startBtn: 'Start Content Planning',
    step: 'Step',
    next: 'Next',
    prev: 'Back',
    generate: 'Generate Content',
    pageTypeLabel: 'What is your page type?',
    topicLabel: 'What is your page topic?',
    topicPlaceholder: 'e.g., Cosmetics and skincare products',
    audienceLabel: 'Target Audience (Optional)',
    ageRangeLabel: 'Audience Age Range (Drag to select)',
    genderPlaceholder: 'Gender (Women, Men, All)',
    concernPlaceholder: 'What is your audience\'s main concern?',
    toneLabel: 'What is the content tone?',
    frequencyLabel: 'Posting frequency?',
    loading: 'Generating magic content for you...',
    copy: 'Copy',
    copied: 'Copied!',
    calendarTab: 'Content Calendar',
    captionsTab: 'Captions',
    hashtagsTab: 'Hashtags',
    ideasTab: 'Story & Reels Ideas',
    chatTitle: 'Content Advisor',
    chatPlaceholder: 'Ask anything about Instagram...',
    effectLabel: 'What effect should the content have on the audience?',
    personaLabel: 'What personality should you project?',
    editNotice: 'You can edit the caption text before copying it.',
    finalDetailsLabel: 'Final Details & Specific Notes (Optional)',
    finalDetailsPlaceholder: 'e.g., Emphasize the weekend sale or use specific keywords...'
  }
};

export const PAGE_TYPE_OPTIONS: Record<Language, { value: PageType; label: string }[]> = {
  fa: [
    { value: PageType.SHOP, label: 'فروشگاهی' },
    { value: PageType.SERVICE, label: 'خدماتی' },
    { value: PageType.EDUCATIONAL, label: 'آموزشی' },
    { value: PageType.PERSONAL, label: 'بلاگر / شخصی' },
    { value: PageType.REAL_ESTATE, label: 'املاک و مسکن' },
    { value: PageType.FOOD, label: 'رستوران و آشپزی' },
    { value: PageType.BEAUTY, label: 'زیبایی و آرایشی' },
    { value: PageType.TECH, label: 'تکنولوژی و دیجیتال' },
    { value: PageType.HEALTH, label: 'پزشکی و سلامت' },
    { value: PageType.ART, label: 'هنر و طراحی' },
    { value: PageType.TRAVEL, label: 'گردشگری و سفر' },
    { value: PageType.NEWS, label: 'خبری و رسانه' }
  ],
  en: [
    { value: PageType.SHOP, label: 'Online Shop' },
    { value: PageType.SERVICE, label: 'Service Provider' },
    { value: PageType.EDUCATIONAL, label: 'Educational' },
    { value: PageType.PERSONAL, label: 'Influencer / Personal' },
    { value: PageType.REAL_ESTATE, label: 'Real Estate' },
    { value: PageType.FOOD, label: 'Food & Restaurant' },
    { value: PageType.BEAUTY, label: 'Beauty & Skincare' },
    { value: PageType.TECH, label: 'Tech & Digital' },
    { value: PageType.HEALTH, label: 'Health & Medical' },
    { value: PageType.ART, label: 'Art & Design' },
    { value: PageType.TRAVEL, label: 'Travel & Tourism' },
    { value: PageType.NEWS, label: 'News & Media' }
  ]
};

export const TONE_OPTIONS: Record<Language, { value: ContentTone; label: string }[]> = {
  fa: [
    { value: ContentTone.FORMAL, label: 'رسمی' },
    { value: ContentTone.CASUAL, label: 'دوستانه' },
    { value: ContentTone.FRIENDLY, label: 'صمیمی' },
    { value: ContentTone.MOTIVATIONAL, label: 'انگیزشی' },
    { value: ContentTone.SALES, label: 'فروش‌محور' }
  ],
  en: [
    { value: ContentTone.FORMAL, label: 'Formal' },
    { value: ContentTone.CASUAL, label: 'Casual' },
    { value: ContentTone.FRIENDLY, label: 'Friendly' },
    { value: ContentTone.MOTIVATIONAL, label: 'Motivational' },
    { value: ContentTone.SALES, label: 'Sales-oriented' }
  ]
};

export const FREQUENCY_OPTIONS: Record<Language, { value: Frequency; label: string }[]> = {
  fa: [
    { value: Frequency.THREE_PER_WEEK, label: '۳ پست در هفته' },
    { value: Frequency.FIVE_PER_WEEK, label: '۵ پست در هفته' },
    { value: Frequency.DAILY, label: 'هر روز' }
  ],
  en: [
    { value: Frequency.THREE_PER_WEEK, label: '3 posts per week' },
    { value: Frequency.FIVE_PER_WEEK, label: '5 posts per week' },
    { value: Frequency.DAILY, label: 'Daily posts' }
  ]
};

export const EFFECT_OPTIONS: Record<Language, string[]> = {
  fa: ['ایجاد اعتماد', 'افزایش هیجان', 'برانگیختن کنجکاوی', 'آموزش عمیق', 'فروش مستقیم', 'تعامل و گفتگو'],
  en: ['Building Trust', 'Creating Excitement', 'Sparking Curiosity', 'Deep Education', 'Direct Sales', 'Community Engagement']
};

export const PERSONA_OPTIONS: Record<Language, string[]> = {
  fa: ['متخصص و حرفه‌ای', 'دوست طناز و شوخ', 'مینیمال و شیک', 'رهبر جسور', 'حامی و مهربان', 'منتقد و دقیق'],
  en: ['Professional Expert', 'Funny/Witty Friend', 'Minimalist/Aesthetic', 'Bold Leader', 'Kind Supporter', 'Critical Thinker']
};
