const { parse, stringify } = require('flatted/cjs');
const _ = require('lodash');

const normalize = require('./normalize');
const validation = require('./validation');

/**
 * Creates an array of content type nodes ready to be imported to Gatsby model.
 * @param {Object} client Delivery client
 * @param {Function} createNodeId Gatsby method for generating ID
 * @param {Boolean} includeRawContent
 *  Include raw content property in artifact node
 */
const get = async (client, createNodeId, includeRawContent) => {
  const contentTypesResponse = await client
    .types()
    .toPromise();
  const typesFlatted = parse(stringify(contentTypesResponse.types));
  const contentTypeNodes = typesFlatted.map((contentType) => {
    try {
      return createContentTypeNode(
        createNodeId,
        contentType,
        includeRawContent);
    } catch (error) {
      console.error(error);
    }
  });
  return contentTypeNodes;
};

/**
 * Creates a Gatsby object out of a Kentico Kontent content type object.
 * @param {function} createNodeId - Gatsby function to create a node ID.
 * @param {object} contentType - Kentico Kontent content type object.
 * @param {Boolean} includeRawContent
 *  Include raw content property in artifact node
 * @return {object} Gatsby content type node.
 * @throws {Error}
 */
const createContentTypeNode = (
  createNodeId,
  contentType,
  includeRawContent) => {
  if (!_.isFunction(createNodeId)) {
    throw new Error(`createNodeId is not a function.`);
  }
  validation.checkTypesObjectStructure([contentType]);

  const nodeId = createNodeId(`kentico-kontent-type-${contentType.system.codename}`);

  const additionalData = {
    contentItems___NODE: [],
  };

  return normalize.createKontentArtifactNode(
    nodeId,
    contentType,
    `type`,
    contentType.system.codename,
    additionalData,
    includeRawContent,
    contentType
  );
};

module.exports = {
  get,
};
