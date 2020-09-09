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
        projectId: '450f9e6a-bb20-000a-eb93-9db78f0d98ca',
        languageCodenames: [
          'en-US',
          'cs-CZ'
        ],
      },
    },
  ],
}
