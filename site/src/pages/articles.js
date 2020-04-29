import React from "react"
import { graphql } from "gatsby"

const Articles = (props) => {
  const { data } = props;
  const articles = data.allKontentItemArticle.group.map(articleItem => {
    const variants = articleItem
      .nodes
      .sort((a, b) => a.preferred_language < b.preferred_language ? 1 : -1)
      .map(variant => {

        const tags = variant.elements.tags.value.map(tag => (
          <div style={{ padding: ".2em", margin: ".3em", background: "cyan" }}>{tag.elements.title.value}</div>
        ));

        return (<div style={{ padding: ".5em", margin: ".5em", background: "silver" }}>
          <div>
            <strong>({variant.preferred_language}{variant.fallback_used ? ` -> ${variant.system.language}` : null})</strong>
              Title: {variant.elements.title.value}
          </div>
          <div>Description: {variant.elements.description.value}</div>
          <div style={{ padding: "0.5em", display: "flex", flexWrap: "wrap" }}>{tags}</div>
        </div>
        )
      });
    return (
      <article style={{ width: "350px", padding: "1em", margin: "0.3em", border: "solid 1px" }}>
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
  return <div style={{ display: "flex", flexWrap: "wrap" }}>{articles}</div>
}

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
          tags {
            value {
              ... on kontent_item_tag {
                id
                elements {
                  title {
                    value
                  }
                }
              }
            }
          }
        }
        fallback_used
      }
    }
  }
}
`

export default Articles
