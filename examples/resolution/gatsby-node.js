const { resolveUrl } = require("./src/utils/resolvers");

exports.createPages = async ({ graphql, actions }) => {
  const { createPage } = actions

  const { data } = await graphql(`
    query PagesQuery {
      allKontentItemPerson {
        nodes {
          __typename
          elements {
            slug {
              value
            }
          }
          system {
            codename
          }
          preferred_language
        }
      }
      allKontentItemRepository {
        nodes {
          __typename
          elements {
            slug {
              value
            }
          }
          system {
            codename
          }
          preferred_language
        }
      }
      allKontentItemWebsite {
        nodes {
          __typename
          elements {
            slug {
              value
            }
          }
          system {
            codename
          }
          preferred_language
        }
      }
    }
  `);

  const {
    allKontentItemPerson: {
      nodes: people
    },
    allKontentItemRepository: {
      nodes: repositories
    },
    allKontentItemWebsite: {
      nodes: websites
    }
  } = data;

  people.forEach(person => {
    createPage({
      path: resolveUrl(person.__typename, person.elements.slug.value),
      component: require.resolve(`./src/templates/person.js`),
      context: {
        language: person.preferred_language,
        codename: person.system.codename,
      },
    })
  });

  repositories.forEach(repository => {
    createPage({
      path: resolveUrl(repository.__typename, repository.elements.slug.value),
      component: require.resolve(`./src/templates/repository.js`),
      context: {
        language: repository.preferred_language,
        codename: repository.system.codename,
      },
    })
  });

  websites.forEach(website => {
    createPage({
      path: resolveUrl(website.__typename, website.elements.slug.value),
      component: require.resolve(`./src/templates/website.js`),
      context: {
        language: website.preferred_language,
        codename: website.system.codename,
      },
    })
  });
}