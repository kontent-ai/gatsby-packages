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
        projectId: '00676a8d-358c-0084-f2f2-33ed466c480a', // Fill in your Project ID
        languageCodenames: [
          'default', // Or the languages in your project (Project settings -> Localization),
          'cs-CZ'
        ],
        includeTaxonomies: true,
        includeTypes: true
      },
    }
  ]
}
