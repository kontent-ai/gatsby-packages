import { Slice } from "gatsby";
import React from "react";
import "./layout.css"

export const Layout = ({ children }) => {
  return (
    <div className="page">
      <div className="content">
        {children}
      </div>
      <Slice alias="footer" />
    </div >
  )
}
