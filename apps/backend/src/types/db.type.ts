export type DatabaseResult<T> = T & {
  cached_at: number;
};
