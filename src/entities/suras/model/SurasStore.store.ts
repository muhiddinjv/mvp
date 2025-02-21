import { createStore } from '@shared/lib/zustand';
import { SurasStore } from './types';

export const useSurasStore = createStore<SurasStore>(set => ({
  suras: [],

  setSuras: suras => {
    set({ suras });
  },
}));
