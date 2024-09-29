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
    <div className="flex h-screen w-full flex-col justify-center">
      <div className="ml-32 mr-16 flex max-h-[calc(100vh-6rem)] flex-col gap-8 overflow-y-auto">
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
