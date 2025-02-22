import { initReactI18next } from 'react-i18next';
import { LANGUAGES } from '@shared/constants';
import i18n from 'i18next';
import HttpBackend from 'i18next-http-backend';

i18n
  .use(HttpBackend) // Подключаем плагин для загрузки JSON
  .use(initReactI18next)
  .init({
    lng: LANGUAGES.En,
    fallbackLng: LANGUAGES.Uzb,
    backend: {
      loadPath: '/locales/{{lng}}.json', // Путь к файлам
    },
    interpolation: {
      escapeValue: false,
    },
  });

export default i18n;
