
const { linkLanguageVariants } = require("./example-languages-variants")
const {
  linkUsedByContentItems,
} = require("./example-used-by-content-item-link")

exports.createSchemaCustomization = async api => {
  linkLanguageVariants(api, "article")
  linkUsedByContentItems(api, "article", "tag", "tags", "used_by_articles")
}

exports.createPages = async ({ graphql, actions }) => {
  const { createPage, createRedirect } = actions

  const { data: { sitePlugin: { pluginOptions: { languageCodenames } } } } = await graphql(`
    query SiteLanguages {
      sitePlugin(name: {eq: "@kentico/gatsby-source-kontent"}) {
        pluginOptions {
          languageCodenames
        }
      }
    }
  `)

  languageCodenames.forEach(language => {
    createPage({
      path: `${language}/articles`,
      component: require.resolve(`./src/templates/articles.js`),
      context: {
        language: language,
      },
    })
  });

  createRedirect({
    fromPath: '/articles',
    toPath: `/${languageCodenames[0]}/articles`,
    redirectInBrowser: true,
    isPermanent: true
  })


  const { data } = await graphql(`
  {
    allKontentItemArticle(filter: {fallback_used: {eq: false}}) {
      nodes {
        preferred_language
        system {
          codename
        }
        elements {
          slug {
            value
          }
        }
      }
    }
  }
  `)

  const { allKontentItemArticle: { nodes: articlesData } } = data;

  articlesData.forEach(article => {
    createPage({
      path: `${article.preferred_language}/articles/${article.elements.slug.value}`,
      component: require.resolve(`./src/templates/article-detail.js`),
      context: {
        codename: article.system.codename,
        language: article.preferred_language,
      },
    })
  });
}