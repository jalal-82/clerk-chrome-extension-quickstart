/**
 * Background script for handling extension popup opening
 */

// Listen for messages from content scripts
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === 'openPopup') {
    // Store the detected service
    if (message.detectedService) {
      chrome.storage.local.set({ 
        detectedService: message.detectedService 
      });
    }
    
    // Open the extension popup
    chrome.action.openPopup();
  }
}); 