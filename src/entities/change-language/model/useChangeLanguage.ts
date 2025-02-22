import { useState } from 'react';
import { useTranslation } from 'react-i18next';

export const useChangeLanguage = () => {
  const { i18n } = useTranslation();
  const [isLoading, setIsLoading] = useState(false);

  const onChangeLanguage = (lng?: string) => {
    setIsLoading(true);

    i18n.changeLanguage(lng).finally(() => setIsLoading(false));
  };

  return {
    isLoading,
    onChangeLanguage,
  };
};
