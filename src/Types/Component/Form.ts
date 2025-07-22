export interface FormDetails {
  id?: number;
  typeId: number;
  processId: number;
  statusId?: number;
  customerName: string;
  customerAddress?: string;
  phoneNumber: string;
  phoneNumber2?: string;
  location: string;
  lastUpdatedBy: string;
}

export interface FormResponse {
  id: string;
  typeName: string;
  statusName: string;
  processName: string;
  processId?: number;
  customerName: string;
  customerAddress: string;
  phoneNumber: string;
  phoneNumber2?: string;
  locationName: string;
  createdBy: string;
  createdOn: string | Date;
  lastUpdatedBy: string;
  lastUpdatedOn: string | Date;
}

export interface Process {
  processId: number;
  processName: string;
}
export interface Attachment {
  attachmentId?: number;
  fileName?: string;
  filePath?: string;
  fileInBytes?: ArrayBuffer;
  fileSizeInKb?: number;
  fileType?: string;
}
export interface AttachmentResponse {
  attachmentId?: number;
  id?: number;
  fileName?: string;
  filePath?: string;
  fileSize?: number;
  fileType?: string;
  uploadedBy?: string;
  uploadedOn?: string | Date;
  fileContent?: string;
}
export interface Activity {
  activityTypeId: number;
  comments?: number;
}

export interface FormRequest {
  form: FormDetails;
  Attachments?: Attachment[];
  deleteAttachments?: number[];
}

export interface Filters {
  target: string;
  operator: "eq" | "ne" | "lt" | "gt" | "le" | "ge" | "in" | "ni" | "lk" | "bt";
  value: string | number | boolean;
}
