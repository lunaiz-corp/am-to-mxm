import { Link } from '@remix-run/react';

import { ESearchType, type ISearchTypeProps } from '~/types/search';
import { useSearchResultStore } from '~/stores/function/searchResult';
import { useSearchQueryStore } from '~/stores/function/searchQuery';

export default function Footer(
  props: ISearchTypeProps = { searchType: ESearchType.LINK },
) {
  const setSearchResult = useSearchResultStore((state) => state.setResult);
  const setSearchQueryString = useSearchQueryStore((state) => state.setQuery);

  return (
    <>
      <div className="flex gap-3 font-sans text-sm font-medium text-neutral-500 dark:text-neutral-300">
        <a
          href="https://lunaiz.rdbl.io/8255520465/am2mxm-guide"
          target="_blank"
          rel="noreferrer"
          className="underline"
        >
          How to use?
        </a>
        {props.searchType !== ESearchType.LINK && (
          <>
            <span>|</span>
            <Link
              to="/"
              className="underline"
              onClick={() => {
                setSearchResult(null);
                setSearchQueryString('');
              }}
            >
              Get MXM link
            </Link>
          </>
        )}
        {props.searchType !== ESearchType.SOURCE && (
          <>
            <span>|</span>
            <Link
              to="/source"
              className="underline"
              onClick={() => {
                setSearchResult(null);
                setSearchQueryString('');
              }}
            >
              Get AM source
            </Link>
          </>
        )}
        <span>|</span>
        <a
          href="https://spotify-to-mxm.vercel.app/"
          className="underline"
          target="_blank"
          rel="noreferrer"
        >
          Get from Spotify
        </a>
      </div>

      {/* <a
          href="https://lunaiz.com/"
          target="_blank"
          rel="noreferrer"
          className="text-neutral-500 font-sans text-sm font-medium"
        >
          © LUNAIZ Corp.
        </a> */}

      <span className="font-sans text-sm font-medium text-neutral-500 dark:text-neutral-300">
        © LUNAIZ Corp.
      </span>
    </>
  );
}
