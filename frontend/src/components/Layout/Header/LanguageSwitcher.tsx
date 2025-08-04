import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Globe, ChevronDown } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import styles from './LanguageSwitcher.module.css';

interface Language {
  code: string;
  name: string;
  flag: string;
}

const languages: Language[] = [
  { code: 'en', name: 'English', flag: '🇺🇸' },
  { code: 'ar', name: 'العربية', flag: '🇸🇦' },
  { code: 'fr', name: 'Français', flag: '🇫🇷' },
];

export default function LanguageSwitcher() {
  const router = useRouter();
  const { i18n } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);

  // Load saved language on mount
  useEffect(() => {
    const savedLanguage = localStorage.getItem('i18nextLng');
    if (savedLanguage && savedLanguage !== i18n.language) {
      i18n.changeLanguage(savedLanguage);
      document.documentElement.lang = savedLanguage;
      document.documentElement.dir = savedLanguage === 'ar' ? 'rtl' : 'ltr';
    } else if (!savedLanguage) {
      // If no saved language, ensure English is set
      i18n.changeLanguage('en');
      document.documentElement.lang = 'en';
      document.documentElement.dir = 'ltr';
    }
  }, [i18n]);

  // Get current locale from i18n
  const currentLocale = i18n.language;
  const currentLanguage = languages.find(lang => lang.code === currentLocale) || languages[0];

  const handleLanguageChange = (languageCode: string) => {
    // Change the language using react-i18next
    i18n.changeLanguage(languageCode);
    
    // Update the HTML lang attribute
    document.documentElement.lang = languageCode;
    document.documentElement.dir = languageCode === 'ar' ? 'rtl' : 'ltr';
    
    // Save to localStorage for persistence
    localStorage.setItem('i18nextLng', languageCode);
    
    setIsOpen(false);
  };

  return (
    <div className={styles.languageSwitcher}>
      <button
        className={styles.languageButton}
        onClick={() => setIsOpen(!isOpen)}
        onBlur={() => setTimeout(() => setIsOpen(false), 150)}
        type="button"
      >
        <Globe className={styles.globeIcon} size={18} />
        <span className={styles.currentLanguage}>
          <span className={styles.flag}>{currentLanguage.flag}</span>
          <span className={styles.languageName}>{currentLanguage.name}</span>
        </span>
        <ChevronDown 
          className={`${styles.chevron} ${isOpen ? styles.chevronOpen : ''}`} 
          size={16} 
        />
      </button>

      {isOpen && (
        <div className={styles.dropdown}>
          {languages.map((language) => (
            <button
              key={language.code}
              className={`${styles.languageOption} ${
                language.code === currentLocale ? styles.active : ''
              }`}
              onClick={() => handleLanguageChange(language.code)}
              type="button"
            >
              <span className={styles.flag}>{language.flag}</span>
              <span className={styles.languageName}>{language.name}</span>
              {language.code === currentLocale && (
                <span className={styles.checkmark}>✓</span>
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );
} 