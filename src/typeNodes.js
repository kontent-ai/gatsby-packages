const { parse, stringify } = require(`flatted/cjs`);

const normalize = require(`./normalize`);

/**
 * Creates an array of content type nodes ready to be imported to Gatsby model.
 * @param {Object} client Delivery client
 * @param {Function} createNodeId Gatsby method for generating ID
 */
const get = async (client, createNodeId) => {
  const contentTypesResponse = await client
    .types()
    .getPromise();
  const typesFlatted = parse(stringify(contentTypesResponse.types));
  const contentTypeNodes = typesFlatted.map((contentType) => {
    try {
      return normalize.createContentTypeNode(createNodeId, contentType);
    } catch (error) {
      console.error(error);
    }
  });
  return contentTypeNodes;
};

module.exports = {
  get,
};
