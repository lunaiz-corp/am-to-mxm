import { Form, Link } from '@remix-run/react';
import { useRef } from 'react';

import {
  SearchType,
  SearchQuery,
  SearchClient as SearchServiceClient,
} from '@packages/grpc/__generated__/am2mxm-api';

import { ISearchTypeProps } from '~/types/search';
import { useSearchResultStore } from '~/stores/searchResult';

import amLogo from '~/assets/images/am.png';
import mxmLogo from '~/assets/images/mxm.png';

import AmTypography from '~/assets/images/am_typography.svg?react';
import MxmTypography from '~/assets/images/mxm_typography.svg?react';

export default function MainSearchArea(
  props: ISearchTypeProps = { searchType: SearchType.LINK },
) {
  const client = new SearchServiceClient(import.meta.env.VITE_API_URL);
  const queryRef = useRef<HTMLInputElement>(null);

  const setSearchResult = useSearchResultStore((state) => state.setResult);

  return (
    <div className="h-screen max-w-[448px] bg-neutral-100 pl-16 pt-[158px]">
      <div className="flex items-center gap-4">
        {props.searchType === SearchType.LINK ? (
          <>
            <img
              src={amLogo}
              alt="Apple Music Logo"
              className="size-[50px] rounded-[10px]"
            />
            <span
              className="material-symbols-rounded size-[40px] !text-[40px]"
              style={{
                fontVariationSettings:
                  "'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 40",
              }}
            >
              arrow_right_alt
            </span>
            <img
              src={mxmLogo}
              alt="Musixmatch Logo"
              className="size-[50px] rounded-[10px]"
            />
          </>
        ) : props.searchType === SearchType.SOURCE ? (
          <>
            <img
              src={mxmLogo}
              alt="Musixmatch Logo"
              className="size-[50px] rounded-[10px]"
            />
            <span
              className="material-symbols-rounded size-[40px] !text-[40px]"
              style={{
                fontVariationSettings:
                  "'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 40",
              }}
            >
              arrow_right_alt
            </span>
            <img
              src={amLogo}
              alt="Apple Music Logo"
              className="size-[50px] rounded-[10px]"
            />
          </>
        ) : (
          <>
            <img
              src={mxmLogo}
              alt="Musixmatch Logo"
              className="size-[50px] rounded-[10px]"
            />
            <span className="font-sans text-[32px] font-medium text-neutral-900">
              Abstrack
            </span>
          </>
        )}
      </div>

      {props.searchType !== SearchType.ABSTRACK && (
        <div className="flex items-center gap-3 pr-[66px] pt-8">
          {props.searchType === SearchType.LINK ? (
            <>
              <AmTypography className="h-7 fill-neutral-900" />
              <span className="mt-[2px] font-sans text-[28px] font-medium text-neutral-900">
                to
              </span>
              <MxmTypography className="ml-[2px] mt-[2px] h-8 fill-neutral-900" />
            </>
          ) : (
            <>
              <MxmTypography className="mt-2.5 h-8 fill-neutral-900" />
              <span className="mt-[2px] font-sans text-[28px] font-medium text-neutral-900">
                to
              </span>
              <AmTypography className="h-7 fill-neutral-900" />
            </>
          )}
        </div>
      )}

      <Form
        className="relative mr-28 mt-10 w-[335px]"
        onSubmit={async () => {
          if (!queryRef.current?.value) return;

          const response = await client.SearchByQuery(
            new SearchQuery({
              type: props.searchType,
              query: queryRef.current.value,
            }),
            null,
          );

          console.log(response.toObject());
          setSearchResult(response);
        }}
      >
        <input
          id="link-input"
          ref={queryRef}
          className="peer w-full border-0 border-b-[1.5px] border-b-neutral-800 bg-transparent pb-2.5 pl-1 pr-10 pt-6 text-lg text-neutral-800 outline-none"
          required
        />

        <label
          className="absolute left-1 top-[25.5px] font-sans text-base text-neutral-400 transition-all duration-500 ease-in-out peer-valid:top-0 peer-valid:text-sm peer-valid:text-neutral-800 peer-focus:top-0 peer-focus:text-sm peer-focus:text-neutral-800"
          htmlFor="link-input"
        >
          {props.searchType === SearchType.LINK
            ? 'Apple Music Track/Album link or ISRC'
            : props.searchType === SearchType.SOURCE
              ? 'Musixmatch Track/Album link or Abstrack'
              : 'Musixmatch Abstrack'}
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

      <div className="absolute bottom-12 flex flex-col gap-6">
        <div className="flex gap-3 font-sans text-sm font-medium text-neutral-500">
          <Link to="/guide" className="underline">
            How to use
          </Link>
          {props.searchType !== SearchType.LINK && (
            <>
              <span>|</span>
              <Link to="/" className="underline">
                Get MXM link
              </Link>
            </>
          )}
          {props.searchType !== SearchType.SOURCE && (
            <>
              <span>|</span>
              <Link to="/source" className="underline">
                Get AM source
              </Link>
            </>
          )}
          {props.searchType !== SearchType.ABSTRACK && (
            <>
              <span>|</span>
              <Link to="/abstrack" className="underline">
                Get from abstrack
              </Link>
            </>
          )}
          {/* <span>|</span>
          <a
            href="https://spotify-to-mxm.vercel.app/"
            className="underline"
            target="_blank"
            rel="noreferrer"
          >
            Get from Spotify
          </a> */}
        </div>

        {/* <a
          href="https://lunaiz.com/"
          target="_blank"
          rel="noreferrer"
          className="text-neutral-500 font-sans text-sm font-medium"
        >
          © LUNAIZ Corp.
        </a> */}

        <span className="font-sans text-sm font-medium text-neutral-500">
          © LUNAIZ Corp.
        </span>
      </div>
    </div>
  );
}
