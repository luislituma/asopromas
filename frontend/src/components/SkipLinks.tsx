import { type FC } from 'react';

const SkipLinks: FC = () => {
  return (
    <div className="skip-links sr-only focus:not-sr-only">
      <a
        href="#main-content"
        className="skip-link absolute top-0 left-0 z-50 bg-blue-600 text-white px-4 py-2 rounded-br-md transform -translate-y-full focus:translate-y-0 transition-transform duration-200"
        onFocus={(e) => e.target.classList.remove('sr-only')}
        onBlur={(e) => e.target.classList.add('sr-only')}
      >
        Saltar al contenido principal
      </a>
      <a
        href="#main-navigation"
        className="skip-link absolute top-0 left-32 z-50 bg-blue-600 text-white px-4 py-2 rounded-br-md transform -translate-y-full focus:translate-y-0 transition-transform duration-200"
        onFocus={(e) => e.target.classList.remove('sr-only')}
        onBlur={(e) => e.target.classList.add('sr-only')}
      >
        Saltar a la navegación
      </a>
      <a
        href="#footer"
        className="skip-link absolute top-0 left-64 z-50 bg-blue-600 text-white px-4 py-2 rounded-br-md transform -translate-y-full focus:translate-y-0 transition-transform duration-200"
        onFocus={(e) => e.target.classList.remove('sr-only')}
        onBlur={(e) => e.target.classList.add('sr-only')}
      >
        Saltar al pie de página
      </a>
    </div>
  );
};

export default SkipLinks;