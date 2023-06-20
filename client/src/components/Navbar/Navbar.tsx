import './Navbar.scss';
import { NavLink } from 'react-router-dom';
import { navItems } from '../../settings/NavItems';

function Navbar() {
  return (
    <>
      <div className="nav_bar">
        <div className="cover">
          <div className="logo">
            <img src="../../../android-chrome-512x512.png" alt="logo" />
            <a href="/">Facial Recognition System</a>
          </div>

          <div className="menu_items">
            {navItems.map((item, index) => (
              <NavLink key={index} to={item.path}>
                {item.name}
              </NavLink>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}

export default Navbar;
