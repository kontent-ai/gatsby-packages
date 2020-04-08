import React from "react"
import { graphql } from "gatsby"

const Articles = ({ data }) => {
  const articles = data.allKontentItemArticle.group.map(articleItem => {
    const variants = articleItem
      .nodes
      .sort((a, b) => a.preferred_language < b.preferred_language ? 1 : -1)
      .map(variant => (
        <div style={{ padding: ".5em" }}>
          <details>
            <summary>
              <strong>({variant.preferred_language}{variant.fallback_used ? ` -> ${variant.system.language}` : null})</strong>
              Title: {variant.elements.title.value}
            </summary>
            <div>Description: {variant.elements.description.value}</div>
          </details>
        </div>
      ));
    return (
      <article style={{ padding: "1em", margin: "0.3em", border: "solid 1px" }}>
        Article:
        <ul>
          <li>Node ID: {articleItem.nodes[0].id}</li>
          <li>System ID: {articleItem.nodes[0].system.id}</li>
          <li>{articleItem.nodes[0].system.name}</li>
          <li>{articleItem.nodes[0].system.codename}</li>
          <li>{articleItem.nodes[0].system.last_modified}</li>
        </ul>
        {variants}
      </article>
    );
  });
  return <div style={{display: "flex"}}>{articles}</div>
} //<pre>{JSON.stringify(data, null, 4)}</pre>

export const query = graphql`
{
  allKontentItemArticle(sort: {order: DESC, fields: system___last_modified}) {
    totalCount
    group(field: system___id) {
      nodes {
        id
        preferred_language
        system {
          last_modified
          language
          codename
          id
          name
          type
        }
        elements {
          title {
            value
          }
          description {
            value
          }
        }
      fallback_used
      }
    }
  }
}
`

export default Articles
