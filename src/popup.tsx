import { useState, useEffect } from "react"

import "~style.css"

function IndexPopup() {
  const [detectedService, setDetectedService] = useState<string | undefined>(undefined);
  const [autoDetectionEnabled, setAutoDetectionEnabled] = useState(true);

  useEffect(() => {
    // Get detected service and auto detection setting
    chrome.storage.local.get(['detectedService', 'autoDetectionEnabled'], (result) => {
      if (result.detectedService) {
        setDetectedService(result.detectedService);
        chrome.storage.local.remove(['detectedService']);
      }
      if (result.autoDetectionEnabled !== undefined) {
        setAutoDetectionEnabled(result.autoDetectionEnabled);
      }
    });
  }, []);

  const handleAddToDueDrop = () => {
    // Redirect to your SaaS dashboard
    const dashboardUrl = 'http://localhost:3000/dashboard';
    const params = detectedService ? `?service=${encodeURIComponent(detectedService)}` : '';
    window.open(`${dashboardUrl}${params}`, '_blank');
  };

  const handleToggleAutoDetection = () => {
    const newValue = !autoDetectionEnabled;
    setAutoDetectionEnabled(newValue);
    chrome.storage.local.set({ autoDetectionEnabled: newValue });
  };

  return (
    <div className="plasmo-flex plasmo-flex-col plasmo-h-[230px] plasmo-w-[350px] plasmo-bg-white plasmo-border plasmo-border-gray-200 plasmo-rounded-lg plasmo-shadow-sm">
      {/* Header */}
      <div className="plasmo-flex plasmo-items-center plasmo-justify-between plasmo-px-4 plasmo-py-3 plasmo-border-b plasmo-border-gray-100 plasmo-bg-gray-50/50">
        <div className="plasmo-flex plasmo-items-center plasmo-gap-2">
          <div className="plasmo-w-2 plasmo-h-2 plasmo-bg-blue-500 plasmo-rounded-full"></div>
          <h1 className="plasmo-text-sm plasmo-font-semibold plasmo-text-gray-900">DueDrop</h1>
        </div>
        <div className="plasmo-w-2 plasmo-h-2 plasmo-bg-gray-300 plasmo-rounded-full"></div>
      </div>
      
      {/* Content */}
      <div className="plasmo-flex-1 plasmo-px-4 plasmo-py-4 plasmo-flex plasmo-flex-col plasmo-justify-center">
        <div className="plasmo-text-center plasmo-space-y-4">
          {/* Icon and Title */}
          <div className="plasmo-flex plasmo-flex-col plasmo-items-center plasmo-gap-2">
            <div className="plasmo-w-8 plasmo-h-8 plasmo-bg-blue-100 plasmo-rounded-lg plasmo-flex plasmo-items-center plasmo-justify-center">
              <span className="plasmo-text-blue-600 plasmo-text-lg">💧</span>
            </div>
            <h2 className="plasmo-text-base plasmo-font-semibold plasmo-text-gray-900">
              {detectedService ? 'Service Detected!' : 'Welcome to DueDrop'}
            </h2>
          </div>

          {/* Description */}
          <p className="plasmo-text-xs plasmo-text-gray-600 plasmo-leading-relaxed plasmo-max-w-[280px] plasmo-mx-auto">
            {detectedService 
              ? `We detected ${detectedService} on this page. Add it to your subscription tracker.`
              : 'Manage your subscriptions and never miss a payment again.'
            }
          </p>
          
          {/* Action Button */}
          <button
            onClick={handleAddToDueDrop}
            className="plasmo-w-full plasmo-bg-blue-600 plasmo-text-white plasmo-px-4 plasmo-py-2.5 plasmo-rounded-md plasmo-text-sm plasmo-font-medium plasmo-transition-all plasmo-duration-200 hover:plasmo-bg-blue-700 active:plasmo-scale-95 plasmo-shadow-sm"
          >
            {detectedService ? 'Add to DueDrop' : 'Open Dashboard'}
          </button>
          
          {/* Settings Section */}
          <div className="plasmo-pt-3 plasmo-border-t plasmo-border-gray-100">
            <div className="plasmo-flex plasmo-items-center plasmo-justify-between plasmo-px-1">
              <div className="plasmo-flex plasmo-flex-col plasmo-items-start">
                <span className="plasmo-text-xs plasmo-font-medium plasmo-text-gray-700">Auto Detection</span>
                <span className="plasmo-text-xs plasmo-text-gray-500">Show alerts on subscription pages</span>
              </div>
              <button
                onClick={handleToggleAutoDetection}
                className={`plasmo-relative plasmo-inline-flex plasmo-h-6 plasmo-w-11 plasmo-items-center plasmo-rounded-full plasmo-transition-colors plasmo-focus:outline-none plasmo-focus:ring-2 plasmo-focus:ring-blue-500 plasmo-focus:ring-offset-2 ${
                  autoDetectionEnabled 
                    ? 'plasmo-bg-blue-600' 
                    : 'plasmo-bg-gray-200'
                }`}
              >
                <span
                  className={`plasmo-inline-block plasmo-h-5 plasmo-w-5 plasmo-transform plasmo-rounded-full plasmo-bg-white plasmo-transition-transform plasmo-shadow-sm ${
                    autoDetectionEnabled 
                      ? 'plasmo-translate-x-5' 
                      : 'plasmo-translate-x-0.5'
                  }`}
                />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default IndexPopup
