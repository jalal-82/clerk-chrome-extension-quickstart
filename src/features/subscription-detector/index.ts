/**
 * Subscription detection feature exports
 */

// Components
export { DetectionIndicator } from './components/DetectionIndicator';

// Hooks
export { useSubscriptionDetection } from './hooks/useSubscriptionDetection';

// Utils
export { analyzeUrlForSubscription } from './utils/urlAnalyzer';
export { scanPageForSubscriptionKeywords } from './utils/keywordDetector';
export { analyzePageForSubscription } from './utils/pageAnalyzer';

// Types
export type {
  DetectionResult,
  DetectionMethod,
  UrlAnalysisResult,
  KeywordAnalysisResult,
  PageAnalysisResult
} from './types/detection';
