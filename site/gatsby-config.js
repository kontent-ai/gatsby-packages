/**
 * Configure your Gatsby site with this file.
 *
 * See: https://www.gatsbyjs.org/docs/gatsby-config/
 */

module.exports = {
  plugins: [
    {
      resolve: "@simply007org/gatsby-source-kontent-simple",
      options: {
        projectId: "6bf2c182-c337-010c-2383-ac4eddf0e261", // Fill in your Project ID
        languageCodenames: [
          "default", // Or the languages in your project (Project settings -> Localization),
          "cs-CZ",
        ],
        includeTaxonomies: true,
        includeTypes: true,
        // usePreviewUrl: true,
        // authorizationKey: ""
      },
    },
  ],
}
