import React from "react"
import Menu from "./complex-menu"

const Layout = ({ children, title }) => {
  return (
    <>
      <Menu />
      {title && (
        <header>
          <h1>{title}</h1>
        </header>
      )}
      <main>{children}</main>
    </>
  )
}

export default Layout
