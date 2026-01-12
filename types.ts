
export type Language = 'fa' | 'en';
export type ThemeColor = 'blue' | 'rose' | 'emerald';
export type ThemeMode = 'light' | 'dark';

export enum PageType {
  SHOP = 'SHOP',
  SERVICE = 'SERVICE',
  EDUCATIONAL = 'EDUCATIONAL',
  PERSONAL = 'PERSONAL',
  REAL_ESTATE = 'REAL_ESTATE',
  FOOD = 'FOOD',
  BEAUTY = 'BEAUTY',
  TECH = 'TECH',
  HEALTH = 'HEALTH',
  ART = 'ART',
  TRAVEL = 'TRAVEL',
  NEWS = 'NEWS'
}

export enum ContentTone {
  FORMAL = 'FORMAL',
  CASUAL = 'CASUAL',
  FRIENDLY = 'FRIENDLY',
  MOTIVATIONAL = 'MOTIVATIONAL',
  SALES = 'SALES'
}

export enum Frequency {
  THREE_PER_WEEK = 'THREE_PER_WEEK',
  FIVE_PER_WEEK = 'FIVE_PER_WEEK',
  DAILY = 'DAILY'
}

export interface ContentFormData {
  pageType: PageType;
  topic: string;
  ageRange: [number, number]; // [min, max]
  audienceGender?: string;
  audienceConcern?: string;
  tone: ContentTone;
  frequency: Frequency;
  effect: string;
  persona: string;
  finalDetails: string; // New field
}

export interface CalendarEntry {
  day: string;
  type: string;
  title: string;
}

export interface ContentOutput {
  calendar: CalendarEntry[];
  captions: {
    title: string;
    text: string;
  }[];
  hashtags: string[];
  storyIdeas: string[];
  reelIdeas: string[];
}

export interface TranslationStrings {
  appName: string;
  tagline: string;
  startBtn: string;
  step: string;
  next: string;
  prev: string;
  generate: string;
  pageTypeLabel: string;
  topicLabel: string;
  topicPlaceholder: string;
  audienceLabel: string;
  ageRangeLabel: string;
  genderPlaceholder: string;
  concernPlaceholder: string;
  toneLabel: string;
  frequencyLabel: string;
  loading: string;
  copy: string;
  copied: string;
  calendarTab: string;
  captionsTab: string;
  hashtagsTab: string;
  ideasTab: string;
  chatTitle: string;
  chatPlaceholder: string;
  effectLabel: string;
  personaLabel: string;
  editNotice: string;
  finalDetailsLabel: string;
  finalDetailsPlaceholder: string;
}
