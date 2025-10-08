import { Link, useLocation } from 'react-router-dom';
import { 
  Home, 
  TrendingUp, 
  History, 
  CreditCard,
  CircleDot,
  Dumbbell,
  Trophy,
} from 'lucide-react';

const Sidebar = () => {
  const location = useLocation();

  const navItems = [
    { path: '/', icon: Home, label: 'Inicio' },
    { path: '/sports/futbol', icon: CircleDot, label: 'Fútbol' },
    { path: '/sports/basketball', icon: Dumbbell, label: 'Baloncesto' },
    { path: '/sports/tennis', icon: Trophy, label: 'Tenis' },
    { path: '/my-bets', icon: TrendingUp, label: 'Mis Apuestas' },
    { path: '/transactions', icon: CreditCard, label: 'Transacciones' },
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
      <aside className="hidden lg:block fixed left-0 top-[65px] bottom-0 w-64 bg-gray-800 border-r border-gray-700 overflow-y-auto">
        <nav className="p-4 space-y-2">
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
                isActive(item.path)
                  ? 'bg-blue-600 text-white'
                  : 'text-gray-300 hover:bg-gray-700'
              }`}
            >
              <item.icon className="w-5 h-5" />
              <span className="font-medium">{item.label}</span>
            </Link>
          ))}
        </nav>
      </aside>

      {/* Mobile Bottom Navigation */}
      <nav className="lg:hidden fixed bottom-0 left-0 right-0 bg-gray-800 border-t border-gray-700 z-50">
        <div className="flex justify-around items-center py-2">
          {navItems.slice(0, 5).map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`flex flex-col items-center space-y-1 px-3 py-2 rounded-lg transition-colors ${
                isActive(item.path)
                  ? 'text-blue-400'
                  : 'text-gray-400'
              }`}
            >
              <item.icon className="w-5 h-5" />
              <span className="text-xs">{item.label}</span>
            </Link>
          ))}
        </div>
      </nav>
    </>
  );
};

export default Sidebar;
