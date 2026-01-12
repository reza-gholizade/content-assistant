
import React, { useState, useEffect, useRef, useCallback } from 'react';
import { 
  Language, 
  ContentFormData, 
  PageType, 
  ContentTone, 
  Frequency, 
  ContentOutput,
  TranslationStrings,
  ThemeColor,
  ThemeMode
} from './types';
import { 
  TRANSLATIONS, 
  PAGE_TYPE_OPTIONS, 
  TONE_OPTIONS, 
  FREQUENCY_OPTIONS,
  EFFECT_OPTIONS,
  PERSONA_OPTIONS
} from './constants';
import { LanguageSwitcher } from './components/LanguageSwitcher';
import { ThemeSelector } from './components/ThemeSelector';
import { ChatBot } from './components/ChatBot';
import { generateInstagramContent } from './services/gemini';
import { 
  Sparkles, 
  ArrowRight, 
  ArrowLeft, 
  Calendar, 
  FileText, 
  Hash, 
  Lightbulb, 
  Check, 
  Copy,
  Instagram,
  ChevronRight,
  ChevronLeft,
  Loader2,
  Zap,
  Film,
  Pencil,
  Info,
  Share2
} from 'lucide-react';

// STANDALONE Age Selector Component to fix dragging bug
const AgeRangeSelector: React.FC<{ 
  value: [number, number]; 
  onChange: (val: [number, number]) => void; 
  label: string; 
  themeColors: any;
}> = ({ value, onChange, label, themeColors }) => {
  const minAge = 13;
  const maxAge = 65;
  const sliderRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState<'min' | 'max' | null>(null);

  const handleUpdate = useCallback((clientX: number) => {
    if (!sliderRef.current || !isDragging) return;
    const rect = sliderRef.current.getBoundingClientRect();
    const percent = Math.min(Math.max((clientX - rect.left) / rect.width, 0), 1);
    const val = Math.round(minAge + percent * (maxAge - minAge));

    if (isDragging === 'min') {
      onChange([Math.min(val, value[1] - 1), value[1]]);
    } else if (isDragging === 'max') {
      onChange([value[0], Math.max(val, value[0] + 1)]);
    }
  }, [isDragging, value, onChange, minAge, maxAge]);

  useEffect(() => {
    const onMouseMove = (e: MouseEvent) => isDragging && handleUpdate(e.clientX);
    const onTouchMove = (e: TouchEvent) => isDragging && handleUpdate(e.touches[0].clientX);
    const onEnd = () => setIsDragging(null);

    if (isDragging) {
      window.addEventListener('mousemove', onMouseMove);
      window.addEventListener('mouseup', onEnd);
      window.addEventListener('touchmove', onTouchMove);
      window.addEventListener('touchend', onEnd);
    }

    return () => {
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseup', onEnd);
      window.removeEventListener('touchmove', onTouchMove);
      window.removeEventListener('touchend', onEnd);
    };
  }, [isDragging, handleUpdate]);

  const getPos = (val: number) => ((val - minAge) / (maxAge - minAge)) * 100;

  return (
    <div className="space-y-6 select-none py-4">
      <label className="text-gray-500 dark:text-gray-400 text-sm font-bold block mb-2">{label}</label>
      <div className="relative h-12 flex items-center px-4">
        <div ref={sliderRef} className="relative w-full h-3 bg-gray-200 dark:bg-gray-800 rounded-full">
          <div 
            className={`absolute h-full ${themeColors.primary} opacity-30 rounded-full`}
            style={{ left: `${getPos(value[0])}%`, right: `${100 - getPos(value[1])}%` }}
          />
          <div 
            onMouseDown={(e) => { e.preventDefault(); setIsDragging('min'); }}
            onTouchStart={() => setIsDragging('min')}
            className={`absolute top-1/2 -translate-y-1/2 w-8 h-8 ${themeColors.primary} rounded-full border-4 border-white dark:border-gray-900 shadow-lg cursor-grab active:cursor-grabbing z-10 transition-transform hover:scale-110`}
            style={{ left: `${getPos(value[0])}%`, transform: 'translate(-50%, -50%)' }}
          >
            <div className="absolute -top-10 left-1/2 -translate-x-1/2 bg-gray-900 text-white text-[10px] px-2 py-1 rounded font-black">{value[0]}</div>
          </div>
          <div 
            onMouseDown={(e) => { e.preventDefault(); setIsDragging('max'); }}
            onTouchStart={() => setIsDragging('max')}
            className={`absolute top-1/2 -translate-y-1/2 w-8 h-8 ${themeColors.primary} rounded-full border-4 border-white dark:border-gray-900 shadow-lg cursor-grab active:cursor-grabbing z-10 transition-transform hover:scale-110`}
            style={{ left: `${getPos(value[1])}%`, transform: 'translate(-50%, -50%)' }}
          >
            <div className="absolute -top-10 left-1/2 -translate-x-1/2 bg-gray-900 text-white text-[10px] px-2 py-1 rounded font-black">{value[1]}</div>
          </div>
        </div>
      </div>
      <div className="flex justify-between text-xs font-black text-gray-400">
        <span>{minAge}</span>
        <span>{maxAge}+</span>
      </div>
    </div>
  );
};

