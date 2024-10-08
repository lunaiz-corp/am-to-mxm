import { useState } from 'react';

import {
  AdjustmentsHorizontalIcon,
  ComputerDesktopIcon,
  KeyIcon,
  MoonIcon,
  SunIcon,
  XMarkIcon,
} from '@heroicons/react/24/outline';

import { toggleTheme } from '~/utils/theme';
import { useThemeStore } from '~/stores/theme';
import { useModalDataStore } from '~/stores/modal';

export default function BottomSettings() {
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  const theme = useThemeStore((state) => state.theme);
  const setTheme = useThemeStore((state) => state.setTheme);

  const setModal = useModalDataStore((state) => state.setData);

  return (
    <div className="absolute bottom-8 right-6 flex flex-col-reverse gap-4">
      {/* Settings toggle button */}
      <button
        type="button"
        className="relative flex size-16 items-center justify-center rounded-full bg-black/20 backdrop-blur-lg dark:bg-black/40"
        title="Settings"
        onClick={() => setIsSettingsOpen((x) => !x)}
      >
        <AdjustmentsHorizontalIcon
          className={`absolute left-1/2 top-1/2 size-7 -translate-x-1/2 -translate-y-1/2 stroke-neutral-950 stroke-2 !transition-opacity dark:stroke-neutral-50 ${
            isSettingsOpen ? 'opacity-0' : 'opacity-100'
          }`}
        />

        <XMarkIcon
          className={`absolute left-1/2 top-1/2 size-7 -translate-x-1/2 -translate-y-1/2 stroke-neutral-950 stroke-2 !transition-opacity dark:stroke-neutral-50 ${
            !isSettingsOpen ? 'opacity-0' : 'opacity-100'
          }`}
        />
      </button>

      {isSettingsOpen && (
        <>
          {/* Darkmode toggle */}
          <button
            type="button"
            className="relative z-10 flex size-16 items-center justify-center rounded-full bg-black/20 backdrop-blur-lg dark:bg-black/40"
            title={
              theme.startsWith('system')
                ? 'Change to light mode'
                : theme === 'dark'
                  ? 'Change to system mode'
                  : 'Change to dark mode'
            }
            onClick={() => {
              toggleTheme(theme, setTheme);
            }}
          >
            <SunIcon
              className={`absolute left-1/2 top-1/2 size-7 -translate-x-1/2 -translate-y-1/2 ${theme === 'system_dark' ? 'stroke-neutral-50' : 'stroke-neutral-950'} !transition-opacity !duration-75 ${
                !theme.startsWith('system') ? 'opacity-0' : 'opacity-100'
              }`}
            />

            <MoonIcon
              className={`absolute left-1/2 top-1/2 size-7 -translate-x-1/2 -translate-y-1/2 stroke-neutral-950 !transition-opacity !duration-75 ${
                theme !== 'light' ? 'opacity-0' : 'opacity-100'
              }`}
            />

            <ComputerDesktopIcon
              className={`absolute left-1/2 top-1/2 size-7 -translate-x-1/2 -translate-y-1/2 stroke-neutral-50 !transition-opacity !duration-75 ${
                theme !== 'dark' ? 'opacity-0' : 'opacity-100'
              }`}
            />
          </button>

          {/* Bring-Your-Own-Key */}
          <button
            type="button"
            className="relative flex size-16 items-center justify-center rounded-full bg-black/20 backdrop-blur-lg dark:bg-black/40"
            title="Bring-Your-Own-Key Setup (Coming soon)"
            onClick={() => {
              setIsSettingsOpen(false);
              setModal({
                level: 'info',

                title: 'Not available yet',
                message:
                  'This feature is still under development. Please check back later.',
              });
            }}
          >
            <KeyIcon className="absolute left-1/2 top-1/2 size-6 -translate-x-1/2 -translate-y-1/2 stroke-neutral-950 dark:stroke-neutral-50" />
          </button>
        </>
      )}
    </div>
  );
}
