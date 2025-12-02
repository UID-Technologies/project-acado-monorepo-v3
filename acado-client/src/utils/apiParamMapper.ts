/**
 * API Parameter Mapper Utility
 * 
 * Maps legacy ELMS API parameter names to new acado-api parameter names.
 * This ensures backward compatibility while transitioning to the new API structure.
 */

/**
 * Mapping table from legacy parameter names to new API parameter names
 */
const LEGACY_TO_NEW_PARAM_MAPPING: Record<string, string> = {
  'org_id': 'universityId',
  'country_id': 'locationId',
  'cat_id': 'categoryId',
  'query': 'search',
  'items': 'limit',
  // 'page' remains the same
};

/**
 * Maps legacy API parameters to new API parameters
 * 
 * @param legacyParams - URLSearchParams with legacy parameter names
 * @returns URLSearchParams with new parameter names
 * 
 * @example
 * const legacy = new URLSearchParams({ org_id: '123', query: 'test' });
 * const mapped = mapLegacyToNewParams(legacy);
 * // Result: { universityId: '123', search: 'test' }
 */
export function mapLegacyToNewParams(legacyParams: URLSearchParams): URLSearchParams {
  const newParams = new URLSearchParams();
  
  legacyParams.forEach((value, key) => {
    const newKey = LEGACY_TO_NEW_PARAM_MAPPING[key] || key;
    newParams.append(newKey, value);
  });
  
  return newParams;
}

/**
 * Maps a single legacy parameter name to the new API parameter name
 * 
 * @param legacyKey - Legacy parameter name
 * @returns New parameter name
 * 
 * @example
 * mapParamKey('org_id') // Returns: 'universityId'
 * mapParamKey('page') // Returns: 'page' (unchanged)
 */
export function mapParamKey(legacyKey: string): string {
  return LEGACY_TO_NEW_PARAM_MAPPING[legacyKey] || legacyKey;
}

/**
 * Creates a new URLSearchParams object with mapped parameter names
 * Useful for building query strings from scratch
 * 
 * @param params - Object with legacy parameter names
 * @returns URLSearchParams with new parameter names
 * 
 * @example
 * const params = createMappedParams({ org_id: '123', query: 'test', page: '1' });
 * // Result: URLSearchParams { universityId: '123', search: 'test', page: '1' }
 */
export function createMappedParams(params: Record<string, string | number | undefined>): URLSearchParams {
  const searchParams = new URLSearchParams();
  
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== '') {
      const newKey = LEGACY_TO_NEW_PARAM_MAPPING[key] || key;
      searchParams.append(newKey, String(value));
    }
  });
  
  return searchParams;
}

