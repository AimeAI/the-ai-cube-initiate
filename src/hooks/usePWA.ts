import { useState, useEffect } from 'react';

interface PWAInstallPrompt {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

interface PWAHook {
  isInstallable: boolean;
  isInstalled: boolean;
  isOffline: boolean;
  installApp: () => Promise<void>;
  updateAvailable: boolean;
  updateApp: () => Promise<void>;
  shareContent: (data: ShareData) => Promise<void>;
  canShare: boolean;
  registerForNotifications: () => Promise<boolean>;
  notificationPermission: NotificationPermission;
}

// Extend Window interface for PWA APIs
declare global {
  interface Window {
    deferredPrompt?: PWAInstallPrompt;
  }
}

export const usePWA = (): PWAHook => {
  const [isInstallable, setIsInstallable] = useState(false);
  const [isInstalled, setIsInstalled] = useState(false);
  const [isOffline, setIsOffline] = useState(!navigator.onLine);
  const [updateAvailable, setUpdateAvailable] = useState(false);
  const [deferredPrompt, setDeferredPrompt] = useState<PWAInstallPrompt | null>(null);
  const [notificationPermission, setNotificationPermission] = useState<NotificationPermission>('default');

  // Check if app is installed
  useEffect(() => {
    const checkInstallation = () => {
      // Check if running in standalone mode
      const isStandalone = window.matchMedia('(display-mode: standalone)').matches;
      const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
      const isIOSStandalone = isIOS && (window.navigator as any).standalone;
      
      setIsInstalled(isStandalone || isIOSStandalone);
    };

    checkInstallation();
    
    // Listen for display mode changes
    const mediaQuery = window.matchMedia('(display-mode: standalone)');
    mediaQuery.addEventListener('change', checkInstallation);
    
    return () => mediaQuery.removeEventListener('change', checkInstallation);
  }, []);

  // Handle beforeinstallprompt event
  useEffect(() => {
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as any);
      setIsInstallable(true);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    
    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    };
  }, []);

  // Handle app installed event
  useEffect(() => {
    const handleAppInstalled = () => {
      setIsInstalled(true);
      setIsInstallable(false);
      setDeferredPrompt(null);
      
      // Track installation
      if (typeof gtag !== 'undefined') {
        gtag('event', 'pwa_install', {
          event_category: 'engagement',
          event_label: 'PWA Installation'
        });
      }
    };

    window.addEventListener('appinstalled', handleAppInstalled);
    
    return () => {
      window.removeEventListener('appinstalled', handleAppInstalled);
    };
  }, []);

  // Monitor online/offline status
  useEffect(() => {
    const handleOnline = () => setIsOffline(false);
    const handleOffline = () => setIsOffline(true);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  // Service Worker update detection
  useEffect(() => {
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.register('/service-worker.js').then((registration) => {
        // Check for updates
        registration.addEventListener('updatefound', () => {
          const newWorker = registration.installing;
          if (newWorker) {
            newWorker.addEventListener('statechange', () => {
              if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                setUpdateAvailable(true);
              }
            });
          }
        });

        // Listen for service worker messages
        navigator.serviceWorker.addEventListener('message', (event) => {
          if (event.data && event.data.type === 'UPDATE_AVAILABLE') {
            setUpdateAvailable(true);
          }
        });
      }).catch((error) => {
        console.error('Service Worker registration failed:', error);
      });
    }
  }, []);

  // Check notification permission
  useEffect(() => {
    if ('Notification' in window) {
      setNotificationPermission(Notification.permission);
    }
  }, []);

  // Install app function
  const installApp = async (): Promise<void> => {
    if (!deferredPrompt) {
      throw new Error('No install prompt available');
    }

    try {
      await deferredPrompt.prompt();
      const choiceResult = await deferredPrompt.userChoice;
      
      if (choiceResult.outcome === 'accepted') {
        console.log('User accepted the install prompt');
      } else {
        console.log('User dismissed the install prompt');
      }
      
      setDeferredPrompt(null);
      setIsInstallable(false);
    } catch (error) {
      console.error('Error installing app:', error);
      throw error;
    }
  };

  // Update app function
  const updateApp = async (): Promise<void> => {
    if ('serviceWorker' in navigator) {
      const registration = await navigator.serviceWorker.getRegistration();
      if (registration?.waiting) {
        registration.waiting.postMessage({ type: 'SKIP_WAITING' });
        setUpdateAvailable(false);
        // Reload page to apply update
        window.location.reload();
      }
    }
  };

  // Share content function
  const shareContent = async (data: ShareData): Promise<void> => {
    if (navigator.share) {
      try {
        await navigator.share(data);
        
        // Track sharing
        if (typeof gtag !== 'undefined') {
          gtag('event', 'share', {
            event_category: 'engagement',
            event_label: data.title || 'Content Shared'
          });
        }
      } catch (error) {
        if ((error as Error).name !== 'AbortError') {
          console.error('Error sharing:', error);
          throw error;
        }
      }
    } else {
      throw new Error('Web Share API not supported');
    }
  };

  // Register for notifications
  const registerForNotifications = async (): Promise<boolean> => {
    if (!('Notification' in window)) {
      console.log('Notifications not supported');
      return false;
    }

    try {
      const permission = await Notification.requestPermission();
      setNotificationPermission(permission);
      
      if (permission === 'granted') {
        // Register with service worker for push notifications
        if ('serviceWorker' in navigator) {
          const registration = await navigator.serviceWorker.ready;
          
          // Subscribe to push notifications
          const subscription = await registration.pushManager.subscribe({
            userVisibleOnly: true,
            applicationServerKey: urlBase64ToUint8Array(process.env.REACT_APP_VAPID_PUBLIC_KEY || '')
          });

          // Send subscription to server
          await fetch('/api/subscribe', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(subscription)
          });

          return true;
        }
      }
      
      return false;
    } catch (error) {
      console.error('Error registering for notifications:', error);
      return false;
    }
  };

  return {
    isInstallable,
    isInstalled,
    isOffline,
    installApp,
    updateAvailable,
    updateApp,
    shareContent,
    canShare: 'share' in navigator,
    registerForNotifications,
    notificationPermission
  };
};

