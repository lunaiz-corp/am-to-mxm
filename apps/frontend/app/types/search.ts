export enum ESearchType {
  LINK,
  SOURCE,
}

export interface ISearchTypeProps {
  searchType: ESearchType;
}

export const routes = {
  '/': ESearchType.LINK,
  '/source': ESearchType.SOURCE,
};
