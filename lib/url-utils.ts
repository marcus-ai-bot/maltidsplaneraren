/**
 * Normalize recipe URLs for better extraction success
 */
export function normalizeRecipeUrl(url: string): string {
  let normalized = url.trim()
  
  // 1. Strip UTM and tracking parameters
  try {
    const urlObj = new URL(normalized)
    const paramsToRemove = [
      'utm_source', 'utm_medium', 'utm_campaign', 'utm_content', 'utm_term',
      'fbclid', 'gclid', 'ref', 'source', 'mc_cid', 'mc_eid'
    ]
    paramsToRemove.forEach(param => urlObj.searchParams.delete(param))
    normalized = urlObj.toString()
  } catch {
    // Invalid URL, return as-is
    return normalized
  }

  // 2. Replace mobile subdomain with www
  normalized = normalized.replace(/^(https?:\/\/)m\./, '$1www.')
  
  // 3. Remove /print or /skriv-ut suffix
  normalized = normalized.replace(/\/(print|skriv-ut|skrivut)\/?(\?.*)?$/, '$2')
  
  // 4. Remove /amp/ prefix
  normalized = normalized.replace(/\/amp\//, '/')
  
  // 5. Normalize trailing slash (remove it for consistency)
  normalized = normalized.replace(/\/(\?|$)/, '$1')
  
  return normalized
}

/**
 * Extract domain name for display
 */
export function extractDomain(url: string): string {
  try {
    const hostname = new URL(url).hostname
    return hostname.replace(/^www\./, '').replace(/^m\./, '')
  } catch {
    return 'okänd källa'
  }
}
