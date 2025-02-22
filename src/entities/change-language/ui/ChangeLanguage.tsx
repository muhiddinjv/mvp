import { LANGUAGES } from '@shared/constants';
import { LanguageType } from '@shared/types';
import { Select } from 'antd';
import { useChangeLanguage } from '../model/useChangeLanguage';

const languagesType: { label: keyof typeof LANGUAGES; value: LanguageType }[] = [
  {
    label: 'En',
    value: LANGUAGES.En,
  },
  {
    label: 'Uzb',
    value: LANGUAGES.Uzb,
  },
  {
    label: 'Ru',
    value: LANGUAGES.Ru,
  },
];

export const ChangeLanguage = () => {
  const { onChangeLanguage } = useChangeLanguage();

  const handleChange = (value: LanguageType) => {
    onChangeLanguage(value);
  };

  return <Select defaultValue={LANGUAGES.En} onChange={handleChange} options={languagesType} />;
};
