const {
  getKontentItemElementTypeNameByType,
} = require("@kentico/gatsby-source-kontent")

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
        // https://www.gatsbyjs.org/docs/schema-customization/
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

module.exports = {
  resolveUrls,
}
