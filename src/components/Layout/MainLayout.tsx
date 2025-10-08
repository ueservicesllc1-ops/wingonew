import { Outlet } from 'react-router-dom';
import HeaderPro from './HeaderPro';
import SidebarPro from './SidebarPro';
import BetSlipPro from '../BetSlip/BetSlipPro';

const MainLayout = () => {
  return (
    <div className="min-h-screen bg-betting-bg">
      <HeaderPro />
      <div className="flex">
        <SidebarPro />
        <main className="flex-1 lg:ml-56">
          <Outlet />
        </main>
        <BetSlipPro />
      </div>
    </div>
  );
};

export default MainLayout;
