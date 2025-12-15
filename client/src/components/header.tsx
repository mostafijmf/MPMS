import { ToggleTheme } from "./theme-provider";
import MobileSidebarMenu from "./dashboard/mobile-sidebar-menu";

const Header = () => {
  return (
    <header className="h-16 border-b sticky top-0 px-6">
      <div className="h-full flex lg:justify-end justify-between items-center">
        <MobileSidebarMenu />
        <ToggleTheme />
      </div>
    </header>
  );
};

export default Header;
