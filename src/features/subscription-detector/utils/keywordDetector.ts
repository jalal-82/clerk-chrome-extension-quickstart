/**
 * Keyword detector for subscription-related page content
 * Scans page text for subscription and payment keywords
 */

export interface KeywordAnalysisResult {
  isSubscriptionPage: boolean;
  confidence: number; // 0-1 scale
  detectedKeywords: string[];
  reason: string;
}

/**
 * Scans page content for subscription-related keywords
 * @returns Analysis result with detected keywords
 */
export function scanPageForSubscriptionKeywords(): KeywordAnalysisResult {
  const pageText = getPageText();
  const detectedKeywords = findSubscriptionKeywords(pageText);
  
  if (detectedKeywords.length === 0) {
    return {
      isSubscriptionPage: false,
      confidence: 0.1,
      detectedKeywords: [],
      reason: "No subscription keywords found"
    };
  }
  
  // Calculate confidence based on number and type of keywords
  const confidence = calculateKeywordConfidence(detectedKeywords);
  
  return {
    isSubscriptionPage: confidence > 0.3,
    confidence,
    detectedKeywords,
    reason: `Found ${detectedKeywords.length} subscription-related keywords`
  };
}

/**
 * Extracts all text content from the current page
 */
function getPageText(): string {
  // Get text from body, excluding scripts and styles
  const bodyText = document.body?.innerText || '';
  
  // Also check for form labels and placeholders
  const formElements = document.querySelectorAll('input, select, textarea');
  const formText = Array.from(formElements)
    .map(el => {
      const input = el as HTMLInputElement;
      return [
        input.placeholder,
        input.getAttribute('aria-label'),
        input.getAttribute('title')
      ].filter(Boolean).join(' ');
    })
    .join(' ');
  
  return (bodyText + ' ' + formText).toLowerCase();
}

/**
 * Finds subscription-related keywords in text
 */
function findSubscriptionKeywords(text: string): string[] {
  const subscriptionKeywords = [
    // Payment and billing terms
    'subscription', 'subscribe', 'billing', 'payment', 'recurring',
    'monthly', 'yearly', 'annual', 'quarterly', 'weekly',
    'auto-renew', 'auto-renewal', 'renewal', 'renew',
    'billing cycle', 'payment cycle', 'billing date',
    
    // Subscription-specific terms
    'plan', 'premium', 'pro', 'plus', 'basic', 'standard',
    'trial', 'free trial', 'cancel', 'cancellation',
    'upgrade', 'downgrade', 'change plan',
    
    // Service-specific terms
    'streaming', 'music', 'video', 'software', 'cloud',
    'storage', 'backup', 'security', 'vpn',
    
    // Checkout and purchase terms
    'checkout', 'purchase', 'buy', 'order', 'confirm',
    'complete purchase', 'place order', 'proceed to payment'
  ];
  
  const foundKeywords: string[] = [];
  
  for (const keyword of subscriptionKeywords) {
    if (text.includes(keyword.toLowerCase())) {
      foundKeywords.push(keyword);
    }
  }
  
  return foundKeywords;
}

/**
 * Calculates confidence based on detected keywords
 */
function calculateKeywordConfidence(keywords: string[]): number {
  if (keywords.length === 0) return 0;
  
  // High confidence keywords
  const highConfidenceKeywords = [
    'subscription', 'subscribe', 'billing', 'recurring',
    'auto-renew', 'billing cycle', 'checkout'
  ];
  
  // Medium confidence keywords
  const mediumConfidenceKeywords = [
    'payment', 'monthly', 'yearly', 'plan', 'premium',
    'trial', 'upgrade', 'purchase'
  ];
  
  let confidence = 0;
  
  for (const keyword of keywords) {
    if (highConfidenceKeywords.includes(keyword)) {
      confidence += 0.3;
    } else if (mediumConfidenceKeywords.includes(keyword)) {
      confidence += 0.15;
    } else {
      confidence += 0.05;
    }
  }
  
  // Cap confidence at 1.0
  return Math.min(confidence, 1.0);
} 