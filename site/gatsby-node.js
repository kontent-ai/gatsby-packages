const { resolveUrls } = require("./example-resolve-url-slugs")

exports.createSchemaCustomization = async api => {
  resolveUrls(api)
}
