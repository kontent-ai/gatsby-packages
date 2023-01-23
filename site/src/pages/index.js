import React from "react"
import { RichTextElement } from "@kontent-ai/gatsby-components"
import { Link } from "gatsby"
import { Layout } from "../components/layout"

const Index = () => {
  return (
    <Layout>
      <RichTextElement value="<div>Hello Kontent.ai!</div>" />
      <ul>
        <li><Link to="author">Image resolution example</Link></li>
        <li><Link to="articles">Article listing example</Link></li>
      </ul>
    </Layout>
  )
}

export default Index;
