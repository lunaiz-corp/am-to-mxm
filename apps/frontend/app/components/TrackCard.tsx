import { useLocation } from '@remix-run/react';
import { TrackInfo } from '@packages/grpc/__generated__/am2mxm-api';

export default function TrackCard({ track }: { track: TrackInfo }) {
  const location = useLocation();

  return (
    <div className="flex w-[calc(100%-15px)] grow items-center gap-11 rounded-xl bg-neutral-100">
      {location.pathname === '/' && (
        <a href={track.mxm_track_url} target="_blank" rel="noreferrer">
          <img
            className="my-3 ml-5 size-36 rounded-xl"
            src={track.am_thumbnail || track.mxm_thumbnail}
            alt={`${track.artist}-${track.title} Thumbnail`}
          />
        </a>
      )}

      <div
        className={`flex flex-col gap-[15px] ${
          location.pathname === '/source' ? 'w-full' : ''
        }`}
      >
        <h3
          className={`text-lg font-bold ${
            location.pathname === '/source' ? 'ml-5 mt-3' : ''
          }`}
        >
          <a
            href={
              location.pathname === '/source'
                ? track.am_album_url
                : track.mxm_track_url
            }
            target="_blank"
            rel="noreferrer"
            className="text-[#f4502d] underline"
          >
            {location.pathname === '/source' ? track.mxm_album : track.title}
          </a>
        </h3>

        <div className="flex flex-col gap-[10px] font-light">
          {location.pathname === '/' && (
            <>
              <div>
                <span className="text-black">Album:&nbsp;</span>
                <a
                  href={track.mxm_album_url}
                  target="_blank"
                  rel="noreferrer"
                  className="font-medium text-[#f4502d] underline"
                >
                  {track.mxm_album}
                </a>
              </div>

              <div>
                <span className="text-black">ISRC:&nbsp;</span>
                <span className="font-medium text-black">{track.isrc}</span>
              </div>

              <div>
                <span className="text-black">Abstrack (Track ID):&nbsp;</span>
                <span className="font-medium text-black">
                  {track.mxm_abstrack}
                </span>
              </div>
            </>
          )}

          {location.pathname === '/source' && (
            <>
              <div className="ml-5 mt-3">
                <span className="text-black">Artist:&nbsp;</span>
                <span className="font-medium text-black">{track.artist}</span>
              </div>

              <div className="ml-5">
                <span className="text-black">Album:&nbsp;</span>
                <a
                  href={track.am_album_url}
                  target="_blank"
                  rel="noreferrer"
                  className="font-medium text-[#f4502d] underline"
                >
                  {track.mxm_album}
                </a>
              </div>

              <div className="mb-3 ml-5">
                <span className="text-black">Abstrack (Track ID):&nbsp;</span>
                <span className="font-medium text-black">
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
