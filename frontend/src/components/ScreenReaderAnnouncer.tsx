import { type FC } from 'react';

interface ScreenReaderAnnouncerProps {
  ariaLive?: 'polite' | 'assertive' | 'off';
  children?: React.ReactNode;
}

const ScreenReaderAnnouncer: FC<ScreenReaderAnnouncerProps> = ({ 
  ariaLive = 'polite',
  children 
}) => {
  return (
    <div
      aria-live={ariaLive}
      aria-atomic="true"
      className="sr-only"
      role="status"
    >
      {children}
    </div>
  );
};

export default ScreenReaderAnnouncer;