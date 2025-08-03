# DueDrop Chrome Extension

A Chrome extension that detects subscription pages and redirects users to the DueDrop dashboard for easy subscription management.

## Features

- **Smart Detection**: Automatically detects subscription/checkout pages using URL analysis, keyword scanning, and page structure analysis
- **Service Recognition**: Identifies popular subscription services (Netflix, Spotify, etc.)
- **Seamless Integration**: Redirects to your DueDrop SaaS dashboard with detected service pre-filled
- **Non-Intrusive**: Small, dismissible indicator that appears only when relevant

## How It Works

1. **Detection**: The extension analyzes web pages for subscription-related patterns
2. **Indicator**: When a subscription page is detected, a small popup appears
3. **Redirect**: Clicking "Add to DueDrop" opens your SaaS dashboard in a new tab
4. **Integration**: The detected service name is passed as a URL parameter

## Development

### Prerequisites

- Node.js 18+
- pnpm

### Setup

1. **Install dependencies**:
   ```bash
   pnpm install
   ```

2. **Build the extension**:
   ```bash
   pnpm dev
   ```

3. **Load in Chrome**:
   - Open Chrome and go to `chrome://extensions/`
   - Enable "Developer mode"
   - Click "Load unpacked"
   - Select the `build/chrome-mv3-dev` folder

### Testing

1. **Visit subscription pages** like:
   - Netflix checkout
   - Spotify premium
   - Any site with `/checkout`, `/subscribe`, or billing keywords

2. **Look for the indicator** in the top-right corner

3. **Click "Add to DueDrop"** to test the redirect

## Architecture

### Detection Algorithm

The extension uses a multi-layered detection approach:

1. **URL Analysis** (`src/features/subscription-detector/utils/urlAnalyzer.ts`)
   - Checks for checkout/subscription patterns in URLs
   - Identifies known service domains

2. **Keyword Detection** (`src/features/subscription-detector/utils/keywordDetector.ts`)
   - Scans page text for subscription-related keywords
   - Analyzes heading and button text

3. **Page Structure Analysis** (`src/features/subscription-detector/utils/pageAnalyzer.ts`)
   - Examines forms, buttons, and pricing elements
   - Looks for subscription-specific UI patterns

### Components

- **DetectionIndicator**: The popup that appears when subscription pages are detected
- **useSubscriptionDetection**: React hook that orchestrates the detection logic
- **Background Script**: Handles opening the extension popup

## Configuration

### Dashboard URL

Update the dashboard URL in `src/popup.tsx`:

```typescript
const dashboardUrl = 'http://localhost:3000'; // Change to your production URL
```

### Detection Sensitivity

Adjust detection confidence thresholds in the detection utilities:

- `src/features/subscription-detector/utils/urlAnalyzer.ts`
- `src/features/subscription-detector/utils/keywordDetector.ts`
- `src/features/subscription-detector/utils/pageAnalyzer.ts`

## Integration with Your SaaS

The extension passes the detected service as a URL parameter:

```
http://localhost:3000?service=Netflix
```

In your SaaS dashboard, you can:

1. **Read the service parameter**:
   ```javascript
   const urlParams = new URLSearchParams(window.location.search);
   const service = urlParams.get('service');
   ```

2. **Pre-fill forms** with the detected service name

3. **Show relevant UI** based on the detected service

## Production Deployment

1. **Update dashboard URL** to your production domain
2. **Build for production**:
   ```bash
   pnpm build
   ```
3. **Package the extension** from the `build/chrome-mv3-prod` folder
4. **Submit to Chrome Web Store** (optional)

## License

MIT
