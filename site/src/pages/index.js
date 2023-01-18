import React from "react"
import { RichTextElement } from "@kontent-ai/gatsby-components"
import { Link, Slice } from "gatsby"

const Index = () => {
  return (
    <>
      <RichTextElement value="<div>Hello Kontent.ai!</div>" />
      <ul>
        <li><Link to="author">Image resolution example</Link></li>
        <li><Link to="articles">Article listing example</Link></li>
      </ul>
      <Slice alias="footer"></Slice>
    </>
  )
}

export default Index;