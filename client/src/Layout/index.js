import React from 'react';
import logo from '../Assets/logo.png';
import './index.css';

function AuthLayouts({ children }) {
  return (
    <>
      <header>
        <img
          src={logo}
          alt='logo'
        />
      </header>
      <main>
        {children}
      </main>
    </>
  );
}

export default AuthLayouts;
