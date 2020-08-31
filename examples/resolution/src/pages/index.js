import React from "react"
import { graphql, Link } from "gatsby"
import { resolveUrl } from "../utils/resolvers"

const Index = ({ data }) => (
  <div style={{ display: 'flex', flexDirection: 'column', justifyContent: "center", maxWidth: "960px", margin: "auto" }}>
    <header>
      <h1>Pages</h1>
    </header>

    <section style={{ display: 'flex', justifyContent: "space-between", flexWrap: 'wrap' }}>
      <article>
        <header>
          <h2>People</h2>
        </header>
        <ul>
          {data.allKontentItemPerson.nodes.map(person => (
            <li key={person.elements.slug.value}>
              <Link to={resolveUrl(person.__typename, person.elements.slug.value)}>{person.elements.name.value}{person.elements.name.value === 'Ondřej Chrastina' ? <strong>&nbsp;👈 This is rich text resolution showcase</strong> : null}</Link>
            </li>
          ))}
        </ul>
      </article>

      <article>
        <header>
          <h2>Websites</h2>
        </header>
        <ul>
          {data.allKontentItemWebsite.nodes.map(website => (
            <li key={website.elements.slug.value}>
              <Link to={resolveUrl(website.__typename, website.elements.slug.value)}>{website.elements.name.value}</Link>
            </li>
          ))}
        </ul>
      </article>

      <article>
        <header>
          <h2>Repositories</h2>
        </header>
        <ul>
          {data.allKontentItemRepository.nodes.map(repository => (
            <li key={repository.elements.slug.value}>
              <Link to={resolveUrl(repository.__typename, repository.elements.slug.value)}>{repository.elements.name.value}</Link>
            </li>
          ))}
        </ul>
      </article>
    </section>
  </div>
);

export const query = graphql`
query AllUrlQuery {
  allKontentItemPerson(sort: {order: ASC, fields: elements___name___value}) {
    nodes {
      __typename
      elements {
        name {
          value
        }
        slug {
          value
        }
      }
    }
  }
  allKontentItemWebsite(sort: {order: ASC, fields: elements___name___value}) {
    nodes {
      __typename
      elements {
        name {
          value
        }
        slug {
          value
        }
      }
    }
  }
  allKontentItemRepository(sort: {fields: elements___name___value, order: ASC}) {
    nodes {
      __typename
      elements {
        name {
          value
        }
        slug {
          value
        }
      }
    }
  }
}
`

export default Index

