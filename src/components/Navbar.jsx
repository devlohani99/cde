// Navbar.js
import React from 'react';
import Logo from '../assets/Logo.jpg'; // Importing the logo from the assets folder

const Navbar = () => {
  return (
    <nav className="flex justify-between items-center p-4 bg-white border-b border-gray-200">
      {/* Logo on the left */}
      <div className="flex items-center">
        <img src={Logo} alt="SAAHAS Logo" className="h-10" />
      </div>

      {/* Hamburger icon on the right */}
      <div className="flex items-center">
        <button className="focus:outline-none">
          <div className="space-y-1">
            <span className="block w-6 h-0.5 bg-gray-600"></span>
            <span className="block w-6 h-0.5 bg-gray-600"></span>
            <span className="block w-6 h-0.5 bg-gray-600"></span>
          </div>
        </button>
      </div>
    </nav>
  );
};

export default Navbar;