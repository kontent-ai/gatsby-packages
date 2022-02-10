import React from "react"
import { graphql } from "gatsby"
import Layout from "../../components/layout"

export default function Component({ data: { kontentItemArticle } }) {
  return (
    <Layout>
      <h1>{kontentItemArticle.elements.title.value}</h1>
      <div>Published: {kontentItemArticle.elements.date.value}</div>
      <p>{kontentItemArticle.elements.content.value}</p>
    </Layout>
  )
}

// This is the page query that connects the data to the actual component. Here you can query for any and all fields
// you need access to within your code. Again, since Gatsby always queries for `id` in the collection, you can use that
// to connect to this GraphQL query.
export const query = graphql`
  query dsgArticleQuery($id: String) {
    kontentItemArticle(id: { eq: $id }) {
      elements {
        title {
          value
        }
        date {
          value
        }
        content {
          value
        }
      }
    }
  }
`

export async function config() {
  return () => {
    return {
      defer: true,
    }
  }
}
