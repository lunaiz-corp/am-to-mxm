import { useMemo, useState } from 'react';

import {
  AdjustmentsHorizontalIcon,
  ComputerDesktopIcon,
  KeyIcon,
  MoonIcon,
  SunIcon,
  XMarkIcon,
} from '@heroicons/react/24/outline';

import {
  ByokQuery,
  ByokClient as ByokServiceClient,
} from '@packages/grpc/__generated__/am2mxm-api';
import { Empty } from '@packages/grpc/__generated__/google/protobuf/empty';

import { toggleTheme } from '~/utils/theme';
import { encodeRsa } from '~/utils/byokRsaEncrypt';
import { useThemeStore } from '~/stores/layout/theme';
import { useModalDataStore } from '~/stores/layout/modal';

export default function BottomSettings() {
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  const theme = useThemeStore((state) => state.theme);
  const setTheme = useThemeStore((state) => state.setTheme);

  const setModal = useModalDataStore((state) => state.setData);

  const [mxmByokKey, setMxmByokKey] = useState<string | null>(null);
  const [amByokTeamId, setAmByokTeamId] = useState<string | null>(null);
  const [amByokMusicKitId, setAmByokMusicKitId] = useState<string | null>(null);
  const [amByokKey, setAmByokKey] = useState<string | null>(null);

  const client = useMemo(
    () => new ByokServiceClient(import.meta.env.VITE_API_URL),
    [],
  );

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
              // setModal({
              //   level: 'info',
              //   type: 'alert',

              //   title: 'Not available yet',
              //   message:
              //     'This feature is still under development. Please check back later.',
              // });

              setModal({
                level: 'info',
                type: 'prompt',

                title: 'Set your own API key',
                message:
                  'You can set up your own API key to reduce rate limiting errors.\nYour key is encrypted and stored in your browser, not on a server or DB.\n[👉 How can I get my own API Key?](https://lunaiz.rdbl.io/8255520465/am2mxm-guide#how-can-i-get-my-own-api-key%3F)',

                promptInput: [
                  {
                    type: 'password',
                    placeholder: 'Enter your Musixmatch API Key',
                    value: [mxmByokKey, setMxmByokKey],
                  },
                  {
                    type: 'divider',
                    value: [null, () => null],
                  },
                  {
                    type: 'text',
                    placeholder: 'Enter your Apple Team ID',
                    value: [amByokTeamId, setAmByokTeamId],
                  },
                  {
                    type: 'text',
                    placeholder: 'Enter your Apple MusicKit Key ID',
                    value: [amByokMusicKitId, setAmByokMusicKitId],
                  },
                  {
                    type: 'file',
                    placeholder: 'Apple MusicKit Key (.p8)',
                    value: [amByokKey, setAmByokKey],
                  },
                ],

                onConfirm: async () => {
                  // TODO: Work out the algorithm for check the key is valid and set on the localStorage / cookie
                  const encodedMxmKey = await encodeRsa(mxmByokKey!);
                  console.log(encodedMxmKey);
                },
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
