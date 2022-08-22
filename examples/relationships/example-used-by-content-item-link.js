const {
  getKontentItemNodeTypeName,
} = require("@kontent-ai/gatsby-source")

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
        resolve: async (source, args, context) => {
          const { entries } = await context.nodeModel.findAll({
            query: {
              filter: {},
            },
            type: parentGraphqlType,
          })
          const allParentTypeNodes = Array.from(entries);
          return allParentTypeNodes.filter(item =>
            item.preferred_language === source.preferred_language
            && item.elements[linkedElementCodename].value.includes(source.system.codename)
          )
        },
      },
    },
  })

  createTypes(extendedType)
}

module.exports = {
  linkUsedByContentItems,
}
