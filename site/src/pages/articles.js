import React from "react"
import { graphql } from "gatsby"
import { Layout } from "../components/layout";

const Articles = (props) => {
  const { data } = props;
  const articles = data.allKontentItemArticle.group.map(articleItem => {
    const variants = articleItem
      .nodes
      .sort((a, b) => a.preferred_language < b.preferred_language ? 1 : -1)
      .map(variant => {

        const tags = variant.elements.tags.value.map(tag => (
          <div key={tag.id} style={{ padding: ".2em", margin: ".3em", background: "cyan" }}>{tag.elements.title.value}</div>
        ));


        return (<div key={variant.id} style={{ padding: ".5em", margin: ".5em", background: "silver" }}>
          <div><strong>({variant.preferred_language}{variant.preferred_language !== variant.system.language ? ` -> ${variant.system.language}` : null})</strong></div>
          <div><i>Date:</i> {variant.elements.date.value}{variant.elements.date.display_timezone && ` (${variant.elements.date.display_timezone})`}</div>
          <div>
            <i>Title:</i> {variant.elements.title.value}
          </div>
          <div><i>Description:</i> {variant.elements.description.value}</div>
          <div style={{ padding: "0.5em", display: "flex", flexWrap: "wrap" }}>{tags}</div>
        </div>
        )
      });
    return (
      <article key={articleItem.nodes[0].id} style={{ width: "350px", padding: "1em", margin: "0.3em", border: "solid 1px" }}>
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
  return (
    <Layout>
      <div style={{ display: "flex", flexWrap: "wrap" }}>
        {articles}
      </div>
    </Layout>
  )
}

export const query = graphql`
{
  allKontentItemArticle(sort: {system: {last_modified: DESC}}) {
    totalCount
    group(field: {system: {id: SELECT}}) {
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
          date {
            value
            display_timezone
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
      }
    }
  }
}
`

export default Articles
