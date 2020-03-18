# Simple Gatsby source plugin for Kentico Kontent

## Description

(Unofficial) Simple source plugin for Kentico Kontent REST Delivery API.

> Include a summary of what this plugin accomplishes. Is there a demo site that shows how this plugin operates? If so, include a link to the deployed demo site and/or its source code here.
> Themes are considered plugins in the Gatsby ecosystem and should follow this README as well. Note that themes include multiple READMEs. One inside the theme directory with configuration instructions, one inside the example project directory, and one in the root of the repository which will follow this guide.

### Dependencies (optional)

> Are there any plugins that must be installed in order to make this plugin work? If so, please include a list of those plugins and links to their pages here.

### Learning Resources (optional)

> If there are other tutorials, docs, and learning resources that are necessary or helpful to someone using this plugin, please link to those here.

### Delivery API alternations

Some of the data from Kontent Delivery API requires to be altered, or extended in order to be usable in Gatsby. There is a list of them with its description.

#### Elements property

Elements property is transformed from object to array.

This is the "Website" type sample. As you can see there is `element` property, which is an object in Kontent delivery REST API.

```json
{
  "system": {
    "id": "aeabe925-9221-4fb2-bc3a-2a91abc904fd",
    "name": "Website",
    "codename": "website",
    "last_modified": "2019-04-01T18:33:45.0353591Z"
  },
  "elements": {
    "url": {
      "type": "text",
      "name": "URL"
    },
    "name": {
      "type": "text",
      "name": "Name"
    },
    "description": {
      "type": "rich_text",
      "name": "Description"
    }
  }
}
```

And here is the example how does the source plugin transform the data.

Query

```gql
{
  kontentType(system: { name: { eq: "Website" } }) {
    system {
      codename
      id
      last_modified
      name
    }
    elements {
      name
      codename
      type
    }
  }
}
```

Result

```json
{
  "data": {
    "kontentType": {
      "system": {
        "codename": "website",
        "id": "aeabe925-9221-4fb2-bc3a-2a91abc904fd",
        "last_modified": "2019-04-01T18:33:45.0353591Z",
        "name": "Website"
      },
      "elements": [
        {
          "name": "URL",
          "codename": "url",
          "type": "text"
        },
        {
          "name": "Name",
          "codename": "name",
          "type": "text"
        },
        {
          "name": "Description",
          "codename": "description",
          "type": "rich_text"
        }
      ]
    }
  }
}
```
## How to install

> Please include installation instructions here.
> Gatsby documentation uses `npm` for installation. This is the recommended approach for plugins as well.
> If the plugin is a theme that needs to use `yarn`, please point to [the documentation for switching package managers](/docs/gatsby-cli/#how-to-change-your-default-package-manager-for-your-next-project) in addition to the `yarn`-based instructions.

## Available options (if any)

## When do I use this plugin

> Include stories about when this plugin is helpful and/or necessary.

## Examples of usage

> This usually shows a code example showing how to include this plugin in a site's `config.js` file.

    code example

> See this [Markdown Cheatsheet](https://github.com/adam-p/markdown-here/wiki/Markdown-Cheatsheet#code) on how to format code examples.
> This section could also include before-and-after examples of data when the plugin is enabled, if applicable.

## How to query for data (source plugins only)

> If this is a source plugin README, source plugins ought to allow people to query for data within their Gatsby site. Please include code examples to show how to query for data using your source plugin.
> If this is a theme that requires data in a specific format in order to match an existing query, include those examples here.

## How to run tests

## How to develop locally

## How to contribute

> If you have unanswered questions, would like help with enhancing or debugging the plugin, it is nice to include instructions for people who want to contribute to your plugin.

- _written according to [Gatsby plugin template](https://www.gatsbyjs.org/contributing/docs-templates/#plugin-readme-template)_

```

```
