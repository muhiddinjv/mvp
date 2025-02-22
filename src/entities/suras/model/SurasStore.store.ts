import { sortNumber } from '@entities/suras/utils';
import { create, StateCreator } from 'zustand';
import { devtools } from 'zustand/middleware';
import { immer } from 'zustand/middleware/immer';
import { SortDirection, SurasKeys, SurasStore } from '../types';

const defaultSortedKeysDirection: Record<SurasKeys, SortDirection> = {
  id: 'none',
  words: 'none',
  sajda: 'none',
  verses: 'none',
};

const surasStateCreator: StateCreator<SurasStore, [], [['zustand/devtools', never], ['zustand/immer', never]]> = (
  set,
  get
) => ({
  suras: [],
  sortedSuras: [],
  sortedKeysDirection: { ...defaultSortedKeysDirection, id: 'up' },

  setSuras: suras => {
    set({ suras, sortedSuras: [...suras] });
  },

  sortSuras: (key, direction = 'up') => {
    const { sortedSuras } = get();
    const sortedSurasNext = sortedSuras.sort((surah1, surah2) => {
      const a = Array.isArray(surah1[key]) ? surah1[key][0] : surah1[key];
      const b = Array.isArray(surah2[key]) ? surah2[key][0] : surah2[key];

      return sortNumber(a || 0, b || 0, direction);
    });

    set({
      sortedSuras: [...sortedSurasNext],

      sortedKeysDirection: {
        ...defaultSortedKeysDirection,
        [key]: direction,
      },
    });
  },
});

export const useSurasStore = create<SurasStore>()(devtools(immer(surasStateCreator), { name: 'SurasStore' }));
