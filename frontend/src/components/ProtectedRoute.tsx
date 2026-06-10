import { Navigate, Outlet } from 'react-router-dom';
import { useAuth, type AppRole } from '../contexts/AuthContext';
import { Loader2 } from 'lucide-react';

interface ProtectedRouteProps {
  allowedRoles?: AppRole[];
}

export default function ProtectedRoute({ allowedRoles }: ProtectedRouteProps) {
  const { session, role, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-neutral-900 flex items-center justify-center">
        <Loader2 className="animate-spin h-10 w-10 text-amber-500" />
      </div>
    );
  }

  // Si no hay sesión, redirigir al login
  if (!session) {
    return <Navigate to="/login" replace />;
  }

  // CERCO DE SEGURIDAD: Si es el invitado, NO puede acceder al backend administrativo.
  // Lo rebotamos inmediatamente a la página pública de directorio.
  const isGuest = session.user?.email?.toLowerCase().trim() === 'invitado@asopromas.com';
  if (isGuest) {
    return <Navigate to="/socios" replace />;
  }

  // Si hay roles permitidos y el rol del usuario no está incluido
  if (allowedRoles && role && !allowedRoles.includes(role)) {
    // Redirigir al dashboard base si no tiene permisos
    return <Navigate to="/dashboard" replace />;
  }

  // Si todo está bien, renderizar las rutas hijas
  return <Outlet />;
}
