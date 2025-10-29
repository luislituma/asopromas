import { type FC, useEffect } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Header from './Header';
import Footer from './Footer';
import CartWidget from './CartWidget';
import SkipLinks from './SkipLinks';
import ScreenReaderAnnouncer from './ScreenReaderAnnouncer';
import { useA11y } from '../hooks/useA11y';

const Layout: FC = () => {
  const location = useLocation();
  const { announcePageChange, focusMainContent } = useA11y();

  useEffect(() => {
    // Announce page changes to screen readers
    const pageTitle = document.title;
    announcePageChange(`Navegando a ${pageTitle}`);
    
    // Focus main content for keyboard users
    focusMainContent();
  }, [location, announcePageChange, focusMainContent]);

  return (
    <>
      <SkipLinks />
      <ScreenReaderAnnouncer />
      
      <div className="min-h-screen flex flex-col bg-white">
        {/* Elemento centinela para detectar scroll - debe estar ANTES del Header */}
        <div 
          id="scroll-sentinel" 
          className="h-px w-full pointer-events-none" 
          aria-hidden="true"
        />
        
        <Header />
        
        <main 
          id="main-content" 
          className="flex-1"
          role="main"
          aria-label="Contenido principal"
          tabIndex={-1}
        >
          <Outlet />
        </main>
        
        <Footer />
        <CartWidget />
      </div>
    </>
  );
};
        

export default Layout;
