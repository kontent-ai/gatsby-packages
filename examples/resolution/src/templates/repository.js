import React from "react"
import { graphql } from "gatsby"

const Repository = ({ data }) => {
  const { kontentItemRepository: repo } = data;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', justifyContent: "center", maxWidth: "960px", margin: "auto" }}>
      <header>
        <h1>{repo.elements.name.value}</h1>
      </header>
      <section>
        <p>{repo.elements.summary.value}</p>
        <a
          href={repo.elements.url.value}
          style={{
            padding: '.5em',
            float: 'left',
            border: '1px solid silver'
          }}>
          Enter repo
        </a>
      </section>
    </div>
  );
}

export const query = graphql`
query RepositoryQuery($language: String!, $codename: String!) {
  kontentItemRepository(preferred_language: {eq: $language}, system: {codename: {eq: $codename}}) {
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

export default Repository