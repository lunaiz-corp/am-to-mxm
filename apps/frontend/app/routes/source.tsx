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
    <div className="flex min-h-[calc(100vh-478px)] w-full flex-col px-3 pb-16 md:h-screen md:min-h-[initial] md:justify-center md:pb-0">
      <div className="mx-0 flex flex-col gap-8 md:ml-32 md:mr-8 md:max-h-[calc(100vh-6rem)] md:overflow-y-auto xl:mr-16">
        {searchResult ? (
          searchResult.tracks.map((track) => (
            <TrackCard
              key={track.mxm_album_url.split('album/')[1]}
              track={track}
            />
          ))
        ) : (
          <div className="text-center">Search for a track on Apple Music</div>
        )}
      </div>
    </div>
  );
}
