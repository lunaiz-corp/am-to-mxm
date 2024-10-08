/* eslint-disable import/prefer-default-export */
import { create } from 'zustand';

interface IThemeStore {
  theme: '' | 'system_light' | 'system_dark' | 'light' | 'dark';
  setTheme: (theme: 'system_light' | 'system_dark' | 'light' | 'dark') => void;
}

export const useThemeStore = create<IThemeStore>((set) => ({
  theme: '',
  setTheme: (theme) => {
    if (theme.startsWith('system_')) {
      localStorage.removeItem('theme');
    } else {
      localStorage.setItem('theme', theme);
    }

    if (theme.includes('light')) {
      document.body.classList.remove('dark');
    } else {
      document.body.classList.add('dark');
    }

    set({ theme });
  },
}));
