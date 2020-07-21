export interface Parameters {
  /** description — A search term, such as "ruby" or "java". This parameter is aliased to search.  */
  description?: string
  /** location — A city name, zip code, or other location search term.  */
  location?: string
  /** lat — A specific latitude. If used, you must also send long and must not send location. */
  lat?: string
  /** long — A specific longitude. If used, you must also send lat and must not send location. */
  long?: string
  /** full_time — If you want to limit results to full time positions set this parameter to 'true'. */
  full_time?: string
}
