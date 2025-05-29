import React from 'react';
import { useTranslation } from 'react-i18next';
import { Button } from './ui/button'; // Assuming you have a Button component

const LanguageToggle: React.FC = () => {
  const { i18n } = useTranslation();

  const toggleLanguage = (lang: string) => {
    i18n.changeLanguage(lang);
  };

  return (
    <div className="flex space-x-2">
      <Button
        variant={i18n.language === 'en' ? 'default' : 'outline'}
        onClick={() => toggleLanguage('en')}
      >
        EN
      </Button>
      <Button
        variant={i18n.language === 'fr-CA' ? 'default' : 'outline'}
        onClick={() => toggleLanguage('fr-CA')}
      >
        FR
      </Button>
    </div>
  );
};

export default LanguageToggle;