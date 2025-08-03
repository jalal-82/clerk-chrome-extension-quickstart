/**
 * Types for subscription detection results
 */

export interface DetectionResult {
  shouldShowExtension: boolean;
  confidence: number; // 0-1 scale
  detectedService?: string;
  detectionMethods: DetectionMethod[];
  reason: string;
}

export interface DetectionMethod {
  method: 'url' | 'keyword' | 'page';
  confidence: number;
  isSubscriptionPage: boolean;
  reason: string;
  details?: any;
}

export interface UrlAnalysisResult {
  isSubscriptionPage: boolean;
  confidence: number;
  detectedService?: string;
  reason: string;
}

export interface KeywordAnalysisResult {
  isSubscriptionPage: boolean;
  confidence: number;
  detectedKeywords: string[];
  reason: string;
}

export interface PageAnalysisResult {
  isSubscriptionPage: boolean;
  confidence: number;
  detectedElements: string[];
  reason: string;
}
