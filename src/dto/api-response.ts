export class ApiResponse<T> {
  pagination?: {
    totalItems: number;
    totalPages: number;
    currentPage: number;
    itemsPerPage: number;
  };
  message?: string;
  data:
    | T
    | T[]
    | {
        [key: string]: any;
      };
}
