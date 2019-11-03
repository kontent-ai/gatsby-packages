const _ = require(`lodash`);

/**
 * Create a new property with resolved Html.
 * @param {Array} items Items response from JS SDK.
 */
const resolveUrls = (items) => {
  items.forEach((item) => {
    Object
      .keys(item)
      .filter((key) =>
        _.has(item[key], `type`)
        && item[key].type === `url_slug`)
      .forEach((key) => {
        item[key].resolvedUrl = item[key].resolveUrl();
      });
  });
};

module.exports = {
  resolveUrls,
};

