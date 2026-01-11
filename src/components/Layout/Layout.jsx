import React from 'react';
import Navbar from '../Navigation/Navbar';

const Layout = ({ children }) => {
  return (
    <div style={{ minHeight: '100vh', background: '#000000', color: 'rgba(255,255,255,.92)' }}>
      <div className="void-bg"></div>
      <Navbar />
      <main>
        {children}
      </main>
    </div>
  );
};

export default Layout;