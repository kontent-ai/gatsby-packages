import React from "react"
import { useStaticQuery, graphql } from "gatsby"

const Menu = () => {
  const data = useStaticQuery(graphql`
    {
      allKontentItemNavigationItem {
        nodes {
          elements {
            title {
              value
            }
          }
          url
        }
      }
    }
  `)

  const items = data.allKontentItemNavigationItem.nodes.map(item => (
    <li key={item.url}>
      <a href={item.url}>{item.elements.title.value}</a>
    </li>
  ))

  return <ul>{items}</ul>
}

export default Menu
