import React from "react"
import { useStaticQuery, graphql, Link } from "gatsby"

const ComplexMenu = () => {
  const data = useStaticQuery(graphql`
    {
      kontentItemNavigationItem(
        system: { codename: { eq: "website_root_navigation" } }
      ) {
        url
        elements {
          title {
            value
          }
          subitems {
            value {
              ... on kontent_item_navigation_item {
                url
                elements {
                  title {
                    value
                  }
                  subitems {
                    value {
                      ... on kontent_item_navigation_item {
                        url
                        elements {
                          title {
                            value
                          }
                          subitems {
                            value {
                              ... on kontent_item_navigation_item {
                                url
                                elements {
                                  title {
                                    value
                                  }
                                }
                              }
                            }
                          }
                        }
                      }
                    }
                  }
                }
              }
            }
          }
        }
      }
    }
  `)

  const rootMenu = data.kontentItemNavigationItem

  const constructMenu = menuItem => {
    const url = menuItem.url
    const title = menuItem.elements.title.value
    const itemHtml = (
      <li key={url}>
        <Link to={url}>{title}</Link>
      </li>
    )

    if (!menuItem.elements.subitems) {
      return itemHtml
    } else {
      const subMenu = menuItem.elements.subitems.value.map(item =>
        constructMenu(item)
      )
      return [itemHtml, <ul key={`submenu-${url}`}>{subMenu}</ul>]
    }
  }

  return (
    <nav>
      <ul>{constructMenu(rootMenu)}</ul>
    </nav>
  )
}

export default ComplexMenu
