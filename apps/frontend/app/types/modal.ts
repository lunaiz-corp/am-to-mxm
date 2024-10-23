import { Dispatch, SetStateAction } from 'react';

export interface IModalData {
  type: 'alert' | 'prompt';
  level: 'error' | 'warning' | 'info';

  status?: string;

  title?: string;
  message?: string;

  promptInput?: {
    type: 'text' | 'password' | 'file' | 'divider';
    placeholder?: string;

    value: [string | null, Dispatch<SetStateAction<string | null>>];
    maxLength?: number;
  }[];

  onConfirm?: () => void;
}
