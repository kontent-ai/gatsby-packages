const resolveUrls = (api) => {

  const { actions, schema } = api;
  const { createTypes } = actions;
  const typeDefs = [
    "type kontent_item_url_slug_element_value { resolvedUrl: String }",
    schema.buildObjectType({
      name: "kontent_item_url_slug_element_value",
      fields: {
        resolvedUrl: {
          type: "String",
          resolve: async (source, args, context, info) => {
            const kontentItemNode = context.nodeModel.findRootNodeAncestor(source);
            // possible to use `kontentItemNode.elements.[<elementcodename>].value`
            // Just an example
            return `/${kontentItemNode.preferred_language}/${kontentItemNode.system.type}/${source.value}`;
          },
        },
      },
    }),
  ]
  createTypes(typeDefs)
};

module.exports = {
  resolveUrls
}