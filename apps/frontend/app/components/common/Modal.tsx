import { useEffect, useRef } from 'react';
import Markdown from 'react-markdown';

import { useModalDataStore } from '~/stores/layout/modal';
import rehypeExternalLinks from 'rehype-external-links';

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
      className="fixed left-0 top-0 z-50 flex h-dvh w-dvw items-center justify-center bg-black/60 opacity-0 transition-opacity"
    >
      <div
        className={`min-h-72 w-full rounded-2xl bg-neutral-50 p-6 shadow-[0px_4px_60px_rgba(19,19,19,.08)] md:min-w-[500px] md:max-w-[600px] dark:bg-neutral-950 ${
          data.type === 'prompt' ? 'md:w-full' : 'md:w-min'
        }`}
      >
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

        <div className="mb-4 inline-flex w-full flex-col gap-4">
          <h3 className="text-[22px] font-bold text-neutral-900 dark:text-neutral-100">
            {data.title ||
              (data.type === 'alert' && 'Whoopsie, we ran into an error...')}
          </h3>

          <p className="whitespace-pre-line break-words text-neutral-900 dark:text-neutral-100">
            <Markdown
              className="prose dark:prose-invert prose-a:text-blue-600 dark:prose-a:text-blue-500 prose-a:underline prose-a:mt-4 prose-a:inline-block"
              rehypePlugins={[[rehypeExternalLinks, { target: '_blank' }]]}
            >
              {data.message ||
                (data.type === 'alert'
                  ? 'We are sorry, but something went wrong. Please try again later.'
                  : '')}
            </Markdown>
          </p>

          {data.type === 'prompt' &&
            data.promptInput?.map((input, index) => {
              const [value, setValue] = input.value!;

              return input.type === 'file' ? (
                // eslint-disable-next-line react/no-array-index-key
                <div key={index} className="flex gap-3 py-3">
                  <label
                    htmlFor={`modal__file${index}`}
                    className="shrink-0 text-neutral-900 dark:text-neutral-100"
                  >
                    {`${input.placeholder} :`}
                  </label>

                  <input
                    id={`modal__file${index}`}
                    type={input.type}
                    title={input.placeholder}
                    className="w-full text-neutral-900 dark:text-neutral-100"
                  />
                </div>
              ) : input.type === 'divider' ? (
                <hr
                  // eslint-disable-next-line react/no-array-index-key
                  key={index}
                  className="border-t border-neutral-300 dark:border-neutral-700"
                />
              ) : (
                <input
                  // eslint-disable-next-line react/no-array-index-key
                  key={index}
                  type={input.type}
                  placeholder={input.placeholder}
                  className="break-words rounded-md p-3 text-neutral-900 dark:text-neutral-100"
                  defaultValue={value || ''}
                  onChange={(e) => {
                    setValue(e.target.value);
                  }}
                />
              );
            })}

          {data.type === 'alert' && data.level === 'error' && (
            <p className="text-sm text-neutral-500">
              Error Code:&nbsp;
              {data.status || 'HTTP 500'}
            </p>
          )}
        </div>

        <div className="flex justify-end gap-4">
          <button
            type="button"
            className="flex h-12 items-center rounded-lg bg-neutral-800 px-6 text-neutral-100 transition-colors hover:bg-neutral-700 active:bg-neutral-600 dark:bg-neutral-100 dark:text-neutral-800 dark:hover:bg-neutral-200 dark:active:bg-neutral-300"
            onClick={() => {
              if (data.onConfirm) {
                data.onConfirm();
              }

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
