'use client';

import React, { createContext, useContext, useEffect, useState, useMemo } from 'react';
import { translations, Language } from './translations';

export interface DateParts {
  datePrimary: string;
  dateSecondary: string;
}

export interface TimeParts {
  time: string;
  period: string;
}

interface I18nContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  toggleLanguage: () => void;
  t: typeof translations['hi'];
  formatDate: (dateString: string) => string;
  formatDateParts: (dateString: string) => DateParts;
  formatTime: (dateString: string) => string;
  formatTimeParts: (dateString: string) => TimeParts;
  formatDuration: (seconds: number) => string;
  formatNumber: (value: number) => string;
}

const I18nContext = createContext<I18nContextType | null>(null);

const STORAGE_KEY = 'milking_tracker_language';

const HINDI_MONTHS = [
  'जनवरी', 'फ़रवरी', 'मार्च', 'अप्रैल', 'मई', 'जून',
  'जुलाई', 'अगस्त', 'सितंबर', 'अक्टूबर', 'नवंबर', 'दिसंबर'
];

export function I18nProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguageState] = useState<Language>('hi');

  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY) as Language | null;
      if (saved === 'hi' || saved === 'en') {
        setLanguageState(saved);
      }
    } catch {
      // ignore
    }
  }, []);

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    try {
      localStorage.setItem(STORAGE_KEY, lang);
    } catch {
      // ignore
    }
  };

  const toggleLanguage = () => {
    setLanguage(language === 'hi' ? 'en' : 'hi');
  };

  const t = translations[language];

  const formatDate = (dateString: string) => {
    const d = new Date(dateString);
    if (language === 'hi') {
      const day = d.getDate();
      const month = HINDI_MONTHS[d.getMonth()];
      const year = d.getFullYear();
      return `${day} ${month} ${year}`;
    }
    return d.toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const formatDateParts = (dateString: string): DateParts => {
    const d = new Date(dateString);
    const day = d.getDate();
    const year = d.getFullYear().toString();
    if (language === 'hi') {
      const month = HINDI_MONTHS[d.getMonth()];
      return {
        datePrimary: `${day} ${month}`,
        dateSecondary: year
      };
    }
    const month = d.toLocaleDateString('en-IN', { month: 'short' });
    return {
      datePrimary: `${day} ${month}`,
      dateSecondary: year
    };
  };

  const formatTime = (dateString: string) => {
    const d = new Date(dateString);
    let hours = d.getHours();
    const minutes = d.getMinutes().toString().padStart(2, '0');
    
    if (language === 'hi') {
      const period = hours < 12 ? 'सुबह' : hours < 16 ? 'दोपहर' : 'शाम';
      const displayHours = hours % 12 || 12;
      return `${period} ${displayHours}:${minutes}`;
    }

    return d.toLocaleTimeString('en-IN', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    });
  };

  const formatTimeParts = (dateString: string): TimeParts => {
    const d = new Date(dateString);
    const hours = d.getHours();
    const minutes = d.getMinutes().toString().padStart(2, '0');
    const displayHours = hours % 12 || 12;

    if (language === 'hi') {
      const period = hours < 12 ? 'सुबह' : hours < 16 ? 'दोपहर' : 'शाम';
      return {
        time: `${displayHours}:${minutes}`,
        period
      };
    }

    return {
      time: `${displayHours}:${minutes}`,
      period: hours < 12 ? 'AM' : 'PM'
    };
  };

  const formatNumber = (value: number) => {
    return new Intl.NumberFormat(language === 'hi' ? 'hi-IN' : 'en-IN', {
      minimumFractionDigits: 1,
      maximumFractionDigits: 2
    }).format(value);
  };

  const formatDuration = (totalSeconds: number) => {
    const safeSecs = Math.max(0, Math.floor(totalSeconds));
    const mins = Math.floor(safeSecs / 60);
    const secs = safeSecs % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const value = useMemo(
    () => ({
      language,
      setLanguage,
      toggleLanguage,
      t,
      formatDate,
      formatDateParts,
      formatTime,
      formatTimeParts,
      formatDuration,
      formatNumber
    }),
    [language, t]
  );

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
}

export function useI18n() {
  const ctx = useContext(I18nContext);
  if (!ctx) {
    throw new Error('useI18n must be used within an I18nProvider');
  }
  return ctx;
}
