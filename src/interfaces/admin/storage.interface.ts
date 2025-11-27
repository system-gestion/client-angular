export interface ImageSuccess {
  message: string;
  code: number;
}

export interface ImageFileDetails {
  filename: string;
  name: string;
  mime: string;
  extension: string;
  url: string;
  size: number;
}

export interface ImageThumbDetails {
  filename: string;
  name: string;
  mime: string;
  extension: string;
  url: string;
}

export interface ImageMediumDetails {
  filename: string;
  name: string;
  mime: string;
  extension: string;
  url: string;
}

export interface ImageData {
  name: string;
  extension: string;
  width: number;
  height: number;
  size: number;
  time: number;
  expiration: number;
  likes: number;
  description?: string;
  original_filename: string;
  is_animated: number;
  id_encoded: string;
  size_formatted: string;
  filename: string;
  url: string;
  url_short: string;
  url_seo: string;
  url_viewer: string;
  url_viewer_preview: string;
  url_viewer_thumb: string;
  image: ImageFileDetails;
  thumb: ImageThumbDetails;
  medium?: ImageMediumDetails;
  display_url: string;
  display_width: number;
  display_height: number;
  views_label: string;
  likes_label: string;
  how_long_ago: string;
  date_fixed_peer: string;
  title: string;
  title_truncated: string;
  title_truncated_html: string;
  is_use_loader: boolean;
}

export interface ImageRequest {
  type: string;
  action: string;
  timestamp: string;
  auth_token: string;
}

export interface UploadResponse {
  status_code: number;
  success: ImageSuccess;
  image: ImageData;
  request: ImageRequest;
  status_txt: string;
}
