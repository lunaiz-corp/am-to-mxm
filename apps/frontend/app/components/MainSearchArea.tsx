import { useEffect, useMemo, useRef } from 'react';
import { Form, useSearchParams } from '@remix-run/react';

import {
  SearchType,
  SearchQuery,
  SearchClient as SearchServiceClient,
} from '@packages/grpc/__generated__/am2mxm-api';

import { ISearchTypeProps } from '~/types/search';
import { useSearchResultStore } from '~/stores/searchResult';
import { useSearchQueryStore } from '~/stores/searchQuery';
import { useModalDataStore } from '~/stores/modal';

import { Logger } from '~/utils/logger';

import Footer from '~/components/Footer';

import AmLogo from '~/assets/images/am.svg?react';
import MxmAppLogo from '~/assets/images/mxm.webp';

import AmTypography from '~/assets/images/am_typography.svg?react';
import MxmTypography from '~/assets/images/mxm_typography.svg?react';

export default function MainSearchArea(
  props: ISearchTypeProps = { searchType: SearchType.LINK },
) {
  const [searchParams, setSearchParams] = useSearchParams();

  const client = useMemo(
    () => new SearchServiceClient(import.meta.env.VITE_API_URL),
    [],
  );

  const isLoaded = useRef(false);
  const setSearchResult = useSearchResultStore((state) => state.setResult);

  const searchQueryString = useSearchQueryStore((state) => state.query);
  const setSearchQueryString = useSearchQueryStore((state) => state.setQuery);

  const setModalData = useModalDataStore((state) => state.setData);

  useEffect(() => {
    (async () => {
      if (searchParams.get('q') && !isLoaded.current) {
        setSearchQueryString(searchParams.get('q')!);
        isLoaded.current = true;

        try {
          const response = await client.SearchByQuery(
            new SearchQuery({
              type: props.searchType,
              query: searchParams.get('q')!,
            }),
            null,
          );

          Logger.debug('gRPC Response:', response.toObject());

          if (
            !response.toObject().tracks ||
            response.toObject().tracks?.length === 0
          ) {
            setModalData({
              level: 'warning',
              title: 'No results found',
              message:
                'We could not find any results for the given query. Please try again with a different query.',
            });

            return;
          }

          setSearchResult(response);

          // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } catch (error: any) {
          const message = error.message.toString();
          const hasNewLine = message.includes('\n');

          setModalData({
            level: 'error',
            title:
              (hasNewLine && message.split('\n')[0]) ||
              'Whoopsie, we ran into an error...',
            message:
              (hasNewLine && message.split('\n')[1]) ||
              error.message ||
              'We are sorry, but something went wrong. Please try again later.',
            status: `RpcError ${error.code}`,
          });

          throw error;
        }
      }
    })();
  });

  return (
    <div className="flex flex-col items-center px-8 pb-14 pt-20 lg:block lg:h-screen lg:max-w-[448px] lg:bg-neutral-100 lg:px-16 lg:pb-0 lg:pt-[158px] dark:lg:bg-neutral-800">
      <div className="flex items-center gap-4">
        {props.searchType === SearchType.LINK ? (
          <>
            <AmLogo
              className="size-[50px] rounded-[10px]"
              aria-label="Apple Music Logo"
            />
            <span
              className="material-symbols-rounded size-[40px] !text-[40px] text-neutral-950 dark:text-neutral-50"
              style={{
                fontVariationSettings:
                  "'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 40",
              }}
            >
              arrow_right_alt
            </span>
            <img
              src={MxmAppLogo}
              className="size-[50px] rounded-[10px]"
              alt="Musixmatch Logo"
            />
          </>
        ) : (
          <>
            <img
              src={MxmAppLogo}
              className="size-[50px] rounded-[10px]"
              alt="Musixmatch Logo"
            />
            <span
              className="material-symbols-rounded size-[40px] !text-[40px] text-neutral-950 dark:text-neutral-50"
              style={{
                fontVariationSettings:
                  "'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 40",
              }}
            >
              arrow_right_alt
            </span>
            <AmLogo
              className="size-[50px] rounded-[10px]"
              aria-label="Apple Music Logo"
            />
          </>
        )}
      </div>

      <div className="flex items-center gap-3 pt-8">
        {props.searchType === SearchType.LINK ? (
          <>
            <AmTypography className="h-7 fill-neutral-950 dark:fill-neutral-50" />
            <span className="mt-[2px] font-sans text-[28px] font-medium text-neutral-950 dark:text-neutral-50">
              to
            </span>
            <MxmTypography className="ml-[2px] mt-[2px] h-8 fill-neutral-950 dark:fill-neutral-50" />
          </>
        ) : (
          <>
            <MxmTypography className="mt-2.5 h-8 fill-neutral-950 dark:fill-neutral-50" />
            <span className="mt-[2px] font-sans text-[28px] font-medium text-neutral-950 dark:text-neutral-50">
              to
            </span>
            <AmTypography className="h-7 fill-neutral-950 dark:fill-neutral-50" />
          </>
        )}
      </div>

      <Form
        className="relative mt-10 w-full lg:w-[335px]"
        onSubmit={async (e) => {
          e.preventDefault();
          if (!searchQueryString) return;

          try {
            const response = await client.SearchByQuery(
              new SearchQuery({
                type: props.searchType,
                query: searchQueryString,
              }),
              null,
            );

            Logger.debug('gRPC Response:', response.toObject());

            if (
              !response.toObject().tracks ||
              response.toObject().tracks?.length === 0
            ) {
              setModalData({
                level: 'warning',
                title: 'No results found',
                message:
                  'We could not find any results for the given query. Please try again with a different query.',
              });

              return;
            }

            setSearchResult(response);
            setSearchParams({ ...searchParams, q: searchQueryString });

            // eslint-disable-next-line @typescript-eslint/no-explicit-any
          } catch (error: any) {
            const message = error.message.toString();
            const hasNewLine = message.includes('\n');

            setModalData({
              level: 'error',
              title:
                (hasNewLine && message.split('\n')[0]) ||
                'Whoopsie, we ran into an error...',
              message:
                (hasNewLine && message.split('\n')[1]) ||
                error.message ||
                'We are sorry, but something went wrong. Please try again later.',
              status: `RpcError ${error.code}`,
            });

            throw error;
          }
        }}
      >
        <input
          id="link-input"
          className="peer w-full border-0 border-b-[1.5px] border-b-neutral-800 bg-transparent pb-2.5 pl-1 pr-10 pt-6 text-lg text-neutral-800 outline-none dark:border-b-neutral-200 dark:text-neutral-100"
          value={searchQueryString}
          onChange={(e) => setSearchQueryString(e.target.value)}
          required
        />

        <label
          className="absolute left-1 top-[25.5px] font-sans text-base text-neutral-400 transition-all duration-500 ease-in-out peer-valid:top-0 peer-valid:text-sm peer-valid:text-neutral-800 peer-focus:top-0 peer-focus:text-sm peer-focus:text-neutral-800 dark:peer-valid:text-neutral-200 dark:peer-focus:text-neutral-200"
          htmlFor="link-input"
        >
          {props.searchType === SearchType.LINK
            ? 'Apple Music Track/Album link or ISRC'
            : 'Musixmatch Track/Album link'}
        </label>

        <button type="submit">
          <span
            className="material-symbols-rounded absolute right-1 top-[25.5px] size-[26px] !text-[26px] text-neutral-400"
            style={{
              fontVariationSettings:
                "'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 20",
            }}
          >
            search
          </span>
        </button>
      </Form>

      <div className="absolute bottom-12 hidden flex-col gap-6 lg:flex">
        <Footer searchType={props.searchType} />
      </div>
    </div>
  );
}
