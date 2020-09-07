import React from "react"
import { RichTextElement } from "@kentico/gatsby-kontent-components"
import { Link } from "gatsby"

export default () => {
  return (
    <>
      <RichTextElement value="<div>Hello Kontent!</div>" />
      <Link to="author">Image resolution example</Link>
      <Link to="articles">Article listing example</Link>
    </>
  )
}
