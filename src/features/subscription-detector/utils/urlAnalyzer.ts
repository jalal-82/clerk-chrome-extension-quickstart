/**
 * URL analyzer for detecting subscription-related pages
 * Focuses on identifying when to show the DueDrop extension
 */

export interface UrlAnalysisResult {
  isSubscriptionPage: boolean;
  confidence: number; // 0-1 scale
  detectedService?: string;
  reason: string;
}

/**
 * Analyzes URL for subscription-related patterns
 * @param url - Current page URL
 * @returns Analysis result with confidence level
 */
export function analyzeUrlForSubscription(url: string): UrlAnalysisResult {
  const urlLower = url.toLowerCase();
  
  // Check for obvious subscription/checkout patterns
  if (hasCheckoutPatterns(urlLower)) {
    return {
      isSubscriptionPage: true,
      confidence: 0.9,
      reason: "URL contains checkout/billing patterns"
    };
  }
  
  // Check for subscription service domains
  const service = detectSubscriptionService(urlLower);
  if (service) {
    return {
      isSubscriptionPage: true,
      confidence: 0.8,
      detectedService: service,
      reason: `Detected subscription service: ${service}`
    };
  }
  
  // Check for payment-related patterns
  if (hasPaymentPatterns(urlLower)) {
    return {
      isSubscriptionPage: true,
      confidence: 0.7,
      reason: "URL contains payment/billing patterns"
    };
  }
  
  return {
    isSubscriptionPage: false,
    confidence: 0.1,
    reason: "No subscription patterns detected"
  };
}

/**
 * Checks for checkout and billing URL patterns
 */
function hasCheckoutPatterns(url: string): boolean {
  const checkoutPatterns = [
    '/checkout',
    '/billing',
    '/payment',
    '/subscribe',
    '/subscription',
    '/purchase',
    '/order',
    '/cart',
    '/buy',
    '/upgrade',
    '/plan'
  ];
  
  return checkoutPatterns.some(pattern => url.includes(pattern));
}

/**
 * Checks for payment-related URL patterns
 */
function hasPaymentPatterns(url: string): boolean {
  const paymentPatterns = [
    '/payment',
    '/billing',
    '/invoice',
    '/receipt',
    '/confirmation',
    '/success'
  ];
  
  return paymentPatterns.some(pattern => url.includes(pattern));
}

/**
 * Detects common subscription services from URL
 */
function detectSubscriptionService(url: string): string | null {
  const subscriptionServices = [
    { domain: 'netflix.com', name: 'Netflix' },
    { domain: 'spotify.com', name: 'Spotify' },
    { domain: 'youtube.com', name: 'YouTube Premium' },
    { domain: 'amazon.com', name: 'Amazon Prime' },
    { domain: 'disneyplus.com', name: 'Disney+' },
    { domain: 'hulu.com', name: 'Hulu' },
    { domain: 'hbo.com', name: 'HBO Max' },
    { domain: 'paramountplus.com', name: 'Paramount+' },
    { domain: 'peacocktv.com', name: 'Peacock' },
    { domain: 'crunchyroll.com', name: 'Crunchyroll' },
    { domain: 'funimation.com', name: 'Funimation' },
    { domain: 'adobe.com', name: 'Adobe Creative Cloud' },
    { domain: 'microsoft.com', name: 'Microsoft 365' },
    { domain: 'google.com', name: 'Google Workspace' },
    { domain: 'dropbox.com', name: 'Dropbox' },
    { domain: 'notion.so', name: 'Notion' },
    { domain: 'figma.com', name: 'Figma' },
    { domain: 'slack.com', name: 'Slack' },
    { domain: 'zoom.us', name: 'Zoom' },
    { domain: 'canva.com', name: 'Canva Pro' }
  ];
  
  for (const service of subscriptionServices) {
    if (url.includes(service.domain)) {
      return service.name;
    }
  }
  
  return null;
} 