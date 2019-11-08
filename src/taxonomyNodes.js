const { parse, stringify } = require('flatted/cjs');
const _ = require('lodash');
const changeCase = require('change-case');

const normalize = require('./normalize');
const validation = require('./validation');

/**
 * Creates an array of content type nodes ready to be imported to Gatsby model.
 * @param {Object} client Delivery client
 * @param {Function} createNodeId Gatsby method for generating ID
 */
const get = async (client, createNodeId) => {
    const taxonomiesResponse = await client
        .taxonomies()
        .toPromise();
    const taxonomiesFlatted = parse(stringify(taxonomiesResponse.taxonomies));
    const taxonomyNodes = taxonomiesFlatted.map((taxonomy) => {
        try {
            return createTaxonomyNode(
                createNodeId,
                taxonomy);
        } catch (error) {
            console.error(error);
        }
    });
    return taxonomyNodes;
};

/**
 * Creates a Gatsby object out of a Kentico Cloud taxonomy object.
 * @param {function} createNodeId - Gatsby function to create a node ID.
 * @param {object} taxonomy - Kentico Cloud taxonomy object.
 * @return {object} Gatsby content type node.
 * @throws {Error}
 */
const createTaxonomyNode = (
    createNodeId,
    taxonomy) => {
    if (!_.isFunction(createNodeId)) {
        throw new Error(`createNodeId is not a function.`);
    }

    validation.checkTypesObjectStructure([taxonomy]);
    const codenameParamCase = changeCase.paramCase(taxonomy.system.codename);
    const nodeId = createNodeId(`kentico-cloud-taxonomy-${codenameParamCase}`);

    return normalize.createKcArtifactNode(
        nodeId,
        taxonomy,
        `taxonomy`,
        taxonomy.system.codename
    );
};

module.exports = {
    get,
};