export interface ActivityResponse {
  activityId: number;
  id: number;
  activityTypeName?: string;
  comments?: string;
  createdBy?: string;
  createdOn?: string;
  field?: string;
  oldValue?: string;
  newValue?: string;
}

export interface ActivityRows {
  activityId: number;
  formId: number;
  activityTypeName?: string;
  comments?: string;
  createdBy?: string;
  createdOn?: string;
  field?: string;
  oldValue?: string;
  newValue?: string;
}

export interface Activity {
  activityId: number;
  id: number;
  activityTypeId?: number;
  comments?: string;
  createdBy?: string;
  createdOn?: string;
  field?: string;
  oldValue?: string;
  newValue?: string;
}
