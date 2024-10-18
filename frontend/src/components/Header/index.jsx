import React from "react";
import "./index.css";

function Header({ text = "", action }) {
  return (
    <nav className="navbar">
      <div className="navbar-logo">{text}</div>
      <ul className="navbar-menu">
        <li>{action}</li>
      </ul>
    </nav>
  );
}

export default Header;
