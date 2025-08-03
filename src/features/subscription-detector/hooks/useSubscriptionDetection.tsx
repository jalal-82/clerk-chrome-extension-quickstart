/**
 * Hook for subscription detection
 * Combines URL, keyword, and page analysis to determine when to show the extension
 */

import { useState, useEffect } from 'react';
import { analyzeUrlForSubscription } from '../utils/urlAnalyzer';
import { scanPageForSubscriptionKeywords } from '../utils/keywordDetector';
import { analyzePageForSubscription } from '../utils/pageAnalyzer';
import type { DetectionResult, DetectionMethod } from '../types/detection';

/**
 * Hook that detects subscription-related pages
 * @returns Detection result and loading state
 */
export function useSubscriptionDetection(): {
  detection: DetectionResult | null;
  isLoading: boolean;
  error: string | null;
} {
  const [detection, setDetection] = useState<DetectionResult | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const runDetection = async () => {
      try {
        setIsLoading(true);
        setError(null);

        // Run all detection methods
        const urlResult = analyzeUrlForSubscription(window.location.href);
        const keywordResult = scanPageForSubscriptionKeywords();
        const pageResult = analyzePageForSubscription();

        // Combine results
        const detectionMethods: DetectionMethod[] = [
          {
            method: 'url',
            confidence: urlResult.confidence,
            isSubscriptionPage: urlResult.isSubscriptionPage,
            reason: urlResult.reason,
            details: urlResult
          },
          {
            method: 'keyword',
            confidence: keywordResult.confidence,
            isSubscriptionPage: keywordResult.isSubscriptionPage,
            reason: keywordResult.reason,
            details: keywordResult
          },
          {
            method: 'page',
            confidence: pageResult.confidence,
            isSubscriptionPage: pageResult.isSubscriptionPage,
            reason: pageResult.reason,
            details: pageResult
          }
        ];

        // Calculate overall confidence and decision
        const overallConfidence = calculateOverallConfidence(detectionMethods);
        const shouldShowExtension = determineShouldShowExtension(detectionMethods, overallConfidence);
        const detectedService = urlResult.detectedService;

        const result: DetectionResult = {
          shouldShowExtension,
          confidence: overallConfidence,
          detectedService,
          detectionMethods,
          reason: generateReason(detectionMethods, shouldShowExtension)
        };

        setDetection(result);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Detection failed');
      } finally {
        setIsLoading(false);
      }
    };

    // Run detection when component mounts
    runDetection();

    // Re-run detection when URL changes
    const handleUrlChange = () => {
      runDetection();
    };

    // Listen for URL changes (for SPA navigation)
    window.addEventListener('popstate', handleUrlChange);
    
    // Use MutationObserver to detect dynamic content changes
    const observer = new MutationObserver(() => {
      // Debounce detection to avoid excessive calls
      setTimeout(runDetection, 1000);
    });

    observer.observe(document.body, {
      childList: true,
      subtree: true
    });

    return () => {
      window.removeEventListener('popstate', handleUrlChange);
      observer.disconnect();
    };
  }, []);

  return { detection, isLoading, error };
}

/**
 * Calculates overall confidence from all detection methods
 */
function calculateOverallConfidence(methods: DetectionMethod[]): number {
  if (methods.length === 0) return 0;

  // Weight the methods (URL analysis is most reliable)
  const weights = {
    url: 0.5,
    keyword: 0.3,
    page: 0.2
  };

  let weightedSum = 0;
  let totalWeight = 0;

  for (const method of methods) {
    const weight = weights[method.method];
    weightedSum += method.confidence * weight;
    totalWeight += weight;
  }

  return totalWeight > 0 ? weightedSum / totalWeight : 0;
}

/**
 * Determines if the extension should be shown based on detection results
 */
function determineShouldShowExtension(
  methods: DetectionMethod[], 
  overallConfidence: number
): boolean {
  // Show if any method has high confidence
  const hasHighConfidence = methods.some(method => method.confidence > 0.7);
  
  // Show if overall confidence is good
  const hasGoodOverallConfidence = overallConfidence > 0.5;
  
  // Show if multiple methods agree it's a subscription page
  const agreeingMethods = methods.filter(method => method.isSubscriptionPage);
  const hasMultipleAgreements = agreeingMethods.length >= 2;
  
  return hasHighConfidence || hasGoodOverallConfidence || hasMultipleAgreements;
}

/**
 * Generates a human-readable reason for the detection result
 */
function generateReason(methods: DetectionMethod[], shouldShow: boolean): string {
  if (!shouldShow) {
    return "No strong indicators of subscription page found";
  }

  const positiveMethods = methods.filter(method => method.isSubscriptionPage);
  
  if (positiveMethods.length === 0) {
    return "Combined analysis suggests subscription page";
  }

  const methodNames = positiveMethods.map(method => method.method);
  return `Detected subscription indicators via: ${methodNames.join(', ')}`;
}
