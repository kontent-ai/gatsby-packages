/**
 * Configure your Gatsby site with this file.
 *
 * See: https://www.gatsbyjs.org/docs/gatsby-config/
 */

module.exports = {
  /* Your site config here */
  plugins: [
    {
      resolve: "@kentico/gatsby-source-kontent",
      options: {
        projectId: "acbbb625-e820-00f4-94eb-e81753de429e", // Fill in your Project ID
        languageCodenames: [
          "default", // Languages in your project (Project settings -> Localization),
        ],
      },
    },
  ],
}
