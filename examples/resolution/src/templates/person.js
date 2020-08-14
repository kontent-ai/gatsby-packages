import React from "react"
import { graphql, Link } from "gatsby"
import { RichTextElement } from "@kentico/gatsby-kontent-components"
import { resolveUrl } from "../utils/resolvers"

const Person = ({ data }) => {

  const person = data.kontentItemPerson;
  const bio = person.elements.bio;

  return (
    <>
      <header>
        <h1>{person.elements.name.value}</h1>
      </header>
      <section>
        <h2>{person.elements.bio.name}</h2>
        <RichTextElement
          value={bio.value}
          images={bio.images}
          links={bio.links}
          linkedItems={bio.modular_content}
          resolveImage={image => {
            return (
              <img
                src={`${image.url}?w=200`}
                alt={image.description ? image.description : image.name}
                width="200"
              />
            )
          }}
          resolveLink={(link, domNode) => {
            // const parentItemType = person.system.type // It is possible to use external data for resolution

            // i.e. person -> kontent_item_person
            const linkType = `kontent_item_${link.type}`;
            return (
              <Link to={resolveUrl(linkType, link.url_slug)}>
                {domNode.children[0].data}
              </Link>
            )
          }}
          resolveLinkedItem={linkedItem => {
            switch (linkedItem.__typename) {
              case 'kontent_item_website':
                return (

                  <div style={{
                    border: 'silver 1px solid',
                    display: 'inline-block',
                    padding: '1em'
                  }}>
                    <h3>
                      <Link to={resolveUrl(linkedItem.__typename, linkedItem.elements.slug.value)}
                      >Website: {linkedItem.elements.name.value}
                      </Link>
                    </h3>
                    <p>{linkedItem.elements.summary.value}</p>
                    <a
                      href={linkedItem.elements.url.value}
                      style={{
                        padding: '.5em',
                        float: 'right',
                        border: '1px solid silver'
                      }}>
                      Enter website
                      </a>
                  </div>
                );
              case 'kontent_item_repository':
                return (
                  <div style={{
                    border: 'silver 1px dashed',
                    display: 'inline-block',
                    padding: '1em',
                    maxWidth: '400px'
                  }}>
                    <h3>
                      <Link to={resolveUrl(linkedItem.__typename, linkedItem.elements.slug.value)}
                      >Repository: {linkedItem.elements.name.value}
                      </Link>
                    </h3>
                    <p>{linkedItem.elements.summary.value}</p>
                    <a
                      href={linkedItem.elements.url.value}
                      style={{
                        padding: '.5em',
                        float: 'right',
                        border: '1px solid silver'
                      }}>
                      Enter repo
                      </a>
                  </div>
                );
              default:
                break;
            }
          }}
        />
      </section>
    </>
  );
}

export const query = graphql`
query PersonQuery($language: String!, $codename: String!) {
  kontentItemPerson(system: {codename: {eq: $codename}}, preferred_language: {eq: $language}) {
    elements {
      name {
        value
      }
      bio {
        value
        modular_content {
          __typename
          system {
            codename
          }
          ... on kontent_item_repository {
            elements {
              name {
                value
              }
              slug {
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
          ... on kontent_item_website {
            elements {
              name {
                value
              }
              slug {
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
        images {
          description
          height
          image_id
          url
          width
        }
        links {
          url_slug
          type
          link_id
          codename
        }
      }
    }
  }
}
`

export default Person
