# Upgrade

## Upgrade guide `3.x.x` to `4.x.x`

This upgrade is mainly caused by upgrading [Kentico Cloud Javascript Delivery SDK](https://github.com/Kentico/kentico-cloud-js/tree/master/packages/delivery).

### Delivery config

When configuring the Kentico Cloud Source plugin one of the properties to set is `deliveryClientConfig`. It is respecting the [`IDeliveryClientConfig`](https://github.com/Kentico/kentico-cloud-js/blob/master/packages/delivery/UPGRADE.md#ideliveryclientconfig) interface from Kentico Cloud SDK.

#### Example

```javascript
module.exports = {
  ...
  plugins: [
    ...
    {
      resolve: `gatsby-source-kentico-cloud`,
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

### Element value property unification

All of the elements types [has element property called `value`](https://github.com/Kentico/kentico-cloud-js/blob/master/packages/delivery/UPGRADE.md#removal-of-type-specific-element-properties) not an element specific property. There is also `rawData` property containing raw data without the touch of the SDK.

#### Basic types

```gql
{
  allKenticoCloudBasicElementExample {
    nodes {
      elements {
        text_type {
          name
          type
          value
          rawData {...}
        }
        number_type {
          name
          type
          value
          rawData {...}
        }
        date_of_birth {
          name
          type
          value
          rawData {...}
        }
        multiple_choice_type {
          name
          type
          value {
            codename
            name
          }
          rawData {...}
        }
        asset_type {
          name
          type
          value {
            name
            size
            type
            url
            width
            height
          }
          rawData {...}
        }
        custom_element_type {
          name
          type
          value
          rawData {...}
        }
      }
    }
  }
}
```

#### Linked items

Linked items are not directly under the element codename (`linked_items_type` in example). There are new fields `name`, `type` and `itemCodenames` plus the `value` containing GraphQL links to the linked items.

```gql
{
  allKenticoCloudLinkedItems {
    nodes {
      elements {
        linked_items_type {
          linked_items { // Gatsby Graphql node relationships
            ... on Node {
              ... on KenticoCloudSubItemExample {
                elements {
                  text_type {
                    name
                    type
                    value
                    rawData {...}
                  }
                }
              }
            }
          }
          itemCodenames // array of the codenames
          name
          type
          rawData {...}
        }
      }
    }
  }
}
```

#### Rich text

Rich text elements internal structure was extended. The main difference is that `resolvedHtml` is now transfered `resolvedData.html`.

```gql
{
  allKenticoCloudRichTextExample {
    nodes {
      elements {
        rich_text_type {
          images {
            height
            imageId
            url
            width
          }
          linkedItemCodenames // array of the codenames
          linked_items {
            ... on Nodes {
              ... on KenticoCloudSubItemExample {
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
          links {
            codename
            linkId
            type
            urlSlug
          }
          name
          resolvedData {
            html
            linkedItemCodenames
            componentCodenames
          }
          type
          value
          rawData {...}
        }
      }
    }
  }
}
```
