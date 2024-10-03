/* eslint-disable import/prefer-default-export */
import { create } from 'zustand';
import { IModalData } from '~/types/modal';

interface IModalDataStore {
  data: IModalData | null;
  setData: (data: IModalData | null) => void;
}

export const useModalDataStore = create<IModalDataStore>((set) => ({
  data: null,
  setData: (data) => set({ data }),
}));
