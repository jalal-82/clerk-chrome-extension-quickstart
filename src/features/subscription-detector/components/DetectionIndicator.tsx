/**
 * Detection indicator that appears when a subscription page is detected
 * Shows a small popup with service info and button to add to DueDrop
 */

import { useState, useEffect } from 'react';
import { useSubscriptionDetection } from '../hooks/useSubscriptionDetection';

export function DetectionIndicator() {
  const { detection, isLoading, error } = useSubscriptionDetection();
  const [isDismissed, setIsDismissed] = useState(false);
  const [autoDetectionEnabled, setAutoDetectionEnabled] = useState(true);

  // Check if auto detection is enabled
  useEffect(() => {
    chrome.storage.local.get(['autoDetectionEnabled'], (result) => {
      if (result.autoDetectionEnabled !== undefined) {
        setAutoDetectionEnabled(result.autoDetectionEnabled);
      }
    });
  }, []);

  // Show loading state
  if (isLoading) {
    return null; // Don't show anything while loading
  }

  // Show error state
  if (error) {
    console.error('Detection error:', error);
    return null; // Don't show anything on error
  }

  // Don't show if auto detection is disabled, no detection, or dismissed
  if (!autoDetectionEnabled || !detection.shouldShowExtension || isDismissed) {
    return null;
  }

  const handleAddToDueDrop = () => {
    // Store detected service for popup
    if (detection.detectedService) {
      chrome.storage.local.set({
        detectedService: detection.detectedService
      });
    }
    
    // Open the extension popup
    chrome.runtime.sendMessage({
      action: 'openPopup',
      detectedService: detection.detectedService
    });
  };

  const handleClose = () => {
    setIsDismissed(true);
  };

  return (
    <div style={{
      position: 'fixed',
      top: '100px',
      right: '20px',
      background: 'white',
      border: '1px solid rgba(255, 255, 255, 0.2)',
      borderRadius: '12px',
      padding: '16px',
      boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
      zIndex: 10000,
      maxWidth: '320px',
      fontFamily: 'system-ui, -apple-system, sans-serif',
      backdropFilter: 'blur(8px)'
    }}>
      {/* Header with close button */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '12px'
      }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px'
        }}>
          <div style={{
            width: '8px',
            height: '8px',
            backgroundColor: '#3b82f6',
            borderRadius: '50%'
          }}></div>
          <span style={{
            fontSize: '14px',
            fontWeight: '600',
            color: '#111827'
          }}>
            DueDrop Detected
          </span>
        </div>
        
        <button 
          onClick={handleClose}
          style={{
            background: 'none',
            border: 'none',
            fontSize: '18px',
            cursor: 'pointer',
            color: '#6b7280',
            width: '24px',
            height: '24px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            borderRadius: '50%',
            transition: 'all 0.2s ease',
            padding: '0'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = '#f3f4f6';
            e.currentTarget.style.color = '#374151';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = 'transparent';
            e.currentTarget.style.color = '#6b7280';
          }}
          title="Close"
        >
          ×
        </button>
      </div>

      {/* Icon and Service Info */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
        marginBottom: '16px'
      }}>
        <div style={{
          width: '32px',
          height: '32px',
          backgroundColor: '#dbeafe',
          borderRadius: '8px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}>
          <span style={{ fontSize: '16px' }}>💧</span>
        </div>
        
        <div style={{ flex: 1 }}>
          {detection.detectedService && (
            <div style={{
              fontSize: '14px',
              fontWeight: '600',
              color: '#111827',
              marginBottom: '2px'
            }}>
              {detection.detectedService}
            </div>
          )}
          <div style={{
            fontSize: '12px',
            color: '#6b7280'
          }}>
            Confidence: {Math.round(detection.confidence * 100)}%
          </div>
        </div>
      </div>

      {/* Action Button */}
      <button
        onClick={handleAddToDueDrop}
        style={{
          width: '100%',
          padding: '10px 16px',
          background: '#2563eb',
          color: 'white',
          border: 'none',
          borderRadius: '8px',
          fontSize: '13px',
          fontWeight: '500',
          cursor: 'pointer',
          transition: 'all 0.2s ease',
          boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)'
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.backgroundColor = '#1d4ed8';
          e.currentTarget.style.transform = 'translateY(-1px)';
          e.currentTarget.style.boxShadow = '0 4px 6px -1px rgba(0, 0, 0, 0.1)';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.backgroundColor = '#2563eb';
          e.currentTarget.style.transform = 'translateY(0)';
          e.currentTarget.style.boxShadow = '0 1px 3px 0 rgba(0, 0, 0, 0.1)';
        }}
        onMouseDown={(e) => {
          e.currentTarget.style.transform = 'translateY(0)';
        }}
      >
        Add to DueDrop
      </button>
    </div>
  );
}
