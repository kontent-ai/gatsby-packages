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
        projectId: '0fe3ab32-97a8-005d-6928-eda983ea70a5',
        languageCodenames: [
          'default'
        ]
      },
    },
  ],
}
