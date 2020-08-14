import React from "react"
import { graphql } from "gatsby"

const Website = ({ data }) => {
  const { kontentItemWebsite: website } = data;

  return (
    <>
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
    </>
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
    }
  }
}
`

export default Website