const App: React.FC = () => {
  const [lang, setLang] = useState<Language>('fa');
  const [theme, setTheme] = useState<ThemeColor>('blue');
  const [mode, setMode] = useState<ThemeMode>('light');
  const [step, setStep] = useState(0);
  const [formData, setFormData] = useState<ContentFormData>({
    pageType: PageType.SHOP,
    topic: '',
    ageRange: [18, 45],
    audienceGender: '',
    audienceConcern: '',
    tone: ContentTone.CASUAL,
    frequency: Frequency.THREE_PER_WEEK,
    effect: '',
    persona: '',
    finalDetails: ''
  });
  const [output, setOutput] = useState<ContentOutput | null>(null);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<'calendar' | 'captions' | 'hashtags' | 'ideas'>('calendar');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const t = TRANSLATIONS[lang];
  const TOTAL_STEPS = 8;

  useEffect(() => {
    document.documentElement.dir = lang === 'fa' ? 'rtl' : 'ltr';
    document.documentElement.lang = lang;
  }, [lang]);

  useEffect(() => {
    if (mode === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [mode]);

  const handleNext = () => setStep(s => s + 1);
  const handlePrev = () => setStep(s => s - 1);

  const handleGenerate = async () => {
    setLoading(true);
    try {
      const result = await generateInstagramContent(formData, lang);
      setOutput(result);
      setStep(TOTAL_STEPS + 1);
    } catch (error) {
      alert(lang === 'fa' ? 'خطا در برقراری ارتباط با هوش مصنوعی' : 'Error connecting to AI');
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleShare = async (text: string, title: string) => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: title,
          text: text,
        });
      } catch (err) {
        console.log('Error sharing:', err);
      }
    } else {
      copyToClipboard(text, 'share-fallback');
      alert(lang === 'fa' ? 'قابلیت اشتراک‌گذاری در این مرورگر پشتیبانی نمی‌شود. متن کپی شد.' : 'Sharing is not supported in this browser. Text copied instead.');
    }
  };

  const themeColors = {
    blue: {
      primary: 'bg-blue-500',
      hover: 'hover:bg-blue-400',
      text: 'text-blue-500',
      bgLight: 'bg-blue-50 dark:bg-blue-900/20',
      border: 'border-blue-500',
      ring: 'ring-blue-500/10',
      shadow: 'shadow-blue-500/20'
    },
    rose: {
      primary: 'bg-rose-500',
      hover: 'hover:bg-rose-400',
      text: 'text-rose-500',
      bgLight: 'bg-rose-50 dark:bg-rose-900/20',
      border: 'border-rose-500',
      ring: 'ring-rose-500/10',
      shadow: 'shadow-rose-500/20'
    },
    emerald: {
      primary: 'bg-emerald-500',
      hover: 'hover:bg-emerald-400',
      text: 'text-emerald-500',
      bgLight: 'bg-emerald-50 dark:bg-emerald-900/20',
      border: 'border-emerald-500',
      ring: 'ring-emerald-500/10',
      shadow: 'shadow-emerald-500/20'
    }
  }[theme];

  const handleCaptionChange = (index: number, newText: string) => {
    if (!output) return;
    const newCaptions = [...output.captions];
    newCaptions[index].text = newText;
    setOutput({ ...output, captions: newCaptions });
  };

  const renderFormStep = () => {
    switch (step) {
      case 0:
        return (
          <div className="text-center py-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <div className={`w-24 h-24 ${themeColors.bgLight} ${themeColors.text} rounded-[2.5rem] flex items-center justify-center mx-auto mb-8 shadow-inner border border-gray-100 dark:border-gray-800`}>
              <Sparkles size={48} className="drop-shadow-sm" />
            </div>
            <h1 className="text-4xl font-black mb-4 text-gray-900 dark:text-white tracking-tight">{t.appName}</h1>
            <p className="text-gray-600 dark:text-gray-400 mb-12 max-w-md mx-auto text-lg leading-relaxed">{t.tagline}</p>
            <button 
              onClick={handleNext}
              className={`${themeColors.primary} text-white px-10 py-5 rounded-2xl font-bold text-xl ${themeColors.hover} transition-all flex items-center gap-3 mx-auto shadow-xl ${themeColors.shadow} hover:scale-105 active:scale-95 group`}
            >
              {t.startBtn}
              <div className="transition-transform group-hover:translate-x-1 rtl:group-hover:-translate-x-1">
                {lang === 'fa' ? <ArrowLeft size={24} /> : <ArrowRight size={24} />}
              </div>
            </button>
          </div>
        );

      case 1:
        return (
          <div className="space-y-8 animate-in fade-in duration-300">
            <h2 className="text-2xl font-black text-gray-900 dark:text-white text-center">{t.pageTypeLabel}</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              {PAGE_TYPE_OPTIONS[lang].map(opt => (
                <button
                  key={opt.value}
                  onClick={() => { setFormData({ ...formData, pageType: opt.value }); handleNext(); }}
                  className={`p-5 rounded-2xl border-2 text-center transition-all group ${
                    formData.pageType === opt.value 
                      ? `${themeColors.border} ${themeColors.bgLight} ring-4 ${themeColors.ring}` 
                      : 'border-gray-200 dark:border-gray-700 hover:border-blue-200 dark:hover:border-gray-600 bg-white dark:bg-gray-800 shadow-sm hover:shadow-md'
                  }`}
                >
                  <div className={`font-black text-sm sm:text-base ${formData.pageType === opt.value ? themeColors.text : 'text-gray-700 dark:text-gray-300'}`}>
                    {opt.label}
                  </div>
                </button>
              ))}
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-8 animate-in fade-in duration-300">
            <h2 className="text-2xl font-black text-gray-900 dark:text-white text-center">{t.topicLabel}</h2>
            <textarea
              value={formData.topic}
              onChange={(e) => setFormData({ ...formData, topic: e.target.value })}
              placeholder={t.topicPlaceholder}
              className={`w-full h-40 p-6 rounded-3xl border-2 border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 dark:text-white focus:${themeColors.border} focus:ring-4 focus:${themeColors.ring} outline-none transition-all text-xl font-medium shadow-sm resize-none`}
            />
            <button
              disabled={!formData.topic.trim()}
              onClick={handleNext}
              className={`w-full ${themeColors.primary} text-white py-5 rounded-2xl font-black text-lg disabled:opacity-30 disabled:cursor-not-allowed ${themeColors.hover} transition-all shadow-lg ${themeColors.shadow}`}
            >
              {t.next}
            </button>
          </div>
        );

      case 3:
        return (
          <div className="space-y-8 animate-in fade-in duration-300">
            <h2 className="text-2xl font-black text-gray-900 dark:text-white text-center">{t.audienceLabel}</h2>
            <div className="space-y-6">
              <AgeRangeSelector 
                value={formData.ageRange} 
                onChange={(range) => setFormData({...formData, ageRange: range})} 
                label={t.ageRangeLabel}
                themeColors={themeColors}
              />
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <input
                  type="text"
                  placeholder={t.genderPlaceholder}
                  className={`w-full p-5 rounded-2xl border-2 border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 dark:text-white outline-none focus:${themeColors.border} focus:ring-4 focus:${themeColors.ring} font-medium transition-all`}
                  value={formData.audienceGender}
                  onChange={e => setFormData({ ...formData, audienceGender: e.target.value })}
                />
                <input
                  type="text"
                  placeholder={t.concernPlaceholder}
                  className={`w-full p-5 rounded-2xl border-2 border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 dark:text-white outline-none focus:${themeColors.border} focus:ring-4 focus:${themeColors.ring} font-medium transition-all`}
                  value={formData.audienceConcern}
                  onChange={e => setFormData({ ...formData, audienceConcern: e.target.value })}
                />
              </div>
            </div>
            <button onClick={handleNext} className={`w-full ${themeColors.primary} text-white py-5 rounded-2xl font-black text-lg ${themeColors.hover} transition-all shadow-lg ${themeColors.shadow}`}>
              {t.next}
            </button>
          </div>
        );

      case 4:
        return (
          <div className="space-y-8 animate-in fade-in duration-300">
            <h2 className="text-2xl font-black text-gray-900 dark:text-white text-center">{t.effectLabel}</h2>
            <div className="grid grid-cols-2 gap-4">
              {EFFECT_OPTIONS[lang].map(opt => (
                <button
                  key={opt}
                  onClick={() => { setFormData({ ...formData, effect: opt }); handleNext(); }}
                  className={`p-6 rounded-2xl border-2 text-center transition-all ${
                    formData.effect === opt 
                      ? `${themeColors.border} ${themeColors.bgLight} ring-4 ${themeColors.ring}` 
                      : 'border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 shadow-sm hover:shadow-md'
                  }`}
                >
                  <div className={`font-black text-base ${formData.effect === opt ? themeColors.text : 'text-gray-700 dark:text-gray-300'}`}>
                    {opt}
                  </div>
                </button>
              ))}
            </div>
          </div>
        );

      case 5:
        return (
          <div className="space-y-8 animate-in fade-in duration-300">
            <h2 className="text-2xl font-black text-gray-900 dark:text-white text-center">{t.personaLabel}</h2>
            <div className="grid grid-cols-2 gap-4">
              {PERSONA_OPTIONS[lang].map(opt => (
                <button
                  key={opt}
                  onClick={() => { setFormData({ ...formData, persona: opt }); handleNext(); }}
                  className={`p-6 rounded-2xl border-2 text-center transition-all ${
                    formData.persona === opt 
                      ? `${themeColors.border} ${themeColors.bgLight} ring-4 ${themeColors.ring}` 
                      : 'border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 shadow-sm hover:shadow-md'
                  }`}
                >
                  <div className={`font-black text-base ${formData.persona === opt ? themeColors.text : 'text-gray-700 dark:text-gray-300'}`}>
                    {opt}
                  </div>
                </button>
              ))}
            </div>
          </div>
        );

      case 6:
        return (
          <div className="space-y-8 animate-in fade-in duration-300">
            <h2 className="text-2xl font-black text-gray-900 dark:text-white text-center">{t.toneLabel}</h2>
            <div className="grid grid-cols-1 gap-4">
              {TONE_OPTIONS[lang].map(opt => (
                <button
                  key={opt.value}
                  onClick={() => { setFormData({ ...formData, tone: opt.value }); handleNext(); }}
                  className={`p-5 rounded-2xl border-2 transition-all flex justify-between items-center group ${
                    formData.tone === opt.value 
                      ? `${themeColors.border} ${themeColors.bgLight} ring-4 ${themeColors.ring}` 
                      : 'border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 shadow-sm'
                  }`}
                >
                  <span className={`font-black text-lg ${formData.tone === opt.value ? themeColors.text : 'text-gray-700 dark:text-gray-300'}`}>{opt.label}</span>
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center transition-all ${formData.tone === opt.value ? `${themeColors.primary} text-white scale-110` : 'bg-gray-100 dark:bg-gray-700 text-transparent'}`}>
                    <Check size={18} />
                  </div>
                </button>
              ))}
            </div>
          </div>
        );

      case 7:
        return (
          <div className="space-y-8 animate-in fade-in duration-300">
            <h2 className="text-2xl font-black text-gray-900 dark:text-white text-center">{t.frequencyLabel}</h2>
            <div className="space-y-4">
              {FREQUENCY_OPTIONS[lang].map(opt => (
                <button
                  key={opt.value}
                  onClick={() => { setFormData({ ...formData, frequency: opt.value }); handleNext(); }}
                  className={`w-full p-5 rounded-2xl border-2 transition-all flex justify-between items-center ${
                    formData.frequency === opt.value 
                      ? `${themeColors.border} ${themeColors.bgLight} ring-4 ${themeColors.ring}` 
                      : 'border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 shadow-sm'
                  }`}
                >
                  <span className={`font-black text-lg ${formData.frequency === opt.value ? themeColors.text : 'text-gray-700 dark:text-gray-300'}`}>{opt.label}</span>
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center transition-all ${formData.frequency === opt.value ? `${themeColors.primary} text-white scale-110` : 'bg-gray-100 dark:bg-gray-700 text-transparent'}`}>
                    <Check size={18} />
                  </div>
                </button>
              ))}
            </div>
          </div>
        );

      case 8:
        return (
          <div className="space-y-8 animate-in fade-in duration-300">
            <h2 className="text-2xl font-black text-gray-900 dark:text-white text-center">{t.finalDetailsLabel}</h2>
            <div className="relative">
              <textarea
                value={formData.finalDetails}
                onChange={(e) => setFormData({ ...formData, finalDetails: e.target.value })}
                placeholder={t.finalDetailsPlaceholder}
                className={`w-full h-48 p-6 rounded-3xl border-2 border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 dark:text-white focus:${themeColors.border} focus:ring-4 focus:${themeColors.ring} outline-none transition-all text-xl font-medium shadow-sm resize-none`}
              />
              <div className="absolute top-4 right-4 text-gray-300 pointer-events-none">
                <Info size={24} />
              </div>
            </div>
            <button
              onClick={handleGenerate}
              disabled={loading}
              className={`w-full ${themeColors.primary} text-white py-6 rounded-3xl font-black text-xl flex justify-center items-center gap-3 ${themeColors.hover} transition-all shadow-2xl ${themeColors.shadow} active:scale-95`}
            >
              {loading ? (
                <>
                  <Loader2 className="animate-spin" size={24} />
                  {t.loading}
                </>
              ) : (
                <>
                  <Sparkles size={24} />
                  {t.generate}
                </>
              )}
            </button>
          </div>
        );

      case 9:
        if (!output) return null;
        return (
          <div className="space-y-8 animate-in fade-in zoom-in-95 duration-500">
            <div className="flex bg-white/80 dark:bg-gray-800/80 backdrop-blur-md rounded-[2rem] p-2 shadow-xl border border-gray-100 dark:border-gray-700 sticky top-4 z-20 overflow-x-auto no-scrollbar gap-1">
              {[
                { id: 'calendar', icon: Calendar, label: t.calendarTab, color: themeColors.text },
                { id: 'captions', icon: FileText, label: t.captionsTab, color: 'text-emerald-500' },
                { id: 'hashtags', icon: Hash, label: t.hashtagsTab, color: 'text-amber-500' },
                { id: 'ideas', icon: Lightbulb, label: t.ideasTab, color: 'text-purple-500' },
              ].map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`flex-1 flex items-center justify-center gap-2 px-6 py-4 rounded-2xl whitespace-nowrap transition-all duration-300 ${
                    activeTab === tab.id 
                      ? `${themeColors.primary} text-white shadow-lg ${themeColors.shadow} scale-[1.02]` 
                      : 'text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700 hover:text-gray-900 dark:hover:text-white'
                  }`}
                >
                  <tab.icon size={20} className={activeTab === tab.id ? 'text-white' : tab.color} />
                  <span className="text-base font-black">{tab.label}</span>
                </button>
              ))}
            </div>

            <div className="mt-6 pb-12">
              {activeTab === 'calendar' && (
                <div className="space-y-5 animate-in fade-in slide-in-from-top-4">
                  {output.calendar.map((item, i) => (
                    <div key={i} className="bg-white dark:bg-gray-800 p-6 rounded-[2rem] border border-gray-100 dark:border-gray-700 shadow-sm flex items-center gap-6 hover:shadow-md transition-shadow group">
                      <div className={`w-16 h-16 ${themeColors.bgLight} ${themeColors.text} rounded-2xl flex items-center justify-center flex-shrink-0 font-black text-xl shadow-inner group-hover:${themeColors.primary} group-hover:text-white transition-colors`}>
                        {i + 1}
                      </div>
                      <div className="flex-1">
                        <div className="flex flex-wrap items-center gap-2 mb-2">
                          <span className="text-xs font-black px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400 rounded-lg uppercase tracking-wider">{item.day}</span>
                          <span className={`text-xs font-black px-2 py-1 ${themeColors.bgLight} ${themeColors.text} rounded-lg uppercase tracking-wider`}>{item.type}</span>
                        </div>
                        <h3 className="font-black text-xl text-gray-900 dark:text-white">{item.title}</h3>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {activeTab === 'captions' && (
                <div className="space-y-8 animate-in fade-in slide-in-from-top-4">
                  <p className="text-sm text-gray-400 dark:text-gray-500 font-bold px-2 flex items-center gap-2">
                    <Pencil size={14} /> {t.editNotice}
                  </p>
                  {output.captions.map((cap, i) => (
                    <div key={i} className="bg-white dark:bg-gray-800 rounded-[2.5rem] border border-gray-100 dark:border-gray-700 overflow-hidden shadow-sm hover:shadow-md transition-shadow">
                      <div className="p-6 bg-gray-50/50 dark:bg-gray-900/50 border-b border-gray-100 dark:border-gray-700 flex justify-between items-center flex-wrap gap-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-emerald-100 dark:bg-emerald-900/50 text-emerald-600 dark:text-emerald-400 rounded-xl flex items-center justify-center font-black">
                            {i + 1}
                          </div>
                          <span className="font-black text-lg text-gray-900 dark:text-white">{cap.title}</span>
                        </div>
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleShare(cap.text, cap.title)}
                            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-black bg-white dark:bg-gray-700 text-blue-500 hover:bg-gray-50 dark:hover:bg-gray-600 border border-gray-100 dark:border-gray-600 transition-all shadow-sm`}
                          >
                            <Share2 size={16} />
                          </button>
                          <button
                            onClick={() => copyToClipboard(cap.text, `cap-${i}`)}
                            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-black transition-all ${
                              copiedId === `cap-${i}` 
                                ? 'bg-emerald-500 text-white' 
                                : `bg-white dark:bg-gray-700 ${themeColors.text} hover:bg-gray-50 dark:hover:bg-gray-600 border border-gray-100 dark:border-gray-600`
                            }`}
                          >
                            {copiedId === `cap-${i}` ? <Check size={16} /> : <Copy size={16} />}
                            {copiedId === `cap-${i}` ? t.copied : t.copy}
                          </button>
                        </div>
                      </div>
                      <textarea
                        value={cap.text}
                        onChange={(e) => handleCaptionChange(i, e.target.value)}
                        className="w-full min-h-[200px] p-8 text-gray-800 dark:text-gray-200 text-lg leading-relaxed font-fa tracking-wide bg-transparent outline-none resize-none focus:ring-2 focus:ring-emerald-500/20"
                      />
                    </div>
                  ))}
                </div>
              )}

              {activeTab === 'hashtags' && (
                <div className="bg-white dark:bg-gray-800 p-8 rounded-[3rem] border border-gray-100 dark:border-gray-700 shadow-sm animate-in fade-in slide-in-from-top-4">
                  <div className="flex justify-between items-center mb-10 flex-wrap gap-4">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-amber-50 dark:bg-amber-900/30 text-amber-500 rounded-2xl flex items-center justify-center">
                        <Hash size={24} />
                      </div>
                      <h3 className="font-black text-2xl text-gray-900 dark:text-white">{t.hashtagsTab}</h3>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleShare(output.hashtags.join(' '), t.hashtagsTab)}
                        className={`flex items-center gap-2 px-6 py-3 rounded-2xl text-sm font-black bg-white dark:bg-gray-700 text-blue-500 hover:bg-gray-50 dark:hover:bg-gray-600 border border-gray-100 dark:border-gray-600 transition-all shadow-lg`}
                      >
                        <Share2 size={18} />
                      </button>
                      <button
                        onClick={() => copyToClipboard(output.hashtags.join(' '), 'hashtags')}
                        className={`flex items-center gap-2 px-6 py-3 rounded-2xl text-sm font-black transition-all ${
                          copiedId === 'hashtags' 
                            ? 'bg-emerald-500 text-white shadow-lg' 
                            : `${themeColors.primary} text-white ${themeColors.hover} shadow-lg ${themeColors.shadow}`
                        }`}
                      >
                        {copiedId === 'hashtags' ? <Check size={18} /> : <Copy size={18} />}
                        {copiedId === 'hashtags' ? t.copied : t.copy}
                      </button>
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-3">
                    {output.hashtags.map((tag, i) => (
                      <span key={i} className="bg-gray-50 dark:bg-gray-700 border border-gray-100 dark:border-gray-600 hover:border-amber-200 hover:bg-amber-50 dark:hover:bg-amber-900/30 px-5 py-2.5 rounded-2xl text-amber-600 dark:text-amber-400 font-black text-base transition-colors cursor-default shadow-sm">
                        #{tag.replace('#', '')}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {activeTab === 'ideas' && (
                <div className="space-y-10 animate-in fade-in slide-in-from-top-4">
                  <section>
                    <div className="flex items-center gap-4 mb-6">
                      <div className="w-14 h-14 bg-pink-100 dark:bg-pink-900/30 text-pink-500 rounded-2xl flex items-center justify-center shadow-sm">
                        <Zap size={28} />
                      </div>
                      <h3 className="text-2xl font-black text-gray-900 dark:text-white">
                        {lang === 'fa' ? 'ایده‌های استوری' : 'Story Ideas'}
                      </h3>
                    </div>
                    <div className="grid grid-cols-1 gap-4">
                      {output.storyIdeas.map((idea, i) => (
                        <div key={i} className="p-6 bg-pink-50/40 dark:bg-pink-900/10 border border-pink-100/50 dark:border-pink-900/30 rounded-3xl text-lg font-bold text-pink-900 dark:text-pink-300 shadow-sm hover:shadow-md transition-shadow">
                          <div className="flex gap-4">
                            <span className="text-pink-300 dark:text-pink-700">#0{i+1}</span>
                            {idea}
                          </div>
                        </div>
                      ))}
                    </div>
                  </section>
                  <section>
                    <div className="flex items-center gap-4 mb-6">
                      <div className="w-14 h-14 bg-purple-100 dark:bg-purple-900/30 text-purple-600 rounded-2xl flex items-center justify-center shadow-sm">
                        <Film size={28} />
                      </div>
                      <h3 className="text-2xl font-black text-gray-900 dark:text-white">
                        {lang === 'fa' ? 'سناریوهای ریلز' : 'Reel Scenarios'}
                      </h3>
                    </div>
                    <div className="grid grid-cols-1 gap-4">
                      {output.reelIdeas.map((idea, i) => (
                        <div key={i} className="p-6 bg-purple-50/40 dark:bg-purple-900/10 border border-purple-100/50 dark:border-purple-900/30 rounded-3xl text-lg font-bold text-purple-900 dark:text-purple-300 shadow-sm hover:shadow-md transition-shadow">
                          <div className="flex gap-4">
                            <span className="text-purple-300 dark:text-purple-700">#0{i+1}</span>
                            {idea}
                          </div>
                        </div>
                      ))}
                    </div>
                  </section>
                </div>
              )}
            </div>
            
            <button
              onClick={() => setStep(0)}
              className="w-full py-6 text-gray-400 dark:text-gray-500 font-black hover:text-gray-900 dark:hover:text-white transition-colors bg-white dark:bg-gray-800 rounded-3xl border-2 border-dashed border-gray-100 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600 mb-8"
            >
              {lang === 'fa' ? '← بازگشت و شروع مجدد' : '← Back and Restart'}
            </button>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className={`min-h-screen bg-gray-50 dark:bg-gray-950 flex flex-col items-center p-4 sm:p-10 transition-colors duration-500 ${lang === 'fa' ? 'font-fa' : 'font-en'}`}>
      <header className="w-full max-w-2xl flex flex-col sm:flex-row justify-between items-center gap-4 mb-16 mt-4">
        <div className="flex items-center gap-4 group cursor-pointer" onClick={() => setStep(0)}>
          <div className={`${themeColors.primary} p-3 rounded-2xl text-white shadow-xl ${themeColors.shadow} group-hover:scale-110 transition-transform`}>
            <Instagram size={32} />
          </div>
          <span className="font-black text-2xl tracking-tighter text-gray-900 dark:text-white">{t.appName}</span>
        </div>
        <div className="flex items-center gap-2">
          <ThemeSelector 
            theme={theme} 
            mode={mode} 
            onThemeChange={setTheme} 
            onModeToggle={() => setMode(m => m === 'light' ? 'dark' : 'light')} 
          />
          <LanguageSwitcher current={lang} onChange={setLang} />
        </div>
      </header>

      <main className="w-full max-w-2xl flex-1">
        {step > 0 && step <= TOTAL_STEPS && (
          <div className="mb-12 flex items-center gap-6">
            <button 
              onClick={handlePrev} 
              className="p-3 text-gray-400 dark:text-gray-500 hover:text-gray-900 dark:hover:text-white transition-all bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 hover:shadow-md active:scale-90"
            >
              {lang === 'fa' ? <ChevronRight size={28} /> : <ChevronLeft size={28} />}
            </button>
            <div className="flex-1 bg-gray-200 dark:bg-gray-800 h-3 rounded-full overflow-hidden shadow-inner">
              <div 
                className={`${themeColors.primary} h-full transition-all duration-500 ease-out shadow-[0_0_10px_rgba(59,130,246,0.5)]`}
                style={{ width: `${(step / TOTAL_STEPS) * 100}%` }}
              />
            </div>
            <span className="text-sm font-black text-gray-400 dark:text-gray-500 whitespace-nowrap">{t.step} {step} / {TOTAL_STEPS}</span>
          </div>
        )}

        <div className={`transition-all duration-300 ${loading ? 'opacity-40 grayscale pointer-events-none scale-[0.98]' : 'opacity-100 scale-100'}`}>
          {renderFormStep()}
        </div>
      </main>

      <ChatBot lang={lang} t={t} themeColor={theme} />

      <footer className="w-full max-w-2xl py-12 text-center border-t border-gray-200 dark:border-gray-800 mt-20">
        <p className="text-gray-400 dark:text-gray-500 font-bold text-base flex items-center justify-center gap-2">
          Made with <Sparkles size={16} className={themeColors.text} /> by Gemini AI 
        </p>
        <p className="text-gray-300 dark:text-gray-600 text-xs mt-2 uppercase tracking-widest font-black">
          Bilingual Persian-English Content Platform
        </p>
      </footer>
    </div>
  );
};

export default App;
