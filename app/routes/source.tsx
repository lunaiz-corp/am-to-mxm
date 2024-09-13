import type { MetaFunction } from '@remix-run/node';

export const meta: MetaFunction = () => [
  { title: 'Musixmatch to Apple Music Source' },
  {
    name: 'description',
    content: 'Get Apple Music Source/Album Link from Musixmatch Link/Abstract',
  },
];

export default function Source() {
  return <></>;
}
