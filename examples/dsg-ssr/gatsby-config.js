/**
 * Configure your Gatsby site with this file.
 *
 * See: https://www.gatsbyjs.org/docs/gatsby-config/
 */

module.exports = {
  /* Your site config here */
  plugins: [
    {
      resolve: "@kontent-ai/gatsby-source",
      options: {
        projectId: "38205259-b626-0047-f701-a957030da6ed",
        languageCodenames: ["en-US"],
      },
    },
    'gatsby-plugin-netlify'
  ],
}
