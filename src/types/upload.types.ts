export interface UploadedImageMainDetails {
  url: string;
  publicId: string;
}

export enum ImageCategory {
  PROFILE = 'profile',
  SERVICE = 'service',
  COMPONENT = 'component',
  GENERAL = 'general',
}
