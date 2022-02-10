import React from "react"
import { useStaticQuery, graphql, Link } from "gatsby"

export default function ArticleListing({ prefix }) {
  const data = useStaticQuery(graphql`
    query ArticlesQuery {
      allKontentItemArticle {
        nodes {
          id
          elements {
            slug {
              value
            }
            title {
              value
            }
          }
        }
      }
    }
  `)

  return (
    <ul>
      {data.allKontentItemArticle.nodes?.map(node => (
        <li key={node.id}>
          <Link to={`/${prefix}/${node.elements.slug.value}`}>
            {node.elements.title.value}
          </Link>
        </li>
      ))}
    </ul>
  )
}
