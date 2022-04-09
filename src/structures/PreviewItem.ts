export interface PreviewItemApiResponse {
  items: PreviewItem[]
  dominant_brand: Dominant_brand
  search_tracking_params: Search_tracking_params2
  pagination: Pagination
  code: number
}

export interface PreviewItem {
  id: number
  title: string
  price: string
  discount?: any
  currency: string
  brand_title: string
  is_for_swap: boolean
  user: User
  url: string
  promoted: boolean
  photo?: Photo2
  favourite_count: number
  is_favourite: boolean
  favourite_group_id?: any
  badge?: any
  conversion?: any
  service_fee?: any
  total_item_price: string
  view_count: number
  size_title: string
  search_tracking_params: Search_tracking_params
}

export interface User {
  id: number
  login: string
  profile_url: string
  photo?: Photo
}

export interface Photo {
  id: number
  width: number
  height: number
  temp_uuid?: any
  url: string
  dominant_color: string
  dominant_color_opaque: string
  thumbnails: Thumbnails[]
  is_suspicious: boolean
  orientation?: any
  reaction?: any
  high_resolution: High_resolution
  full_size_url: string
  is_hidden: boolean
  extra: Extra
}

export interface Thumbnails {
  type: string
  url: string
  width: number
  height: number
  original_size?: any
}

export interface High_resolution {
  id: string
  timestamp: number
  orientation?: any
}

export interface Extra {

}

export interface Photo2 {
  id: number
  image_no: number
  width: number
  height: number
  dominant_color: string
  dominant_color_opaque: string
  url: string
  is_main: boolean
  thumbnails: Thumbnails2[]
  high_resolution: High_resolution2
  is_suspicious: boolean
  full_size_url: string
  is_hidden: boolean
  extra: Extra2
}

export interface Thumbnails2 {
  type: string
  url: string
  width: number
  height: number
  original_size?: any
}

export interface High_resolution2 {
  id: string
  timestamp: number
  orientation?: any
}

export interface Extra2 {

}

export interface Search_tracking_params {
  score: number
  matched_queries?: any
}

export interface Dominant_brand {
  id: number
  title: string
  slug: string
  favourite_count: number
  pretty_favourite_count: string
  item_count: number
  pretty_item_count: string
  is_visible_in_listings: boolean
  path: string
  requires_authenticity_check: boolean
  is_luxury: boolean
  url: string
  is_favourite: boolean
  is_hated: boolean
}

export interface Search_tracking_params2 {
  search_correlation_id: string
  search_session_id: string
  global_search_session_id: string
}

export interface Pagination {
  current_page: number
  total_pages: number
  total_entries: number
  per_page: number
  time: number
}