import { useEffect, useRef, useCallback } from 'react';

interface UseA11yOptions {
  autoAnnounce?: boolean;
  autoFocus?: boolean;
  skipLinksTarget?: string;
}

export const useA11y = ({ 
  autoAnnounce = false, 
  autoFocus = false,
  skipLinksTarget = 'main-content'
}: UseA11yOptions = {}) => {
  const announcementRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (autoAnnounce) {
      // Announce page change to screen readers
      const announcement = document.title;
      if (announcementRef.current) {
        announcementRef.current.textContent = `Página cargada: ${announcement}`;
      }
    }

    if (autoFocus) {
      // Focus main content for keyboard users
      const mainContent = document.getElementById(skipLinksTarget);
      if (mainContent) {
        mainContent.focus();
      }
    }
  }, [autoAnnounce, autoFocus, skipLinksTarget]);

  const announceToScreenReader = useCallback((message: string) => {
    if (announcementRef.current) {
      announcementRef.current.textContent = message;
    }
  }, []);

  const announcePageChange = useCallback((message: string) => {
    announceToScreenReader(message);
  }, [announceToScreenReader]);

  const focusMainContent = useCallback(() => {
    const mainContent = document.getElementById(skipLinksTarget);
    if (mainContent) {
      mainContent.focus();
    }
  }, [skipLinksTarget]);

  const focusElement = useCallback((selector: string, delay: number = 0) => {
    setTimeout(() => {
      const element = document.querySelector(selector) as HTMLElement;
      if (element) {
        element.focus();
      }
    }, delay);
  }, []);

  return {
    announcementRef,
    announceToScreenReader,
    announcePageChange,
    focusMainContent,
    focusElement
  };
};

// Hook para manejar el foco del teclado
export const useFocusManagement = () => {
  const trapFocus = (element: HTMLElement) => {
    const focusableElements = element.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );
    
    const firstElement = focusableElements[0] as HTMLElement;
    const lastElement = focusableElements[focusableElements.length - 1] as HTMLElement;

    const handleTabKey = (e: KeyboardEvent) => {
      if (e.key === 'Tab') {
        if (e.shiftKey) {
          if (document.activeElement === firstElement) {
            lastElement.focus();
            e.preventDefault();
          }
        } else {
          if (document.activeElement === lastElement) {
            firstElement.focus();
            e.preventDefault();
          }
        }
      }
    };

    element.addEventListener('keydown', handleTabKey);
    return () => element.removeEventListener('keydown', handleTabKey);
  };

  const focusElement = (selector: string, delay: number = 0) => {
    setTimeout(() => {
      const element = document.querySelector(selector) as HTMLElement;
      if (element) {
        element.focus();
      }
    }, delay);
  };

  return {
    trapFocus,
    focusElement
  };
};