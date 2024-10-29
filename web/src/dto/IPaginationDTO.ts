export interface IPaginationDTO<T> {
  meta?: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
  data: T[];
}
