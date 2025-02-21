export type SurasType = 'meccan' | 'medinan';

export type Suras = {
  id: number;
  text: {
    ar: string;
    tr: string;
    en: string;
    ru: string;
  };
  type: SurasType;
  verses: number;
  words: number;
  chars: number;
  sajda: null;
};

export type SurasStore = {
  suras: Suras[];

  setSuras: (suras: Suras[]) => void;
};
