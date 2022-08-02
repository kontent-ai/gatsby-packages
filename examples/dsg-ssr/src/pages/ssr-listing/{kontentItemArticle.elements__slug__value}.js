import React from "react"
import Layout from "../../components/layout"
import { plugins } from "../../../gatsby-config"

export default function Component({ serverData }) {
  return (
    <Layout>
      <h1>{serverData.title}</h1>
      <div>Published: {serverData.date}</div>
      <p>{serverData.content}</p>
    </Layout>
  )
}

const kontentSourcePluginConfig = plugins.find(
  plugin => plugin.resolve === "@kontent-ai/gatsby-source-kontent"
)
const projectId = kontentSourcePluginConfig.options.projectId
const language = kontentSourcePluginConfig.options.languageCodenames[0]

export async function getServerData(context) {
  try {
    const response = await fetch(`https://graphql.kontent.ai/${projectId}`, {
      method: "POST",

      headers: {
        "Content-Type": "application/json",
      },

      body: JSON.stringify({
        query: `
        query ssrArticleQuery($slug: String!, $language: String!) {
          article_All(where: {slug: {eq: $slug}}, limit: 1, languageFilter: {languageCodename: $language}) {
            items {
              title
              date
              content
            }
          }
        }`,
        variables: {
          slug: context.params.elements__slug__value,
          language: language,
        },
      }),
    }).then(res => res.json())

    return {
      props: response.data.article_All.items[0],
    }
  } catch (error) {
    return {
      status: 500,
      headers: {},
      props: {},
    }
  }
}
