import React from "react";
import { graphql } from 'gatsby';

const Footer = ({ data }) => {
  return (
    <footer style={{ paddingTop: "16px" }}>
      <p>This footer is created using Slice API</p>
      <p>Author: {data.author.elements.name.value}</p>
    </footer>
  )
}

export default Footer

export const query = graphql`
{
    author: kontentItemAuthor {
        elements {
            name {
                value
            }
        }
    }
}
`
