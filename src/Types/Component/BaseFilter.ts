export interface BaseFilter {
  OrderBy: string;
  Limit?: number;
  Offset?: number;
  Query?: string;
  SortBy?: string;
}

export interface Filters {
  target: string;
  operator: "eq" | "ne" | "lt" | "gt" | "le" | "ge" | "in" | "ni" | "lk" | "bt";
  value: string | number | boolean;
}
