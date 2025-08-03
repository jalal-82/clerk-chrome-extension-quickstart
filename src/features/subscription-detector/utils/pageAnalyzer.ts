/**
 * Page analyzer for detecting subscription-related page structure
 * Checks for forms, buttons, and page elements that indicate subscription pages
 */

export interface PageAnalysisResult {
  isSubscriptionPage: boolean;
  confidence: number; // 0-1 scale
  detectedElements: string[];
  reason: string;
}

/**
 * Analyzes page structure for subscription-related elements
 * @returns Analysis result with detected elements
 */
export function analyzePageForSubscription(): PageAnalysisResult {
  const detectedElements: string[] = [];
  let confidence = 0;
  
  // Check for subscription-related forms
  const formAnalysis = analyzeForms();
  detectedElements.push(...formAnalysis.elements);
  confidence += formAnalysis.confidence;
  
  // Check for subscription-related buttons
  const buttonAnalysis = analyzeButtons();
  detectedElements.push(...buttonAnalysis.elements);
  confidence += buttonAnalysis.confidence;
  
  // Check for subscription-related page structure
  const structureAnalysis = analyzePageStructure();
  detectedElements.push(...structureAnalysis.elements);
  confidence += structureAnalysis.confidence;
  
  // Cap confidence at 1.0
  confidence = Math.min(confidence, 1.0);
  
  return {
    isSubscriptionPage: confidence > 0.4,
    confidence,
    detectedElements,
    reason: `Found ${detectedElements.length} subscription-related elements`
  };
}

/**
 * Analyzes forms for subscription-related patterns
 */
function analyzeForms(): { elements: string[], confidence: number } {
  const elements: string[] = [];
  let confidence = 0;
  
  const forms = document.querySelectorAll('form');
  
  for (const form of forms) {
    const formText = form.textContent?.toLowerCase() || '';
    const formAction = form.action?.toLowerCase() || '';
    
    // Check for subscription-related form text
    if (formText.includes('subscription') || formText.includes('subscribe')) {
      elements.push('subscription form');
      confidence += 0.3;
    }
    
    // Check for billing/payment forms
    if (formText.includes('billing') || formText.includes('payment')) {
      elements.push('billing form');
      confidence += 0.25;
    }
    
    // Check for checkout forms
    if (formAction.includes('checkout') || formAction.includes('payment')) {
      elements.push('checkout form');
      confidence += 0.2;
    }
    
    // Check for subscription-related inputs
    const inputs = form.querySelectorAll('input, select, textarea');
    for (const input of inputs) {
      const inputElement = input as HTMLInputElement;
      const placeholder = inputElement.placeholder?.toLowerCase() || '';
      const name = inputElement.name?.toLowerCase() || '';
      const id = inputElement.id?.toLowerCase() || '';
      
      if (placeholder.includes('subscription') || name.includes('subscription') || id.includes('subscription')) {
        elements.push('subscription input');
        confidence += 0.1;
      }
      
      if (placeholder.includes('billing') || name.includes('billing') || id.includes('billing')) {
        elements.push('billing input');
        confidence += 0.1;
      }
    }
  }
  
  return { elements, confidence };
}

/**
 * Analyzes buttons for subscription-related actions
 */
function analyzeButtons(): { elements: string[], confidence: number } {
  const elements: string[] = [];
  let confidence = 0;
  
  const buttons = document.querySelectorAll('button, input[type="submit"], a');
  
  for (const button of buttons) {
    const buttonText = button.textContent?.toLowerCase() || '';
    const buttonTitle = button.getAttribute('title')?.toLowerCase() || '';
    const buttonAriaLabel = button.getAttribute('aria-label')?.toLowerCase() || '';
    
    const allText = `${buttonText} ${buttonTitle} ${buttonAriaLabel}`;
    
    // High confidence subscription actions
    if (allText.includes('subscribe') || allText.includes('subscription')) {
      elements.push('subscribe button');
      confidence += 0.4;
    }
    
    // Medium confidence actions
    if (allText.includes('checkout') || allText.includes('purchase') || allText.includes('buy')) {
      elements.push('purchase button');
      confidence += 0.3;
    }
    
    if (allText.includes('upgrade') || allText.includes('premium') || allText.includes('pro')) {
      elements.push('upgrade button');
      confidence += 0.25;
    }
    
    if (allText.includes('trial') || allText.includes('free trial')) {
      elements.push('trial button');
      confidence += 0.2;
    }
    
    // Lower confidence actions
    if (allText.includes('plan') || allText.includes('billing') || allText.includes('payment')) {
      elements.push('plan/billing button');
      confidence += 0.15;
    }
  }
  
  return { elements, confidence };
}

/**
 * Analyzes overall page structure for subscription indicators
 */
function analyzePageStructure(): { elements: string[], confidence: number } {
  const elements: string[] = [];
  let confidence = 0;
  
  // Check for pricing tables
  const pricingElements = document.querySelectorAll('[class*="pricing"], [class*="plan"], [class*="tier"]');
  if (pricingElements.length > 0) {
    elements.push('pricing table');
    confidence += 0.2;
  }
  
  // Check for subscription-related headings
  const headings = document.querySelectorAll('h1, h2, h3, h4, h5, h6');
  for (const heading of headings) {
    const headingText = heading.textContent?.toLowerCase() || '';
    
    if (headingText.includes('subscription') || headingText.includes('subscribe')) {
      elements.push('subscription heading');
      confidence += 0.3;
    }
    
    if (headingText.includes('pricing') || headingText.includes('plans')) {
      elements.push('pricing heading');
      confidence += 0.2;
    }
    
    if (headingText.includes('billing') || headingText.includes('payment')) {
      elements.push('billing heading');
      confidence += 0.15;
    }
  }
  
  // Check for subscription-related meta tags
  const metaDescription = document.querySelector('meta[name="description"]')?.getAttribute('content')?.toLowerCase() || '';
  if (metaDescription.includes('subscription') || metaDescription.includes('subscribe')) {
    elements.push('subscription meta description');
    confidence += 0.1;
  }
  
  return { elements, confidence };
} 