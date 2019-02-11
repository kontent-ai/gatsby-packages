const { parse, stringify } = require('flatted/cjs');
const _ = require('lodash');
const changeCase = require('change-case');

const normalize = require('./normalize');

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
      return createContentTypeNode(createNodeId, contentType);
    } catch (error) {
      console.error(error);
    }
  });
  return contentTypeNodes;
};

/**
 * Creates a Gatsby object out of a Kentico Cloud content type object.
 * @param {function} createNodeId - Gatsby function to create a node ID.
 * @param {object} contentType - Kentico Cloud content type object.
 * @return {object} Gatsby content type node.
 * @throws {Error}
 */
const createContentTypeNode = (createNodeId, contentType) => {
  if (!_.isFunction(createNodeId)) {
    throw new Error(`createNodeId is not a function.`);
  } else if (!_.has(contentType, `system.codename`)) {
    throw new Error(`contentType is not a valid content type object.`);
  }

  const codenameParamCase = changeCase.paramCase(contentType.system.codename);
  const nodeId = createNodeId(`kentico-cloud-type-${codenameParamCase}`);

  const additionalData = {
    contentItems___NODE: [],
  };

  return normalize.createKcArtifactNode(
    nodeId,
    contentType,
    `type`,
    contentType.system.codename,
    additionalData
  );
};

module.exports = {
  get,
};
