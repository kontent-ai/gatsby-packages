import React from "react"
import Layout from "../../components/layout"
import ArticleListing from "../../components/articleListing"

function Index() {
  return (
    <Layout>
      <h1>DSG listing</h1>
      <p>
        This listing page itself is not using DSG - it is being generated at
        build time.
      </p>
      <p> The detail pages below are using DSG.</p>
      <ArticleListing prefix="dsg-listing" />
    </Layout>
  )
}

export default Index
