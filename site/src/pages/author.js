import React from "react"
import { graphql } from "gatsby"
import { stringify } from "qs";
import { ImageUrlBuilder } from '@kentico/kontent-delivery';
import Img from "gatsby-image";

const Author = ({ data }) => {

  if (!data.author.elements.avatar_image.value.length) {
    return <pre>Author avatar note set.</pre>
  }

  const showcaseWidth = 250;

  const avatar = data.author.elements.avatar_image.value[0];

  const rectSelection = [
    160, 70, 0.7, 0.9 // https://docs.kontent.ai/reference/image-transformation#a-source-rectangle-region
  ];
  const imageQuery = {
    rect: rectSelection.join(','),
    w: 230 // https://docs.kontent.ai/reference/image-transformation#a-image-width
  };

  // https://github.com/Kentico/kontent-delivery-sdk-js/blob/master/DOCS.md#image-transformations
  const deliverySDKTransformedUrl = new ImageUrlBuilder(avatar.url)
    .withRectangleCrop(...rectSelection)
    .withWidth(imageQuery.w);

  return (
    <>
      <header>
        <h1>{data.author.elements.name.value}</h1>
      </header>

      <article style={{ display: "flex", flexWrap: "wrap", alignItems: "flex-end" }}>

        <section style={{ padding: "1em", maxWidth: showcaseWidth }}>
          <img
            src={avatar.url}
            alt={avatar.description || "Author avatar image"}
            width="200px" />
          <p>This is the basic loading of the asset in full size and setting its width right in <tt>img</tt> tag (don't do that).</p>
        </section>
        <section style={{ padding: "1em", maxWidth: showcaseWidth }}>
          <Img
            fluid={avatar.fluid}
            description={avatar.description || "Author avatar image"} />

          <p>Showcase using <a href="https://github.com/rshackleton/gatsby-packages/tree/master/packages/gatsby-transformer-kontent-image#readme">community-based image transformer plugin</a> by <a href="https://github.com/rshackleton">Richard Shackleton.</a> Showcase specifically showcasing <a href="https://www.gatsbyjs.org/packages/gatsby-image/#fluid-queries">fluid query</a> of <a href="https://www.gatsbyjs.org/packages/gatsby-image/">gatsby-image</a> package.</p>
          <strong>See the "blur up" effect when you are loading the site.</strong>
        </section>
      </article>

      <article style={{ display: "flex", flexWrap: "wrap", alignItems: "flex-end" }}>
        <section style={{ padding: "1em", maxWidth: showcaseWidth }}>
          <img
            src={`${avatar.url}?${stringify(imageQuery, { encode: false })}`}
            alt={avatar.description || "Author avatar image"} />
          <p>Showcase using <a href="https://docs.kontent.ai/reference/image-transformation">Kontent Image transformation API</a> and <a href="https://www.npmjs.com/package/qs">qs npm package.</a> for query string construction.</p>
        </section>

        <section style={{ padding: "1em", maxWidth: showcaseWidth }}>
          <img
            src={deliverySDKTransformedUrl.getUrl()}
            alt={avatar.description || "Author avatar image"} />
          <p>Showcase using <a href="https://docs.kontent.ai/reference/image-transformation">Kontent Image transformation API</a> and <a href="https://github.com/Kentico/kontent-delivery-sdk-js/blob/master/DOCS.md#image-transformations">Delivery SDK</a> for query string construction.</p>
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
            fluid(maxWidth: 200) {
              ...KontentAssetFluid
            }
          }
        }
      }
    }
  }
`

export default Author
