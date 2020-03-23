const { resolveUrls, addLanguageLinks, addKontentTypeItemsLink, linkUsedByContentItems } = require("./examples");

exports.createSchemaCustomization = async (api) => {
  resolveUrls(api);
  addLanguageLinks(api, "article");
  addKontentTypeItemsLink(api);
  linkUsedByContentItems(api, "article", "tag", "tags", "used_by_articles");
}