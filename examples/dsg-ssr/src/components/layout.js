import React from 'react';
import { Link } from 'gatsby';

const Layout = ({ children }) => {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', justifyContent: "center", maxWidth: "960px", margin: "auto" }}>

      <div style={{ display: 'flex', flexDirection: 'row', gap: "0.5em" }}>
        <Link style={{ padding: '0.5em', margin: '0.5em 0', border: '1px solid black' }} to={`/`}>Home</Link>
        <Link style={{ padding: '0.5em', margin: '0.5em 0', border: '1px solid black' }} to={`/dsg-listing`}>DSG Listing</Link>
        <Link style={{ padding: '0.5em', margin: '0.5em 0', border: '1px solid black' }} to={`/ssr-listing`}>SSR Listing</Link>
      </div>

      {children}
    </div >
  );
};

export default Layout;