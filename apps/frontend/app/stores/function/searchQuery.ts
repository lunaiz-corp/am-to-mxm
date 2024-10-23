/* eslint-disable import/prefer-default-export */
import { create } from 'zustand';

interface ISearchQuery {
  query: string;
  setQuery: (query: string) => void;
}

export const useSearchQueryStore = create<ISearchQuery>((set) => ({
  query: '',
  setQuery: (query) => set({ query }),
}));
