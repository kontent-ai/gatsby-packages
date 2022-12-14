# Gatsby Kontent.ai Components

[![Gatsby plugin library](https://img.shields.io/badge/Gatsby%20plugin%20library-%23663399.svg)](https://www.gatsbyjs.org/packages/@kontent-ai/gatsby-components)
[![Stack Overflow](https://img.shields.io/badge/Stack%20Overflow-ASK%20NOW-FE7A16.svg?logo=stackoverflow&logoColor=white)](https://stackoverflow.com/tags/kontent-ai)

[![npm version](https://badge.fury.io/js/@kontent-ai%2Fgatsby-components.svg)](https://badge.fury.io/js/@kontent-ai%2Fgatsby-components)
[![npm](https://img.shields.io/npm/dt/@kontent-ai%2Fgatsby-components.svg)](https://www.npmjs.com/package/@kontent-ai/gatsby-components)

The package containing React components useful when processing Kontent.ai data to the site.

## Install

```sh
npm install @kontent-ai/gatsby-components gatsby-plugin-image
```

Also, add `gatsby-plugin-image` to `plugins` array in `gatsby-config.js`.

### Typescript

Components exports their typescript definitions so that you know what data format you need to provide via props and what data format expect from function prop callback arguments.

## <a name="image-element-component">Image element component</a>

Images from Kontent.ai can be displayed using the `ImageElement` component. This wraps the `GatsbyImage` component from [gatsby-plugin-image](https://www.gatsbyjs.com/docs/how-to/images-and-media/using-gatsby-plugin-image/), so ensure that you also install that plugin. This component will give the best experience for your users, as it includes responsive srcset, blur-up, lazy loading and many other performance optimizations. [Automatic format optimization](https://docs.kontent.ai/reference/image-transformation#a-automatic-format-selection) is always enabled. In many cases it can improve Lighthouse scores by 10-20 points.

The component takes all [the `GatsbyImage` props](https://www.gatsbyjs.com/docs/reference/built-in-components/gatsby-plugin-image#gatsbyimage), as well as the following properties. All are optional except `image`:

- `image`: the `image` object. This should include `url`, `width` and `height`.
- `layout`: see [the `gatsby-plugin-image` docs](https://www.gatsbyjs.com/docs/reference/built-in-components/gatsby-plugin-image#layout)
- `width`/`height`: see [the `gatsby-plugin-image` docs](https://www.gatsbyjs.com/docs/reference/built-in-components/gatsby-plugin-image#widthheight)
- `aspectRatio`: see [the `gatsby-plugin-image` docs](https://www.gatsbyjs.com/docs/reference/built-in-components/gatsby-plugin-image#aspectratio)
- `backgroundColor`: displayed as a placeholder while the image loads
- `options: ImageOptions`: an object containing options passed to [the Kontent.ai Image Transformation API](https://docs.kontent.ai/reference/image-transformation). Supported options: `fit`, `quality`, `lossless`.

  ```ts
  interface ImageOptions {
    fit?: 'crop' | 'clip' | 'scale';
    quality?: number;
    lossless?: boolean;
  }
  ```

Properties of the image object (e.g. `width` and `height`) are reflected in Kontent's image API query.
Props of the `ImageElement` component (e.g. `width` and `height`) are reflected in the rendered DOM.
If the optional props of `ImageElement` are omitted, the properties of the image object are applied.

> You can find a showcase in the [author.js](../../site/src/pages/author.js) on the development site.

```jsx
import React from 'react';
import { ImageElement } from '@kontent-ai/gatsby-components';
import { graphql } from 'gatsby';

export default Page = ({ data }) => {
  const avatar = data.author.elements.avatar_image.value[0];

  return (
    <ImageElement
      image={avatar}
      width={800}
      height={200}
      backgroundColor="#bbbbbb"
      alt={avatar.description}
    />
  );
};
export const query = graphql`
  {
    author: kontentItemAuthor {
      elements {
        avatar_image {
          value {
            url
            description
          }
        }
      }
    }
  }
`;
```

### getGatsbyImageData

In case you need image data for GatsbyImage component, you can use an exported function `getGatsbyImageData`.

> Showcase can be found in [article.js](../../site/src/pages/article.js) in the development site.

```ts
  const imageData = getGatsbyImageData({
      image: avatar,
      width: 800,
      height: 200,
      backgroundColor:"#bbbbbb"
  })
```

## Rich text element component

Rich text elements from Kontent.ai could be resolved to React components using "html-react-parser" as described in [this article](https://rshackleton.co.uk/articles/rendering-kentico-cloud-linked-content-items-with-react-components-in-gatsby).

This package should make the usage easier. Basically by loading the rich text data and use these components to provide this data and resolution functions.

```jsx
import {
  RichTextElement,
  ImageElement,
} from '@kontent-ai/gatsby-components';

// ...

<RichTextElement
  value={richTextElement.value}
  images={richTextElement.images}
  links={richTextElement.links}
  linkedItems={richTextElement.modular_content}
  resolveImage={image => {
    return (
      <ImageElement
        image={image}
        alt={image.description ? image.description : image.name}
        width={200}
      />
    );
  }}
  resolveLink={(link, domNode) => {
    const parentItemType = contextData.type; // It is possible to use external data for resolution
    return (
      <Link to={`/${link.type}/partner/${parentItemType}/${link.url_slug}`}>
        {domNode.children[0].data}
      </Link>
    );
  }}
  resolveLinkedItem={(linkedItem, domNode) => {
    const isComponent = domNode.attribs['data-rel'] === 'component';
    const isLinkedItem = domNode.attribs['data-rel'] === 'link';
    return (
      <>
        {isComponent && <h1>Component</h1>}
        {isLinkedItem && <h1>Linked item</h1>}
        <pre>{JSON.stringify(linkedItem, undefined, 2)}</pre>
      </>
    );
  }}
  resolveDomNode={(domNode, domToReact) => {
    if (domNode.name === 'table') {
      // For options - check https://www.npmjs.com/package/html-react-parser#options
      return <div className="table-responsive">{domToReact([domNode])}</div>;
    }
  }}
/>;
```

### Resolution scope

If you don't need to resolve anything, you could just provide `value` property.

#### Images

If you want to resolve images pass `images` and `resolveImage` properties.

- `images` **have to contain at least `image_id` property**
- `resolveImage` has one parameter `image` usually containing one record from `images` array
- when resolving images in Rich text element using [Image element component](#image-element-component), `image` object must follow data contract defined in [Image element component](#image-element-component) section. Moreover, for correct resolution, the additional `image_id` identifier of the image is mandatory, as well.

#### Links to content items

If you want to resolve links to other content items pass `links` and `resolveLink` properties.

> All other links (web URL, email, asset link) are not resolved. If you could use this functionality, please submit a feature request.

- `links` **have to contain at least `link_id` property**
- `resolveLink` has two parameter `link` basically containing one record from `links` array and `domNode` dome link element that could be used for i.e. getting the inner text of the current link `domNode.children[0].data`.

#### Content components and Linked content items

If you want to resolve images pass `linkedItems` and `resolveLinkedItem` properties.

- `linkedItems` **have to contain at least `system.codename` property**
- `resolveLinkedItem` has one parameter `linkedItem` basically containing one record from `linkedItems` array

#### Custom resolution for any other dom node

The general resolution method `resolveDomNode` is called for every DOM node, except for ones that are resolved specifically (described above). In the example above, all table elements will be wrapped with the `div` element. You could also return just a JSX if you want to replace the `domNode` completely.

If you want to resolve elements via `resolveDomNode`, you get the following parameters:

- `domNode` - DOM node from [`html-react-parser`](https://www.npmjs.com/package/html-react-parser)
- `domToReact` - method from [`html-react-parser`](https://www.npmjs.com/package/html-react-parser) to be able to extend the actual `domNode` as on the example
