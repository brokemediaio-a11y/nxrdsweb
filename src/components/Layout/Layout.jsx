import React from 'react';
import Footer from '../Footer/Footer';

const Layout = ({ children }) => {
  return (
    <div style={{ 
      minHeight: '100vh', 
      background: '#000000', 
      color: 'rgba(255,255,255,.92)',
      width: '100%'
    }}>
      <div className="void-bg"></div>
      <main style={{ 
        width: '100%', 
        overflowX: 'hidden'
      }}>
        {children}
      </main>
      <Footer />
    </div>
  );
};

export default Layout;