import React from "react"
import { graphql } from "gatsby"
import Layout from "../components/layout"

const ComponentName = ({ data }) => {
  return (
    <Layout title={data.kontentItemContentPage.elements.title.value}>
      <div
        dangerouslySetInnerHTML={{
          __html: data.kontentItemContentPage.elements.content.value,
        }}
      />
    </Layout>
  )
}

export const query = graphql`
  query ContentPageQuery($language: String!, $codename: String!) {
    kontentItemContentPage(
      preferred_language: { eq: $language }
      system: { codename: { eq: $codename } }
    ) {
      elements {
        title {
          value
        }
        content {
          value
        }
      }
    }
  }
`

export default ComponentName
