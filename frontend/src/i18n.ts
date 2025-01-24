import i18n from 'i18next';
import {initReactI18next} from 'react-i18next';
import translationEN from './locales/en/translations.json';
import translationBE from './locales/be/translations.json';

const resources = {
    en: {
        translation: translationEN
    },
    be: {
        translation: translationBE
    }
};

i18n
    .use(initReactI18next)
    .init({
        resources,
        lng: 'en',
        fallbackLng: 'en',
        interpolation: {
            escapeValue: false
        }
    });

export default i18n;