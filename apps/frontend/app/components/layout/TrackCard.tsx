import { useLocation } from '@remix-run/react';
import { TrackInfo } from '@packages/grpc/__generated__/am2mxm-api';

export default function TrackCard({ track }: { track: TrackInfo }) {
  const location = useLocation();

  return (
    <div
      className={`flex w-full items-center justify-center gap-7 rounded-xl bg-neutral-100 lg:w-[calc(100%-15px)] xl:justify-start xl:gap-11 dark:bg-neutral-700 dark:lg:bg-neutral-800 ${
        location.pathname === '/source' ? 'grow' : ''
      }`}
    >
      {location.pathname === '/' && (
        <a
          href={track.mxm_track_url}
          target="_blank"
          rel="noreferrer"
          className="xs:size-32 my-6 size-28 shrink-0 lg:my-3 lg:size-32 xl:ml-5 xl:size-36"
        >
          <img
            className="size-full rounded-xl"
            src={track.am_thumbnail}
            alt={`${track.artist}-${track.title} Thumbnail`}
          />
        </a>
      )}

      <div
        className={`flex flex-col gap-[15px] ${
          location.pathname === '/source'
            ? 'w-full'
            : 'xs:min-w-[210px] min-w-[192px] sm:min-w-[278px] xl:min-w-[262px]'
        }`}
      >
        <div className="flex flex-col gap-2 lg:flex-row">
          <a
            className={`inline-block max-w-48 truncate text-[17px] font-bold leading-[17px] text-[#fd5e6e] underline xl:max-w-[inherit] ${
              location.pathname === '/source' ? 'ml-5 mt-3' : ''
            }`}
            href={
              location.pathname === '/source'
                ? track.am_album_url
                : track.mxm_track_url
            }
            target="_blank"
            rel="noreferrer"
          >
            {location.pathname === '/source' ? track.mxm_album : track.title}
          </a>

          {location.pathname === '/' && (
            <span className="text-[11px] font-light leading-[7px] xl:leading-[21px]">
              <br className="inline xl:hidden" />
              <a
                href={track.mxm_track_url.replace(
                  'www.musixmatch.com',
                  'com-beta.musixmatch.com',
                )}
                target="_blank"
                rel="noreferrer"
                className="text-[#fd5e6e] underline"
              >
                (Beta MXM)
              </a>
            </span>
          )}
        </div>

        <div className="flex flex-col gap-[10px] truncate text-sm font-light xl:text-base">
          {location.pathname === '/' && (
            <>
              <div>
                <span className="truncate text-neutral-950 dark:text-neutral-50">
                  Album:&nbsp;
                </span>
                <a
                  href={track.mxm_album_url}
                  target="_blank"
                  rel="noreferrer"
                  className="font-medium text-[#fd5e6e] underline"
                >
                  {track.mxm_album}
                </a>
              </div>

              <div>
                <span className="text-neutral-950 dark:text-neutral-50">
                  ISRC:&nbsp;
                </span>
                <span className="truncate font-medium text-neutral-950 dark:text-neutral-50">
                  {track.isrc}
                </span>
              </div>

              <div>
                <span className="truncate text-neutral-950 dark:text-neutral-50">
                  Abstrack
                  <span className="hidden lg:inline">&nbsp;(Track ID)</span>
                  :&nbsp;
                </span>
                <span className="font-medium text-neutral-950 dark:text-neutral-50">
                  {track.mxm_abstrack}
                </span>
              </div>
            </>
          )}

          {location.pathname === '/source' && (
            <>
              <div className="ml-5 mt-3">
                <span className="text-neutral-950 dark:text-neutral-50">
                  Artist:&nbsp;
                </span>
                <span className="font-medium text-neutral-950 dark:text-neutral-50">
                  {track.artist}
                </span>
              </div>

              <div className="ml-5">
                <span className="text-neutral-950 dark:text-neutral-50">
                  Album:&nbsp;
                </span>
                <a
                  href={track.am_album_url}
                  target="_blank"
                  rel="noreferrer"
                  className="font-medium text-[#fd5e6e] underline"
                >
                  {track.mxm_album}
                </a>
              </div>

              <div className="mb-3 ml-5">
                <span className="text-neutral-950 dark:text-neutral-50">
                  Abstrack (Track ID):&nbsp;
                </span>
                <span className="font-medium text-neutral-950 dark:text-neutral-50">
                  {track.mxm_album_url.split('album/')[1].split('/')[1]}
                </span>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
