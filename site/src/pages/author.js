import React from "react"
import { graphql } from "gatsby"
import { stringify } from "qs"
import { ImageElement } from "@kentico/gatsby-kontent-components"
import { ImageUrlBuilder } from "@kentico/kontent-delivery"

const Author = ({ data }) => {
  if (!data.author.elements.avatar_image.value.length) {
    return <pre>Author avatar note set.</pre>
  }

  const showcaseWidth = 250

  const avatar = data.author.elements.avatar_image.value[0]

  const rectSelection = [
    160,
    70,
    0.7,
    0.9, // https://docs.kontent.ai/reference/image-transformation#a-source-rectangle-region
  ]
  const imageQuery = {
    rect: rectSelection.join(","),
    w: 230, // https://docs.kontent.ai/reference/image-transformation#a-image-width
  }

  // https://github.com/Kentico/kontent-delivery-sdk-js/blob/master/DOCS.md#image-transformations
  const deliverySDKTransformedUrl = new ImageUrlBuilder(avatar.url)
    .withRectangleCrop(...rectSelection)
    .withWidth(imageQuery.w)

  return (
    <>
      <header>
        <h1>{data.author.elements.name.value}</h1>
      </header>
      <section>
        <ImageElement
          image={avatar}
          width={800}
          height={200}
          backgroundColor="#bbbbbb"
          alt={avatar.description}
        />
        <p>
          This uses the <a href="https://github.com/Kentico/kontent-gatsby-packages/tree/master/packages/gatsby-kontent-components">ImageElement</a> component to display a
          responsive image.
        </p>
      </section>

      <article
        style={{ display: "flex", flexWrap: "wrap", alignItems: "flex-end" }}
      >
        <section style={{ padding: "1em", maxWidth: showcaseWidth }}>
          <img
            src={avatar.url}
            alt={avatar.description || "Author avatar image"}
            width="200px"
          />
          <p>
            This is the basic loading of the asset in full size and setting its
            width right in <tt>img</tt> tag (don't do that).
          </p>
        </section>
        <section style={{ padding: "1em", maxWidth: showcaseWidth }}>
          <img
            src={`${avatar.url}?${stringify(imageQuery, { encode: false })}`}
            alt={avatar.description || "Author avatar image"}
          />
          <p>
            Showcase using{" "}
            <a href="https://docs.kontent.ai/reference/image-transformation">
              Kontent Image transformation API
            </a>{" "}
            and <a href="https://www.npmjs.com/package/qs">qs npm package.</a>{" "}
            for query string construction.
          </p>
        </section>
      </article>

      <article
        style={{ display: "flex", flexWrap: "wrap", alignItems: "flex-end" }}
      >
        <section style={{ padding: "1em", maxWidth: showcaseWidth }}>
          <img
            src={deliverySDKTransformedUrl.getUrl()}
            alt={avatar.description || "Author avatar image"}
          />
          <p>
            Showcase using{" "}
            <a href="https://docs.kontent.ai/reference/image-transformation">
              Kontent Image transformation API
            </a>{" "}
            and{" "}
            <a href="https://github.com/Kentico/kontent-delivery-sdk-js/blob/master/DOCS.md#image-transformations">
              Delivery SDK
            </a>{" "}
            for query string construction.
          </p>
        </section>
      </article>
    </>
  )
}

export const query = graphql`
  {
    author: kontentItemAuthor {
      elements {
        name {
          value
        }
        avatar_image {
          value {
            url
            width
            height
            description
            type
          }
        }
      }
    }
  }
`

export default Author
