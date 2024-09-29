import { SearchType } from '@packages/grpc/__generated__/am2mxm-api';

export interface ISearchTypeProps {
  searchType: SearchType;
}

export const routes = {
  '/': SearchType.LINK,
  '/source': SearchType.SOURCE,
};
