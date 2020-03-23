/**
 * Configure your Gatsby site with this file.
 *
 * See: https://www.gatsbyjs.org/docs/gatsby-config/
 */

module.exports = {
  plugins: [
    {
      resolve: '@simply007org/gatsby-source-kontent-simple',
      options: {
        projectId: '09fc0115-dd4d-00c7-5bd9-5f73836aee81', // Fill in your Project ID
        languageCodenames: [
          'default', // Or the languages in your project (Project settings -> Localization),
          'Another_language'
        ],
        includeTaxonomies: true,
        includeTypes: true
      },
    }
  ]
}
