export class PaginatedResponse<T> {
    totalRecords: number;
    items: T[];
}