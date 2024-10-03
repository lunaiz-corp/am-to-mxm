export interface IModalData {
  level: 'error' | 'warning' | 'info';

  status?: string;
  title?: string;
  message?: string;
}
