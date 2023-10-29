import { useState } from "react";
import { Link, NavLink } from "react-router-dom";
import Hamburger from "hamburger-react";

import "./style.scss";

const Header = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <header className="header">
      <nav className="container">
        <div className="nav__item">
          <div style={{ display: "flex", gap: "30px" }}>
            <Link to={"/"}>
              <img src="/images/logo.svg" alt="logo" />
            </Link>
          </div>
          <div className={`nav__item__link ${isOpen && "open"}`}>
            <NavLink to={"/"}>Home</NavLink>
            <NavLink to={"/all-posts"}>Blog</NavLink>
            <NavLink to={"/about"}>About Us</NavLink>
            <NavLink to={"/register"}>Register</NavLink>

            {/* <Link to={"/account"} className="login">
              Account
            </Link> */}

            <NavLink to={"/login"} className="login">
              Login
            </NavLink>
          </div>
          <div className="hamburger">
            <Hamburger
              className="hamburger__menu"
              easing="ease-in"
              toggled={isOpen}
              toggle={setIsOpen}
            />
          </div>
        </div>
      </nav>
    </header>
  );
};

export default Header;
