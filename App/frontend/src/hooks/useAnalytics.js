import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

const useAnalytics = () => {
  const location = useLocation();

  useEffect(() => {
    // In a real app, you would send this to your analytics service
    console.log(`Page viewed: ${location.pathname}`);
    
    // Example: Send to Google Analytics
    if (window.gtag) {
      window.gtag('config', 'YOUR_GA_ID', {
        page_path: location.pathname,
      });
    }
  }, [location]);
};

export default useAnalytics;