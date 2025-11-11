import { MenuIcon } from '@/icons/MenuIcon';

import './HamburgerButton.css';

export const HamburgerButton = ({ onClick }) => {
  return (
    <button
      type="button"
      className="hamburger_button"
      onClick={onClick}
      aria-label="Open menu"
    >
      <MenuIcon />
    </button>
  );
};
