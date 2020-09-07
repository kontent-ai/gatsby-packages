# Gatsby Relationships Example

[![Netlify Status]()]()

TODO intro

## Get started

:warning: Before running any of the following scripts locally ensure the site is using the latest dependencies

```sh
# In the root folder of this repo
yarn # install all required packages
yarn build # build the latest version of the local packages
```

### Develop site

```sh
# open the /example/relationships folder
cd example/relationships
yarn develop # runs `gatsby develop` command
```

Now you could browse the site on <http://localhost:8000> and see GraphiQL explorer on <http://localhost:8000/___graphql>.

## Content modeling

This section explains how the content is modeled. You could follow to next section ["Import the content to your on Kontent project"](#Import-site-content-to-your-Kontent-project) and explore the models by your own as well as the sample data based on it. Or you could create models manually to familiarize yourself with the Kontent user interface.

Once you create the content models, you could create content items based on these and the site would be capable to handle the content and render it.

### Kontent content models

TODO

## Examples

### Language variant relationships

The relationship capturing relationship about language variants could be ensured by extended schema definition.

Showcase is in [Language variant relationships](./example-languages-link.js).

Language selector for articles - article detail

### Content type -> Content Item resolution

The relationship capturing relationship about content type and its content items could be ensured by extended schema definition.

1. turn on Content types to be in the result

Article Category as Multiple Choice with filter

> Mentions demonstrational purposes, nebefits - categories are single defined, does not polite items listing, but not re-suable, with no additional data, no url slug possibility and no hierarchy

> Mention the same approach in Taxonomies link

Showcase is in [Content type -> Content Item resolution](./example-type-items-link.js).

### Linked from relationship

Reverse link resolution relationship could be ensured by the schema definition as well.

Showcase is in [Linked from relationship](./example-used-by-content-item-link.js).

Tag -> Article

## Import site content to your Kontent project

TODO: Export project

If you want to import content types with the sample content in your own empty project, you could use following guide:

1. Go to [app.kontent.ai](https://app.kontent.ai) and [create empty project](https://docs.kontent.ai/tutorials/set-up-kontent/projects/manage-projects#a-creating-projects)
1. Go to "Project Settings", select API keys and copy `Project ID`
1. Install [Kontent Backup Manager](https://github.com/Kentico/kontent-backup-manager-js) and import data to newly created project from [`kontent-backup.zip`](./kontent-backup.zip) file (place appropriate values for `apiKey` and `projectId` arguments):

   ```sh
   npm i -g @kentico/kontent-backup-manager

   kbm --action=restore --apiKey=<Management API key> --projectId=<Project ID> --zipFilename=kontent-backup
   ```

   > Alternatively, you can use the [Template Manager UI](https://kentico.github.io/kontent-template-manager/import-from-file) for importing the content.

1. Go to your Kontent project and [publish all the imported items](https://docs.kontent.ai/tutorials/write-and-collaborate/publish-your-work/publish-content-items).

### Connect the site to custom project

Open the `gatsby-config.js` file and set following properties for `@kentico/gatsby-source-kontent` plugin:

- `projectId` from *Project settings > API keys > Delivery API > Project ID*
- `languageCodenames` from *Project settings > Localization*

![Analytics](https://kentico-ga-beacon.azurewebsites.net/api/UA-69014260-4/Kentico/kontent-gatsby-packages/examples/relationships?pixel)
