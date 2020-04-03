const {
  getKontentItemNodeTypeName,
} = require("@simply007org/gatsby-source-kontent-simple")

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
        // https://www.gatsbyjs.org/docs/schema-customization/
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
  linkUsedByContentItems,
}
