export interface BaseFilter {
  OrderBy: string;
  Limit?: number;
  Offset?: number;
  Query?: string;
  SortBy?: string;
}