// Helper function to convert VAPID key
function urlBase64ToUint8Array(base64String: string): Uint8Array {
  const padding = '='.repeat((4 - base64String.length % 4) % 4);
  const base64 = (base64String + padding)
    .replace(/-/g, '+')
    .replace(/_/g, '/');

  const rawData = window.atob(base64);
  const outputArray = new Uint8Array(rawData.length);

  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray;
}

// Hook for managing offline storage
export const useOfflineStorage = () => {
  const [isSupported, setIsSupported] = useState(false);
  const [storageQuota, setStorageQuota] = useState<{ used: number; total: number } | null>(null);

  useEffect(() => {
    // Check for storage support
    const checkSupport = async () => {
      if ('storage' in navigator && 'estimate' in navigator.storage) {
        setIsSupported(true);
        
        try {
          const estimate = await navigator.storage.estimate();
          setStorageQuota({
            used: estimate.usage || 0,
            total: estimate.quota || 0
          });
        } catch (error) {
          console.error('Error getting storage estimate:', error);
        }
      }
    };

    checkSupport();
  }, []);

  const clearOfflineData = async (): Promise<void> => {
    if ('caches' in window) {
      const cacheNames = await caches.keys();
      await Promise.all(cacheNames.map(name => caches.delete(name)));
    }
    
    // Clear IndexedDB if used
    if ('indexedDB' in window) {
      // Implementation depends on your IndexedDB usage
    }
  };

  const getStorageUsage = async (): Promise<{ used: number; total: number } | null> => {
    if ('storage' in navigator && 'estimate' in navigator.storage) {
      try {
        const estimate = await navigator.storage.estimate();
        return {
          used: estimate.usage || 0,
          total: estimate.quota || 0
        };
      } catch (error) {
        console.error('Error getting storage usage:', error);
        return null;
      }
    }
    return null;
  };

  return {
    isSupported,
    storageQuota,
    clearOfflineData,
    getStorageUsage
  };
};