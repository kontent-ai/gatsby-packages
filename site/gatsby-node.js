const { resolveUrls } = require("./example-resolve-url-slugs")
const { addLanguageLinks } = require("./example-languages-link")
const { addKontentTypeItemsLink } = require("./example-type-items-link")
const {
  linkUsedByContentItems,
} = require("./example-used-by-content-item-link")

exports.createSchemaCustomization = async api => {
  resolveUrls(api)
  addLanguageLinks(api, "article")
  addKontentTypeItemsLink(api)
  linkUsedByContentItems(api, "article", "tag", "tags", "used_by_articles")
}
