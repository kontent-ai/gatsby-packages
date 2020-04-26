/**
 * Configure your Gatsby site with this file.
 *
 * See: https://www.gatsbyjs.org/docs/gatsby-config/
 */

module.exports = {
  plugins: [
    {
      resolve: "@kentico/gatsby-source-kontent",
      options: {
        projectId: "f08e590f-a595-007a-3c6f-7e179dc3c708", // Fill in your Project ID
        languageCodenames: [
          "en-US", // Or the languages in your project (Project settings -> Localization),
          "cs-CZ",
        ],
        includeTaxonomies: true,
        includeTypes: true,
        usePreviewUrl: true,
        authorizationKey: "ew0KICAiYWxnIjogIkhTMjU2IiwNCiAgInR5cCI6ICJKV1QiDQp9.ew0KICAianRpIjogImI2NTRmM2E3MGU0ODQzNWY5YTY2NjQ3MDNlM2RkNzFkIiwNCiAgImlhdCI6ICIxNTg2MzI4Mzc2IiwNCiAgImV4cCI6ICIxOTMxOTI4Mzc2IiwNCiAgInByb2plY3RfaWQiOiAiZjA4ZTU5MGZhNTk1MDA3YTNjNmY3ZTE3OWRjM2M3MDgiLA0KICAidmVyIjogIjEuMC4wIiwNCiAgImF1ZCI6ICJwcmV2aWV3LmRlbGl2ZXIua2VudGljb2Nsb3VkLmNvbSINCn0.93F7hGWkxi5wSsxYoHXZbYxAZ6FRrWb1qabEJgP0A8U",
        // includeRawContent: true,
        proxy: {
          deliveryDomain: "qa-deliver.global.ssl.fastly.net",
          previewDeliveryDomain: "qa-preview-deliver.global.ssl.fastly.net"
        }
      },
    },
  ],
}
