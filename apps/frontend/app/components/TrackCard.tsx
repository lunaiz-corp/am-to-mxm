import { TrackInfo } from '@packages/grpc/__generated__/am2mxm-api';

export default function TrackCard({ track }: { track: TrackInfo }) {
  return (
    <div className="flex w-[calc(100%-15px)] items-center gap-11 rounded-xl bg-neutral-100">
      <a href={track.mxm_track_url} target="_blank" rel="noreferrer">
        <img
          className="my-3 ml-5 size-36 rounded-xl"
          src={track.am_thumbnail || track.mxm_thumbnail}
          alt={`${track.artist}-${track.title} Thumbnail`}
        />
      </a>

      <div className="flex flex-col gap-[15px]">
        <h3 className="text-lg font-bold">
          <a
            href={track.mxm_track_url}
            target="_blank"
            rel="noreferrer"
            className="underline"
            style={{
              color: track.am_pointcolor || '#f4502d',
            }}
          >
            {track.title}
          </a>
        </h3>

        <div className="flex flex-col gap-[10px] font-light">
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
            <span className="font-medium text-black">{track.mxm_abstrack}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
