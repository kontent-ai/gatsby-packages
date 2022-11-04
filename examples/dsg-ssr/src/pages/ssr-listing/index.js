import React from "react"
import Layout from "../../components/layout"
import ArticleListing from "../../components/articleListing"

function Index() {
  return (
    <Layout>
      <h1>SSR listing</h1>
      <p>
        This listing page itself is not using SSR - it is being generated at
        build time.
      </p>
      <p> The detail pages below are using SSR.</p>
      <ArticleListing prefix="ssr-listing" />
    </Layout>
  )
}

export default Index
