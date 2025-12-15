import { ToggleTheme } from "./theme-provider";

const Header = () => {
  return (
    <header className="h-16 border-b sticky top-0 px-6">
      <div className="h-full flex justify-end items-center">
        <ToggleTheme />
      </div>
    </header>
  );
};

export default Header;
