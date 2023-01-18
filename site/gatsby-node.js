const { resolveUrls } = require("./example-resolve-url-slugs")

exports.createSchemaCustomization = async api => {
  resolveUrls(api)
}

exports.createPages = async ({actions}) => {
  actions.createSlice({
    id: `footer`,
    component: require.resolve(`./src/components/footer.js`),
  })
}
