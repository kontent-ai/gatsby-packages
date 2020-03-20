const { resolveUrls } = require("./examples");

exports.createSchemaCustomization = (api) => {
  resolveUrls(api);
}