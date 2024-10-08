import { useEffect, useRef } from 'react';
import { useModalDataStore } from '~/stores/modal';

export default function Modal() {
  const modalRef = useRef<HTMLDivElement>(null);

  const data = useModalDataStore((state) => state.data);
  const setData = useModalDataStore((state) => state.setData);

  useEffect(() => {
    if (data) {
      const currentModalRef = modalRef.current!;

      setTimeout(() => {
        currentModalRef.classList.remove('opacity-0');
        currentModalRef.classList.add('opacity-1');
      }, 1);

      return () => {
        setTimeout(() => {
          currentModalRef.classList.remove('opacity-1');
          currentModalRef.classList.add('opacity-0');
        }, 1);
      };
    }

    return undefined;
  }, [data]);

  if (!data) return null;

  return (
    <div
      ref={modalRef}
      className="fixed left-0 top-0 flex h-dvh w-dvw items-center justify-center bg-black/60 opacity-0 transition-opacity"
    >
      <div className="min-h-72 w-[500px] rounded-2xl bg-neutral-50 dark:bg-neutral-950 p-6 shadow-[0px_4px_60px_rgba(19,19,19,.08)]">
        <div
          className={`mb-4 flex size-16 items-center justify-center rounded-full ${
            data.level === 'info'
              ? 'bg-blue-300'
              : data.level === 'warning'
                ? 'bg-orange-300'
                : 'bg-red-300'
          }`}
        >
          <span
            className={`material-symbols-rounded size-9 !text-[36px] ${
              data.level === 'info'
                ? 'text-blue-600'
                : data.level === 'warning'
                  ? 'text-orange-500'
                  : 'text-red-600'
            }`}
          >
            error
          </span>
        </div>

        <div className="mb-4 inline-flex flex-col gap-4">
          <h3 className="text-[22px] font-bold text-neutral-900 dark:text-neutral-100">
            {data.title || 'Whoopsie, we ran into an error...'}
          </h3>

          <p className="text-neutral-900 dark:text-neutral-100">
            {data.message ||
              'We are sorry, but something went wrong. Please try again later.'}
          </p>

          {data?.level === 'error' && (
            <p className="text-sm text-neutral-500">
              Error Code:&nbsp;
              {data.status || 'HTTP 500'}
            </p>
          )}
        </div>

        <div className="flex justify-end gap-4">
          <button
            type="button"
            className="flex h-12 items-center rounded-lg bg-neutral-800 dark:bg-neutral-100 px-6 text-neutral-100 dark:text-neutral-800 transition-colors hover:bg-neutral-700 dark:hover:bg-neutral-200 active:bg-neutral-600 dark:active:bg-neutral-300"
            onClick={() => {
              const currentModalRef = modalRef.current!;
              currentModalRef.classList.remove('opacity-1');
              currentModalRef.classList.add('opacity-0');

              setTimeout(() => {
                setData(null);
              }, 200);
            }}
          >
            Confirm
          </button>
        </div>
      </div>
    </div>
  );
}
