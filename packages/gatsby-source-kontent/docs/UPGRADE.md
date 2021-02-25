# Upgrade guide

## From `5.x.x` to `6.x.x`

### Elements property names change

Since the source plugin is trying to unify the data structure among [Kentico Kontent Delivery API](https://docs.kontent.ai/reference/delivery-api) and Gatsby GraphQL model.
This required to make some breaking changes in property elements.

* rich-text
  * `resolvedHTML` - removed - use [@kentico/gatsby-kontent-components](../../gatsby-kontent-components/README.md#rich-text-element-component) for rich text resolution
  * `images`
    * from `imageId` to `image_id`
  * `links`
    * from `linkId` to `link_id`
    * from `urlSlug` to `url_slug`
  * from `linked_items` to `modular_content`
  * `linkedItemCodenames` - removed, could be replaced by `modular_content.system.codename`
  * `resolvedData` - removed use @kentico/gatsby-kontent-components for rich text resolution
* taxonomy
  * from `taxonomyGroup` to `taxonomy_group`
* modular content (linked items)
  * from `linked_items` to `value`
  * `linkedItemCodenames` - removed, could be replaced by `value.system.codename`
* assets
  * `contract` - removed, properties under this element were just copies of `description`, `name`, `size`, `type`, `url`, `width`
* URL slug
  * `resolvedURL` - removed, use [URL resolution](../../../site/README.md#url-slug-resolution) to include it

### JS SDK resolution removal

JS SDK provided automatic URL resolution for URL slugs as well as rich text element plus rich text resolution for content components and inline content items. This resolution was removed because this resolution was computed automatically for all items where configured regardless thh item was used or not.
That started to cause some performance issues. The new approach will do the resolution only for the items that are really used on.

All required data for resolution is already in the Gatsby GraphQL model. Resolution is just a data transformation to make the component data hydration easier.

#### URL slug resolution

It is possible to use [Gatsby schema customization](https://www.gatsbyjs.org/docs/schema-customization/).
Following [URL slug resolution example](../../../site/README.md#url-slug-resolution) could be used right in your project to extend all URL slug elements with resolved URL.

#### Rich text resolution

To ensure the resolution is as easy as possible, you could use [@kentico/gatsby-kontent-components](../../gatsby-kontent-components/README.md#rich-text-element-componen).
For URL resolution, you could re-use the implementation from URL slug. According to the resolution of images, inline linked items, and components - this resolution gives you the ability to resolve these to React components, not just string-based HTML.

### Schema extension options

After the research, it was detected that many of the features, that were provide by source plugin wan barely used, they have jus slowed down the build time of the site because all fo the that were calculated regardless of their actual usage.
Since the Kontent GraphQL schema is now fully defined and all data from Kentico Kontent is already present in the data model, these features, which basically provided just a facade above the actual data are now removed to provide lightweight build. And we provide examples, how to include these facade transformations on the form of [Gatsby schema custom customization](https://www.gatsbyjs.org/docs/schema-customization) back. The customization could be adjusted exactly for your project needs and boost your build times.

#### Language variant relationships

This relationship was captured by the `otherLanguages` navigation property of all content item nodes in other languages, now the property is removed.
If you want to use this property, feel free to do so by [Language variant relationships example](../../../site/README.md#Language-variant-relationships).

#### Content item <-> content type relationships

The relationship captured in the `contentItems` navigation property of all KontentType nodes was removed.
If you want to extend the model with `contentItems` feel free to do so using [Content type -> Content Item resolution](../../../site/README.md#Content-type--Content-Item-resolution).

#### Reverse link relationships

All nodes had a `usedByContentItems` property that reflects the other nodes in which the given node is used as linked content in Linked items or Rich text elements.
Now it is possible to substitute this property by using [Linked from relationship](../../../site/README.md#Linked-from-relationship), it is just required to specify an element to gather the links from.

### Different Item Node IDs

In previous version there was a Node ID generated from item `system.codename`, `preferred_language`, and some prefix.
Since the `system.codename` is changeable for content item, now as an input for node ID generation function `system.id` is used.

If you are using hard-coded Node ID in your queries to get/filter specific Kontent item node(s), you need to make the adjustments - IDs will be different for version 6.

### Type endpoint unification

When [turning the `includeTypes` option on](https://github.com/Kentico/kontent-gatsby-packages/tree/master/packages/gatsby-source-kontent#available-options), all content types are stored under one graphql type, so that you can use `kontentType` and `allKontentType` queries to load information about content types. Take a look at [the example](https://github.com/Kentico/kontent-gatsby-packages/tree/master/packages/gatsby-source-kontent#types-elements-property) how to i.e. load information about one of the content types.

## From `4.x.x` to `5.x.x`

This upgrade is necessary to fix the [colliding identifiers](https://github.com/Kentico/gatsby-source-kontent/issues/110) issue.

### Colliding identifiers

It is necessary to rename all Kontent taxonomy, type, and item names in all GraphQL queries.

#### Taxonomy name

| 4.x.x pattern                                | 5.x.x pattern                  |
| -------------------------------------------- | ------------------------------ |
| KontentTaxonomy{PascalCasedTaxonomyCodename} | kontent_taxonomy_{raw_codename}|

| 4.x.x example                                | 5.x.x example                  |
| -------------------------------------------- | ------------------------------ |
| KontentTaxonomyMyPersonas                    | kontent_taxonomy_my_personas   |

#### Type name

| 4.x.x pattern                                | 5.x.x pattern                  |
| -------------------------------------------- | ------------------------------ |
| KontentType{PascalCasedTypeCodename}         | kontent_type_{raw_codename}    |

| 4.x.x example                                | 5.x.x example                  |
| -------------------------------------------- | ------------------------------ |
| KontentTypeMyPerson                          | kontent_type_my_person         |

#### Item name

| 4.x.x pattern                                | 5.x.x pattern                  |
| -------------------------------------------- | ------------------------------ |
| KontentItem{PascalCasedItemCodename}         |  kontent_item_{raw_codename}   |

| 4.x.x example                                | 5.x.x example                  |
| -------------------------------------------- | ------------------------------ |
| KontentItemMyArticle                         | kontent_item_my_article        |

## From `3.x.x` to `4.x.x`

This upgrade is mainly caused by upgrading [Kentico Kontent Javascript Delivery SDK](https://github.com/Kentico/kontent-delivery-sdk-js), adding new features, and performance tuning.

### Language fallbacks

Gatsby source plugin is now including GraphQL nodes by the language fallbacks configuration. As a part of that, there is a new `preferred_language` property allowing to distinguish whether the fallback has been used or not.If the fallback is used `preferred language` is set to the desired language codename, but `system.language` value is using the actual culture that has been used (the fallback one). If the values are same, fallback is was not used.

### Configurable logging

There is a new plugin configuration property `enableLogging` which allows to turn on source plugin logging. Logging per every node generation was removed completely due to performance.

### Configurable content property

There is a new plugin configuration property `includeRawContent` which allows to include `internal.content` property as apart of the Kontent node. Property is not generated by default, because it was causing memory spikes for bigger projects (1000+ Kontent items).

### Custom element support

Custom element is now supported including [custom element models definition](https://github.com/Kentico/kontent-delivery-sdk-js/blob/v8.0.0/DOCS.md#using-custom-models-for-custom-elements). SO besides of the raw value property `value` it is possible to parse it and include it in the GraphQL model.

### Query names prefix changed

Query names prefixed has changed from `KenticoCloud*` to `Kontent*` - i.e. `KenticoCloudTypeArticle`->`KontentTypeArticle`, `KenticoCloudItemPost`->`KontentItemPost`.

### Delivery configuration

When configuring the Kentico Kontent Source plugin one of the properties to set is `deliveryClientConfig`. It is respecting the [`IDeliveryClientConfig`](https://github.com/Kentico/kontent-delivery-sdk-js/blob/master/UPGRADE.md#ideliveryclientconfig) interface from Kentico Kontent Delivery SDK.

#### Example

```javascript
module.exports = {
  ...
  plugins: [
    ...
    {
      resolve: `@kentico/gatsby-source-kontent`,
      options: {
        deliveryClientConfig: { // Configuration object
          projectId: `XXX`,
          typeResolvers: [],
          previewApiKey: `YYY`,
          secureApiKey: `ZZZ`,
          globalQueryConfig:  {
            ...
            usePreviewMode: true, // uses preview mode
            useSecuredMode: false, // disabled secured mode
            ...
          },
        },
        languageCodenames: [ // example configuration
          `en-US`, // default language
          `es-ES`,
        ]
      }
    }
    ...
  ]
  ...
}
```

### Elements structure unification

Basic Kontent Item Node elements types (text, name, date & time, multiple choice) [has element property called `value`](https://github.com/Kentico/kontent-delivery-sdk-js/blob/v8.0.0/UPGRADE.md#removal-of-type-specific-element-properties) not an element specific property.

Image assets now contains [information about its resolution](https://docs.kontent.ai/reference/api-changelog#a-image-resolution-in-delivery-api).

Linked items are not directly under the element codename (`linked_items_type` in example). There are new fields `name`, `type` and `itemCodenames` containing array of linked items codenames.

#### Elements structure example

```gql
{
  allKontentBasicElementExample {
    nodes {
      elements {
        text_type {
          name
          type
          value
        }
        number_type {
          name
          type
          value
        }
        date_of_birth {
          name
          type
          value
        }
        multiple_choice_type {
          name
          type
          value {
            codename
            name
          }
        }
        asset_type {
          name
          type
          value {
            name
            description
            size
            type
            url
            width
            height
          }
        }
        custom_element_type {
          name
          type
          value
        }
        linked_items_type {
          name
          type
          itemCodenames # array of the codenames
          linked_items { # Gatsby Graphql node relationships
            ... on Node {
              ... on KontentSubItemExample {
                elements {
                  text_type {
                    name
                    type
                    value
                  }
                }
              }
            }
          }
        }
      }
    }
  }
}
```

### Rich text element structure

Rich text elements internal structure was extended. The main difference is that `resolvedHtml` is now transfered `resolvedData.html`.

```gql
{
  allKontentRichTextExample {
    nodes {
      elements {
        rich_text_type {
          name
          type
          value
          linkedItemCodenames # array of the codenames
          linked_items {
            ... on Nodes {
              ... on KontentSubItemExample {
                elements {
                  text_type {
                    name
                    type
                    value
                  }
                }
              }
            }
          }
          images {
            description
            height
            imageId
            url
            width
          }
          links {
            codename
            linkId
            type
            urlSlug
          }
          resolvedData {
            html
            linkedItemCodenames
            componentCodenames
          }
        }
      }
    }
  }
}
```

### Schema definition API

Thanks to [#80](https://github.com/Kentico/gatsby-source-kontent/pull/80), [#94](https://github.com/Kentico/gatsby-source-kontent/pull/94), and [#95](https://github.com/Kentico/gatsby-source-kontent/pull/95) it is possible remove the [fully filled dummy content items](https://github.com/Kentico/gatsby-source-kontent/issues/59#issuecomment-496412677) from Kentico Kontent to provide Gatsby inference engine information about content structure.

For linked items in linked items element nor for rich text element encapsulation into the `... on Node` [GraphQL inline fragment](https://graphql.org/learn/queries/#inline-fragments) is not required any more ([#82](https://github.com/Kentico/gatsby-source-kontent/pull/82)).

```gql
{
  allKontentItemProjectReference {
    nodes {
      elements {
        related_project_references {
          linked_items {
            ... on Node { # NOT REQUIRED
              __typename
              ... on KontentItemBlogpostReference {
                elements {
                  title {
                    value
                  }
                }
              }
              ... on KontentItemProjectReference {
                elements {
                  project_name {
                    value
                  }
                }
              }
            }
          }
        }
      }
    }
  }
}
```

#### All Item query

As a part of that adjustment there are two queries (`allKontentItem` and `kontentItem`) allows to load content items from unified endpoint regardless of type

```gql
  query {
    allKontentItem {
      nodes {
        system {
          codename
          name
        }
      }
    }
  }
```

#### All Types query

As a part of that adjustment there are two queries (`allKontentType` and `kontentType`) allows to load content types from unified endpoint

```gql
query {
  allKontentType {
    nodes {
      elements {
        codename
        name
        type
        taxonomyGroup
        options {
          codename
          name
        }
      }
      system {
        id
        codename
        name
      }
    }
  }
}
```

### Taxonomy support

Thanks to the [#79](https://github.com/Kentico/gatsby-source-kontent/pull/79) it is possible to [query taxonomies](/README.md#Taxonomy-support) i.e. in case of loading all the taxonomy option to your ♠#.

```gql
query PersonasQuery {
  allKontentTaxonomyPersona {
    nodes {
      terms {
        codename
        name
        terms { # sub-terms
          codename
          name
        }
      }
    }
  }
}
```
