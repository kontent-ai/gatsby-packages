import React from "react"
import { graphql } from "gatsby"
import Repository from '../components/repository'

const Website = ({ data }) => {
  const { kontentItemWebsite: website } = data;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', justifyContent: "center", maxWidth: "960px", margin: "auto" }}>
      <header>
        <h1>{website.elements.name.value}</h1>
      </header>
      <section>
        <p>{website.elements.summary.value}</p>
        <a
          href={website.elements.url.value}
          style={{
            padding: '.5em',
            float: 'left',
            border: '1px solid silver'
          }}>
          Enter website
        </a>


      </section>
      {website.elements.source_repository.value.length > 0 && <section>
        <h2>Source repository</h2>
        <Repository item={website.elements.source_repository.value[0]} />
      </section>}
    </div>
  );
}

export const query = graphql`
query WebsiteQuery($language: String!, $codename: String!) {
  kontentItemWebsite(preferred_language: {eq: $language}, system: {codename: {eq: $codename}}) {
    elements {
      name {
        value
      }
      summary {
        value
      }
      url {
        value
      }
      source_repository {
        value {
          ... on kontent_item_repository {
            __typename
            elements {
              name {
                value
              }
              summary {
                value
              }
              url {
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
  }
}
`

export default Website