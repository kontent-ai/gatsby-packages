import React from "react"
import { Link } from "gatsby"
import Layout from "../components/layout"

const Index = () => (
  <Layout>
    <header>
      <h1>Examples</h1>
      <p>
        For the examples explanation, take a look at{" "}
        <a href="https://github.com/kontent-ai/gatsby-packages/tree/master/examples/dsg-ssr#readme">
          GitHub example README
        </a>
      </p>
    </header>
    <section>
      <ul>
        <li>
          <Link to="/dsg-listing">DSG listing-detail</Link>
        </li>
        <li>
          <Link to="/ssr-listing">SSG listing-detail</Link>
        </li>
      </ul>
    </section>
  </Layout>
)

export default Index
