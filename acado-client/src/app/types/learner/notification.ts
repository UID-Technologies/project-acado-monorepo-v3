export interface NotificationsListResp {
  status?: number;
  data?: NotificationData[];
  error?: string[];
}

export interface NotificationData {
  id?: string;
  notifiableId?: number;
  readContent?: string;
  createdAt?: string;
  updatedAt?: string;
  type?: NotificationType;
  title?: unknown;
  description?: unknown;
}

export enum NotificationType {
  ASSESSMENT = "assessment",
  OTHERCLASS = "otherclass",
  VIDEO = "video",
  VIDEO_YTS = "video_yts"
}


// new

export type Notification = {
  id: number;
  title: string;
  description: string;
  content_type: string;
  content_type_id: string;
  category_id: number;
  category: string;
  created_at: string;
}

export type NotificationApiResponse = {
  status: number;
  data: {
    list: Notification[];
  }
  error: string[];
}