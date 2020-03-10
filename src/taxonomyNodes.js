const { parse, stringify } = require('flatted/cjs');
const _ = require('lodash');

const normalize = require('./normalize');

/**
 * Creates an array of content type nodes ready to be imported to Gatsby model.
 * @param {Object} client Delivery client
 * @param {Function} createNodeId Gatsby method for generating ID
 * @param {Boolean} includeRawContent
 *  Include raw content property in artifact node
 */
const get = async (client, createNodeId, includeRawContent) => {
  const taxonomiesResponse = await client
    .taxonomies()
    .toPromise();
  const taxonomiesFlatted = parse(stringify(taxonomiesResponse.taxonomies));
  const taxonomyNodes = taxonomiesFlatted.map((taxonomy) => {
    try {
      return createTaxonomyNode(createNodeId, taxonomy, includeRawContent);
    } catch (error) {
      console.error(error);
    }
  });
  return taxonomyNodes;
};

/**
 * Creates a Gatsby object out of a Kentico Kontent taxonomy object.
 * @param {function} createNodeId - Gatsby function to create a node ID.
 * @param {object} taxonomy - Kentico Kontent taxonomy object.
 * @return {object} Gatsby content type node.
 * @param {Boolean} includeRawContent
 *  Include raw content property in artifact node
 * @throws {Error}
 */
const createTaxonomyNode = (createNodeId, taxonomy, includeRawContent) => {
  if (!_.isFunction(createNodeId)) {
    throw new Error(`createNodeId is not a function.`);
  }

  const nodeId = createNodeId(`kentico-kontent-taxonomy-${taxonomy.system.codename}`);

  const additionalData = {};

  return normalize.createKontentArtifactNode(
    nodeId,
    taxonomy,
    `Taxonomy`,
    taxonomy.system.codename,
    additionalData,
    includeRawContent,
    taxonomy
  );
};

module.exports = {
  get,
};
