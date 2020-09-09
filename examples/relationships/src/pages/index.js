import React from "react"
import { Link } from "gatsby"

const Index = () => (
  <div style={{ display: 'flex', flexDirection: 'column', justifyContent: "center", maxWidth: "960px", margin: "auto" }}>
    <header>
      <h1>Examples</h1>
      <p>For the examples explanation, take a look at <a href="https://github.com/Kentico/kontent-gatsby-packages/tree/master/examples/relationships#readme">GitHub example README</a></p>
    </header>
    <section>
      <ul>
        <li><Link to="/articles">Language variant relationships</Link></li>
        <li><Link to="/tags">Used by relationship</Link></li>
      </ul>
    </section>
  </div>
);


export default Index

