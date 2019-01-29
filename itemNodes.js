"use strict";

const {
  parse,
  stringify
} = require(`flatted/cjs`);

const _ = require(`lodash`);

const normalize = require(`./normalize`);
/**
 * Creates an array of content item nodes ready to be imported to Gatsby model.
 * @param {Object} client Delivery client
 * @param {String} defaultLanguageCodename Project default language codename
 * @param {Function} createNodeId Gatsby method for generating ID
 * @param {Array} contentTypeNodes Array of content type nodes
 */


const getFromDefaultLanguage = async (client, defaultLanguageCodename, createNodeId, contentTypeNodes) => {
  const contentItemsResponse = await client.items().languageParameter(defaultLanguageCodename).getPromise(); // TODO extract to method

  contentItemsResponse.items.forEach(item => {
    Object.keys(item).filter(key => _.has(item[key], `type`) && item[key].type === `rich_text`).forEach(key => {
      item.elements[key].resolvedHtml = item[key].getHtml().toString();
      item[key].images = Object.values(item.elements[key].images);
    });
  });
  const itemsFlatted = parse(stringify(contentItemsResponse.items));
  const contentItemNodes = itemsFlatted.map(contentItem => {
    try {
      return normalize.createContentItemNode(createNodeId, contentItem, contentTypeNodes);
    } catch (error) {
      console.error(error);
    }
  });
  return contentItemNodes;
};

module.exports = {
  getFromDefaultLanguage
};