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
        includeTypes: true,
        usePreviewUrl: true,
        authorizationKey: "ew0KICAiYWxnIjogIkhTMjU2IiwNCiAgInR5cCI6ICJKV1QiDQp9.ew0KICAianRpIjogImRiN2I0NDg2OTgyZDQ5NTNhZTRjNjJhMDI2NTk4ZTMyIiwNCiAgImlhdCI6ICIxNTg0OTYwNzk1IiwNCiAgImV4cCI6ICIxOTMwNTYwNzk1IiwNCiAgInByb2plY3RfaWQiOiAiMDA2NzZhOGQzNThjMDA4NGYyZjIzM2VkNDY2YzQ4MGEiLA0KICAidmVyIjogIjEuMC4wIiwNCiAgImF1ZCI6ICJwcmV2aWV3LmRlbGl2ZXIua2VudGljb2Nsb3VkLmNvbSINCn0.NgIclgT6K-v_KN9XMtzdBnEevuMlucO9_OBAaQuvKXg"
      },
    }
  ]
}
