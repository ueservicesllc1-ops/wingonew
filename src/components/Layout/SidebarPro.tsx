import { Link, useLocation } from 'react-router-dom';
import { 
  Home, 
  Flame,
  Trophy,
  CircleDot,
  Dumbbell,
} from 'lucide-react';

const SidebarPro = () => {
  const location = useLocation();

  const menuItems = [
    { path: '/', icon: Home, label: 'Inicio', count: null },
    { path: '/live', icon: Flame, label: 'En Vivo', count: 12, live: true },
    { path: '/sports/futbol', icon: CircleDot, label: 'Fútbol', count: 156 },
    { path: '/sports/basketball', icon: Dumbbell, label: 'Baloncesto', count: 89 },
    { path: '/sports/tennis', icon: Trophy, label: 'Tenis', count: 45 },
  ];

  const isActive = (path: string) => {
    if (path === '/') {
      return location.pathname === path;
    }
    return location.pathname.startsWith(path);
  };

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className="hidden lg:block fixed left-0 top-16 bottom-0 w-56 bg-betting-bg-light border-r border-betting-border overflow-y-auto">
        <nav className="p-2">
          <div className="text-xs font-bold text-betting-text-muted uppercase px-3 py-2 mb-1">
            Deportes
          </div>
          {menuItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center justify-between px-3 py-2.5 rounded mb-0.5 transition-colors ${
                isActive(item.path)
                  ? 'bg-brand-green text-white'
                  : 'text-betting-text-muted hover:bg-betting-bg-lighter hover:text-white'
              }`}
            >
              <div className="flex items-center space-x-3">
                <item.icon className="w-5 h-5" />
                <span className="font-medium">{item.label}</span>
              </div>
              {item.count && (
                <span className={`text-xs font-bold ${
                  item.live ? 'text-red-500 animate-pulse' : 'text-betting-text-muted'
                }`}>
                  {item.count}
                </span>
              )}
            </Link>
          ))}
        </nav>

        {/* Banner Promocional */}
        <div className="m-3 p-4 bg-gradient-to-br from-brand-yellow to-brand-orange rounded-lg">
          <div className="text-black font-bold text-sm mb-1">¡BONO DE BIENVENIDA!</div>
          <div className="text-black text-xs opacity-90">
            Obtén hasta $500 en tu primer depósito
          </div>
          <button className="mt-3 bg-black text-white text-xs font-bold px-4 py-2 rounded w-full hover:bg-gray-900 transition-colors">
            REGÍSTRATE
          </button>
        </div>
      </aside>

      {/* Mobile Bottom Navigation */}
      <nav className="lg:hidden fixed bottom-0 left-0 right-0 bg-betting-bg-light border-t border-betting-border z-50">
        <div className="flex justify-around items-center h-16">
          {menuItems.slice(0, 5).map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`flex flex-col items-center justify-center flex-1 h-full relative ${
                isActive(item.path)
                  ? 'text-brand-green'
                  : 'text-betting-text-muted'
              }`}
            >
              <item.icon className="w-5 h-5 mb-1" />
              <span className="text-xs font-medium">{item.label}</span>
              {item.count && item.live && (
                <span className="absolute top-2 right-1/4 w-2 h-2 bg-red-500 rounded-full animate-pulse"></span>
              )}
            </Link>
          ))}
        </div>
      </nav>
    </>
  );
};

export default SidebarPro;
