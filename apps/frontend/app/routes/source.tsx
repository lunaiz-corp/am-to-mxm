import type { MetaFunction } from '@remix-run/node';

import TrackCard from '~/components/TrackCard';
import { useSearchResultStore } from '~/stores/searchResult';

export const meta: MetaFunction = () => [
  { title: 'Musixmatch to Apple Music Source' },
  {
    name: 'description',
    content: 'Get Apple Music Source/Album Link from Musixmatch Link/Abstract',
  },
];

export default function Source() {
  const searchResult = useSearchResultStore((state) => state.result);

  return (
    <div className="flex min-h-[calc(100vh-478px)] w-full flex-col items-center px-3 pb-16 lg:h-screen lg:min-h-[initial] lg:justify-center lg:pb-0 xl:items-start">
      <div className="mx-0 flex w-full max-w-[480px] flex-col gap-8 lg:ml-16 lg:mr-8 lg:max-h-[calc(100vh-6rem)] lg:w-[calc(100%-6rem)] lg:max-w-none lg:overflow-y-auto xl:ml-32 xl:mr-16 xl:w-[calc(100%-12rem)]">
        {searchResult ? (
          searchResult.tracks.map((track) => (
            <TrackCard
              key={track.mxm_album_url.split('album/')[1]}
              track={track}
            />
          ))
        ) : (
          <div className="hidden text-center text-neutral-950 lg:inline dark:text-neutral-50">
            Search for a track on Musixmatch
          </div>
        )}
      </div>
    </div>
  );
}
