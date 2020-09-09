import React from "react"
import { graphql, Link } from "gatsby"
import Layout from "../components/layout"

const Articles = (props) => {

  const languageSwitch = props.data.sitePlugin.pluginOptions.languageCodenames
    .filter(lang => lang !== props.pageContext.language)
    .map(otherLanguage => (
      <li key={otherLanguage}><Link to={`/${otherLanguage}/articles`}>{otherLanguage}</Link></li>
    ))

  const articles = props.data.allKontentItemArticle.nodes.map(article => (
    <li key={article.elements.slug.value}><Link to={`/${props.pageContext.language}/articles/${article.elements.slug.value}`}>
      {article.elements.title.value}
    </Link></li>
  ))

  return (
    <Layout>
      <div>
        Language switch:
      <ul>
          {languageSwitch}
        </ul>
      </div>
      <h1>Articles</h1>
      <ul>
        {articles}
      </ul>
    </Layout>
  );
}

export const query = graphql`
query ArticlesQuery($language: String!) {
  sitePlugin(name: {eq: "@kentico/gatsby-source-kontent"}) {
    pluginOptions {
      languageCodenames
    }
  }
  allKontentItemArticle(filter: {fallback_used: {eq: false}, preferred_language: {eq: $language}}) {
    nodes {
      elements {
        title {
          value
        }
        slug {
          value
        }
      }
    }
  }
}
`

export default Articles
