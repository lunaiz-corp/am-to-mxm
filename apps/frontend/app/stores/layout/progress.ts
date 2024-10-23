/* eslint-disable import/prefer-default-export */
import { create } from 'zustand';

interface IProgressStore {
  progress: number; // between 0-1
  setProgress: (progress: number) => void;

  indeterminate: boolean;
  setIndeterminate: (indeterminate: boolean) => void;

  indicatorNeeded: boolean;
  setIndicatorNeeded: (indicatorNeeded: boolean) => void;
}

export const useProgressStore = create<IProgressStore>((set) => ({
  progress: 1,
  setProgress: (progress) => set({ progress }),

  indeterminate: true,
  setIndeterminate: (indeterminate) => set({ indeterminate }),

  indicatorNeeded: false,
  setIndicatorNeeded: (indicatorNeeded) => set({ indicatorNeeded }),
}));
