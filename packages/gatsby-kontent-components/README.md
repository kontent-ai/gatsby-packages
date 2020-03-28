# Gatsby Kontent Components

Package containing React components useful when processing Kontent data to site.

## Rich text element component

Rich text elements from Kentico Kontent could be resolved to React components using "html-react-parser" as described in [this article](https://rshackleton.co.uk/articles/rendering-kentico-cloud-linked-content-items-with-react-components-in-gatsby).

This package should make the usage easier. Basically by loading the rich text data and use this components to provide this data and resolution functions.

> Complete showcase could be found in [rich-text.js](../../site/src/pages/rich-text.js) in development site.

```jsx
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
```

### Resolution scope

If you don't need to resolve anything, you could jsu provide `value` property.

#### Images

If you want to resolve images pass `images` and `resolveImage` properties.

* `images` **have to contains at least `image_id` property**
* `resolveImage` has one parameter `image` basically containing one record from `images` array

#### Links to content items

If you want to resolve links to another content items pass `links` and `resolveLink` properties.

> All other links (web url, email, asset link) are not resolved. If you could use this functionality, please submit a feature request.

* `links` **have to contains at least `link_id` property**
* `resolveLink` has two parameter `link` basically containing one record from `links` array and `domNode` dome link element that could be used for i.e. getting inner text of the current link `domNode.children[0].data`.

#### Content components and Linked content items

If you want to resolve images pass `linkedItems` and `resolveLinkedItem` properties.

* `linkedItems` **have to contains at least `system.codename` property**
* `resolveLinkedItem` has one parameter `linkedItem` basically containing one record from `linkedItems` array
