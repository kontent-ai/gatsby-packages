import React from "react"
import { graphql, Link } from "gatsby"
import Layout from "../components/layout";

const Tags = ({ data: { allKontentItemTag: { nodes: tagData } } }) => {

  const tags = tagData.map(tag => {
    const tagArticles = tag.used_by_articles.map(article => (
      <li><Link to={`/en-US/articles/${article.elements.slug.value}`}>{article.elements.title.value}</Link></li>
    ));
    return (
      <li>
        <strong>{tag.elements.title.value} ({tagArticles.length})</strong>
        <ul>{tagArticles}</ul>
      </li>
    );
  })

  return (
    <Layout>
      <header>
        <h1>Tags</h1>
      </header>
      {tags.length > 0 &&
        <ul>
          {tags}
        </ul>
      }
    </Layout>
  );
}

export const query = graphql`
  {
    allKontentItemTag(filter: {preferred_language: {eq: "en-US"}}) {
      nodes {
        elements {
          title {
            value
          }
        }
        used_by_articles {
          elements {
            title {
              value
            }
            slug {
              value
            }
          }
        }
      }
    }
  }
`

export default Tags
