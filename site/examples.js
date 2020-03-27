const {
  getKontentItemNodeTypeName,
  getKontentTypeTypeName,
  getKontentItemElementTypeNameByType,
  getKontentItemInterfaceName,
} = require("@simply007org/gatsby-source-kontent-simple")

const resolveUrls = api => {
  const {
    actions: { createTypes },
    schema,
  } = api

  const urlSlugExtended = schema.buildObjectType({
    name: getKontentItemElementTypeNameByType("url_slug"),
    fields: {
      resolved_url: {
        type: "String",
        resolve: (source, args, context, info) => {
          const kontentItemNode = context.nodeModel.findRootNodeAncestor(source)
          // possible to use `kontentItemNode.elements.[<elementcodename>].value`
          // Just an example
          return `/${kontentItemNode.preferred_language}/${kontentItemNode.system.type}/${source.value}`
        },
      },
    },
  })

  createTypes(urlSlugExtended)
}

const addLanguageLinks = (api, typeCodename) => {
  const {
    actions: { createTypes },
    schema,
  } = api

  // i.e. article -> kontent_item_article
  const type = getKontentItemNodeTypeName(typeCodename)

  const extendedType = schema.buildObjectType({
    name: type,
    fields: {
      other_languages: {
        type: `[${type}]`,
        resolve: async (source, args, context, info) => {
          const pluginInfo = await context.nodeModel.runQuery({
            query: {
              filter: {
                name: {
                  eq: "@simply007org/gatsby-source-kontent-simple",
                },
              },
            },
            type: "SitePlugin",
            firstOnly: true,
          })
          const languageCodenames = pluginInfo.pluginOptions.languageCodenames
          const otherLanguageCodenames = languageCodenames.filter(
            lang => lang !== source.preferred_language
          )

          // Including language fallback
          const otherLanguageNodes = await context.nodeModel.runQuery({
            query: {
              filter: {
                system: {
                  codename: {
                    eq: source.system.codename,
                  },
                },
                preferred_language: {
                  in: otherLanguageCodenames,
                },
              },
            },
            type: type,
            firstOnly: false,
          })

          return otherLanguageNodes
        },
      },
      fallback_used: {
        type: "Boolean",
        resolve: (source, args, context, info) => {
          return source.preferred_language !== source.system.language
        },
      },
    },
  })
  createTypes(extendedType)
}

const addKontentTypeItemsLink = async api => {
  const {
    actions: { createTypes },
    schema,
  } = api

  const type = getKontentTypeTypeName()
  const extendedType = schema.buildObjectType({
    name: type,
    fields: {
      content_items: {
        type: `[${getKontentItemInterfaceName()}]`,
        resolve: async (source, args, context, info) => {
          const linkedContentItems = await context.nodeModel.runQuery({
            query: {
              filter: {
                system: {
                  type: {
                    eq: source.system.codename,
                  },
                },
              },
            },
            type: getKontentItemInterfaceName(),
            firstOnly: false,
          })

          return linkedContentItems
        },
      },
    },
  })

  createTypes(extendedType)
}

// child --(linkedElementCodename)--> parent
// Example
// parentTypeCodename --linkedElementCodename--> childTypeCodename
// article --tags--> tag
// Creating: tag --backReferenceName--> article
const linkUsedByContentItems = (
  api,
  parentTypeCodename,
  childTypeCodename,
  linkedElementCodename,
  backReferenceName
) => {
  const {
    actions: { createTypes },
    schema,
  } = api

  // i.e. article -> kontent_item_article
  const parentGraphqlType = getKontentItemNodeTypeName(parentTypeCodename)
  // i.e. tag -> kontent_item_tag
  const childGraphqlType = getKontentItemNodeTypeName(childTypeCodename)

  const extendedType = schema.buildObjectType({
    name: childGraphqlType,
    fields: {
      [backReferenceName]: {
        type: `[${parentGraphqlType}]`,
        resolve: async (source, args, context, info) => {
          const linkedNodes = await context.nodeModel.runQuery({
            query: {
              filter: {
                elements: {
                  [linkedElementCodename]: {
                    value: {
                      elemMatch: {
                        preferred_language: {
                          // depends on language fallback preferences
                          eq: source.preferred_language,
                        },
                        system: {
                          codename: {
                            eq: source.system.codename,
                          },
                        },
                      },
                    },
                  },
                },
              },
            },
            type: parentGraphqlType,
            firstOnly: false,
          })

          return linkedNodes
        },
      },
    },
  })

  createTypes(extendedType)
}

module.exports = {
  resolveUrls,
  addLanguageLinks,
  addKontentTypeItemsLink,
  linkUsedByContentItems,
}
