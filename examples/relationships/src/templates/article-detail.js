import React from "react"
import { graphql, Link } from "gatsby"
import Layout from "../components/layout";

const ArticleDetail = ({ data: { kontentItemArticle }, pageContext }) => {

  const languageSwitch = kontentItemArticle.other_languages
    .map(otherLanguage => (
      <li key={`${otherLanguage.preferred_language}-${otherLanguage.elements.slug.value}`}>
        <Link to={`/${otherLanguage.preferred_language}/articles/${otherLanguage.elements.slug.value}`}>
          {otherLanguage.preferred_language}
        </Link>
      </li>
    ))


  return (
    <Layout>
      <div>
        <div style={{ padding: '0.5em', margin: '0.5em 0', display: 'inline-block' }}>
          <Link to={`/${pageContext.language}/articles`}>&lt;&lt; Back to article listing</Link>
        </div>
      </div>
      {
        languageSwitch.length > 0 &&
        <div>
          Language switch:
          <ul>
            {languageSwitch}
          </ul>
        </div>
      }
      <h1>{kontentItemArticle.elements.title.value}</h1>
      <div>{kontentItemArticle.elements.date.value}</div>
      <p>{kontentItemArticle.elements.content.value}</p>
    </Layout>
  );
}
export const query = graphql`
query ArticleQuery($language: String!, $codename: String!) {
  kontentItemArticle(preferred_language: {eq: $language}, system: {codename: {eq: $codename}}) {
    elements {
      title {
        value
      }
      date {
        value(formatString: "YYYY-MM-DD")
      }
      content { 
        value
      }
    }
    other_languages {
      preferred_language
      elements {
        slug {
          value
        }
      }
    }
  }
}
`

export default ArticleDetail
