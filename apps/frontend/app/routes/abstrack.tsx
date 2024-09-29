import type { MetaFunction } from '@remix-run/node';

export const meta: MetaFunction = () => [
  { title: 'Musixmatch Abstrack Searcher' },
  {
    name: 'description',
    content: 'Get Musixmatch Link, ISRC, Track ID, etc from Abstrack ID',
  },
];

export default function Abstrack() {
  return <></>;
}
