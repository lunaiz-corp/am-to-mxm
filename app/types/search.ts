export enum ESearchType {
  LINK = 0,
  SOURCE = 1,
  ABSTRACK = 2,
}

export interface ISearchTypeProps {
  searchType: ESearchType;
}

export const routes = {
  '/': ESearchType.LINK,
  '/source': ESearchType.SOURCE,
  '/abstrack': ESearchType.ABSTRACK,
};
