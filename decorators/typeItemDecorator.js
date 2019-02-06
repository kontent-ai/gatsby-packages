"use strict";

const normalize = require(`../normalize`);
/**
 * Add Gatsby relations from type nodes to items based on this type.
 * @param {Array} contentItemNodes
 *  Gatsby content item nodes to make a link in
 * @param {Array} contentTypeNodes
 *  Gatsby content type nodes
 */


const decorateTypeNodesWithItemLinks = (contentItemNodes, contentTypeNodes) => {
  try {
    normalize.decorateTypeNodesWithItemLinks(contentItemNodes, contentTypeNodes);
  } catch (error) {
    console.error(error);
  }
};

module.exports = {
  decorateTypeNodesWithItemLinks
};