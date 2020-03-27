import React from "react"
import { Link } from "gatsby"
import { RichTextElement } from "@simply007org/gatsby-kontent-components"

const RichTextSample = () => {
  // normally loaded in `props.data`
  const data = sampleDataFromQuery.data
  // Rich text data
  const richTextElement = data.kontentItemPerson.elements.bio

  // Other sample data required for resolution (even from different query)
  const contextData = data.kontentItemPerson.system

  return (
    <RichTextElement
      value={richTextElement.value}
      images={richTextElement.images}
      links={richTextElement.links}
      linkedItems={richTextElement.modular_content}
      resolveImage={image => {
        return (
          <img
            src={image.url}
            alt={image.description ? image.description : image.name}
            width="200"
          />
        )
      }}
      resolveLink={(link, domNode) => {
        const parentItemType = contextData.type // It is possible to use external data for resolution
        return (
          <Link to={`/${link.type}/partner/${parentItemType}/${link.url_slug}`}>
            {domNode.children[0].data}
          </Link>
        )
      }}
      resolveLinkedItem={linkedItem => {
        return <pre>{JSON.stringify(linkedItem, undefined, 2)}</pre>
      }}
    />
  )
}

export default RichTextSample

const sampleDataFromQuery = {
  data: {
    kontentItemPerson: {
      system: {
        codename: "john_doe",
        type: "person",
      },
      elements: {
        bio: {
          images: [
            {
              description: null,
              height: 1000,
              image_id: "094429d8-b08c-4a1a-a405-916ad95273ad",
              url:
                "https://assets-us-01.kc-usercontent.com:443/09fc0115-dd4d-00c7-5bd9-5f73836aee81/f5b597e3-ed16-48b6-9319-529db58dbded/clovek_1.jpg",
              width: 1000,
            },
          ],
          links: [
            {
              codename: "ondrej_chrastina",
              link_id: "d72eea98-774f-48fc-b52a-7ebc51271855",
              type: "person",
              url_slug: "ondrej-chrastina",
            },
          ],
          name: "Bio",
          type: "rich_text",
          value:
            '<p>This is John Doe.<br>\n<br>\n</p>\n<figure data-asset-id="094429d8-b08c-4a1a-a405-916ad95273ad" data-image-id="094429d8-b08c-4a1a-a405-916ad95273ad"><img src="https://assets-us-01.kc-usercontent.com:443/09fc0115-dd4d-00c7-5bd9-5f73836aee81/f5b597e3-ed16-48b6-9319-529db58dbded/clovek_1.jpg" data-asset-id="094429d8-b08c-4a1a-a405-916ad95273ad" data-image-id="094429d8-b08c-4a1a-a405-916ad95273ad" alt=""></figure>\n<p><br></p>\n<p>He likes to do web sites. This is his latest project:</p>\n<object type="application/kenticocloud" data-type="item" data-rel="link" data-codename="example_site"></object>\n<p><br>\nHe also likes OSS. This is his latest repository:<br>\n</p>\n<object type="application/kenticocloud" data-type="item" data-rel="component" data-codename="aaa51951_dcab_0160_ba70_3f00321abb11"></object>\n<p><br></p>\n<p>On some projects, he was cooperating with <a data-item-id="d72eea98-774f-48fc-b52a-7ebc51271855" href="">Ondřej Chrastina</a>.</p>\n<p><br></p>\n<p>You could take a look at their <a href="https://google.com" title="sample link">latest project</a>.</p>',
          modular_content: [
            {
              system: {
                type: "website",
                codename: "example_site",
              },
              elements: {
                name: {
                  value: "Example site",
                },
                url: {
                  value: "https://example.com",
                },
              },
            },
            {
              system: {
                type: "repository",
                codename: "aaa51951_dcab_0160_ba70_3f00321abb11",
              },
              elements: {
                name: {
                  value: "Sample repo",
                },
                url: {
                  value: "https://github.com/Kentico/Home",
                },
              },
            },
          ],
        },
      },
    },
  },
}

// eslint-disable-next-line no-unused-vars
const sampleQuery = `
{
  kontentItemPerson(system: {codename: {eq: "john_doe"}}) {
    system {
      codename
      type
    }
    elements {
      bio {
        images {
          description
          height
          image_id
          url
          width
        }
        links {
          codename
          link_id
          type
          url_slug
        }
        name
        type
        value
        modular_content {
          system {
            type
            codename
          }
          ... on kontent_item_website {
            elements {
              name {
                value
              }
              url {
                value
              }
            }
          }
          ... on kontent_item_repository {
            elements {
              name {
                value
              }
              url {
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
