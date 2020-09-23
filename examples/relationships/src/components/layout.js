import React from 'react';
import { Link } from 'gatsby';

const Layout = ({ children }) => {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', justifyContent: "center", maxWidth: "960px", margin: "auto" }}>
      <div>
      <div style={{ padding: '0.5em', margin: '0.5em 0', border: '1px solid black', display: 'inline-block' }}>
          <Link to={`/`}>Home</Link>
        </div>
        </div>
      {children}
    </div>
  );
};

export default Layout;