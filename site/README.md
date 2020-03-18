# Gatsby Starter Kontent Lumen

Lumen is a minimal, lightweight and mobile-first starter for creating blogs using
[Gatsby](https://github.com/gatsbyjs/gatsby).

This is an edited clone of
[gatsby-starter-lumen](https://github.com/alxshelepenok/gatsby-starter-lumen) and [gatsby-v2-starter-lumen](https://github.com/GatsbyCentral/gatsby-v2-starter-lumen)
migrated for getting content from headless CMS
[Kontent](https://kontent.ai/).

## Features
+ Content from [Kontent](http://kontent.ai/) headless CMS.
+ Lost Grid ([peterramsing/lost](https://github.com/peterramsing/lost)).
+ Beautiful typography inspired by [matejlatin/Gutenberg](https://github.com/matejlatin/Gutenberg).
+ [Mobile-First](https://medium.com/@mrmrs_/mobile-first-css-48bc4cc3f60f) approach in development.
+ Stylesheet built using SASS and [BEM](http://getbem.com/naming/)-Style naming.
+ Syntax highlighting in code blocks.
+ Sidebar menu built using a configuration block.
+ Archive organized by tags and categories.
+ Automatic Sitemap generation.
+ Google Analytics support.

## Folder Structure

```
└── src
    ├── assets
    │   ├── fonts
    │   │   └── fontello-771c82e0
    │   │       ├── css
    │   │       └── font
    │   └── scss
    │       ├── base
    │       ├── mixins
    │       └── pages
    ├── components
    │   ├── Article
    │   ├── ArticleTemplateDetails
    │   ├── CategoryTemplateDetails
    │   ├── Links
    │   ├── Layout
    │   ├── Menu
    │   ├── PageTemplateDetails
    │   ├── Sidebar
    │   └── TagTemplateDetails
    ├── pages
    └── templates
```

## Getting Started
Install this starter (assuming Gatsby is installed) by running from your CLI:
`gatsby new gatsby-starter-kontent-lumen https://github.com/kentico/gatsby-starter-kontent-lumen`

#### Import sample data and content structure from the source project into your project

1. Create a free project in app.kontent.ai
1. Get a [projectId](https://docs.kontent.ai/reference/management-api-v2#section/Authentication) and a [CM API key](https://docs.kontent.ai/reference/management-api-v2#section/Authentication) of the newly created (target) project
1. Go to Kontent [Template Manager](https://kentico.github.io/kontent-template-manager/) and enter copied `projectId` and `CM API key` into *Target Project* section
1. Into *Source Project* section copy `00676a8d-358c-0084-f2f2-33ed466c480a` projectId and `default` language
1. Click on `Prepare import data`
1. Click on `Proceed with import`
1. Use target `projectId` in the `gatsby-config.json`

#### Running in Development
`gatsby develop`

#### Building
`gatsby build`

#### Deploy with Netlify

Netlify CMS can run in any frontend web environment, but the quickest way to try it out is by running it on a pre-configured starter site with Netlify. Use the button below to build and deploy your own copy of the repository:

<a href="https://app.netlify.com/start/deploy?repository=https://github.com/GatsbyCentral/gatsby-v2-starter-lumen" target="_blank"><img src="https://www.netlify.com/img/deploy/button.svg" alt="Deploy to Netlify"></a>

After clicking that button, you’ll authenticate with GitHub and choose a repository name. Netlify will then automatically create a repository in your GitHub account with a copy of the files from the template. Next, it will build and deploy the new site on Netlify, bringing you to the site dashboard when the build is complete. Next, you’ll need to set up Netlify’s Identity service to authorize users to log in to the CMS.

## Screenshot

![](http://i.imgur.com/422y5GV.png)

## Ports
[Statinamic port](https://github.com/thangngoc89/statinamic-theme-lumen) by [Khoa Nguyen](https://github.com/thangngoc89)

## Contributors
* https://github.com/alxshelepenok
* https://github.com/abisz
* https://github.com/mariolopjr
* https://github.com/ihororlovskyi
* https://github.com/marcelabomfim
* https://github.com/vinnymac
* https://github.com/axelclark
* https://github.com/ybbarng
* https://github.com/marktani
* https://github.com/concreted
* https://github.com/charandas
* https://github.com/zollillo
* https://github.com/codejet
* https://github.com/reed-jones
* https://github.com/swapnilmishra
* https://github.com/vvasiloud
* https://github.com/wichopy
* https://github.com/chmac
* https://github.com/YoruNoHikage
* https://github.com/MartinRosenberg
