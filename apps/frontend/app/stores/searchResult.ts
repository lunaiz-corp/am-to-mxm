/* eslint-disable import/prefer-default-export */
import { SearchResult } from '@packages/grpc/__generated__/am2mxm-api';
import { create } from 'zustand';

interface ISearchResult {
  result: SearchResult | null;
  setResult: (result: SearchResult) => void;
}

export const useSearchResultStore = create<ISearchResult>((set) => ({
  result: null,
  setResult: (result) => set({ result }),
}));
