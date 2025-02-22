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
  sajda: number[] | null;
};

export type SurasKeys = keyof Pick<Suras, 'id' | 'verses' | 'words' | 'sajda'>;
export type SortDirection = 'up' | 'down' | 'none';

export type SurasStore = {
  suras: Suras[];
  sortedSuras: Suras[];
  sortedKeysDirection: Record<SurasKeys, SortDirection>;

  setSuras: (suras: Suras[]) => void;
  sortSuras: (key: SurasKeys, direction?: SortDirection) => void;
};
