import React from 'react'
import get from 'lodash/get'
import { useStaticQuery, Link, graphql } from 'gatsby'
import Menu from '../Menu'
import Links from '../Links'
import './style.scss'

const sidebar = () => {
  const data = useStaticQuery(graphql`
  query SidebarQuery {
    kontentItemSiteMetadata(system: {codename: {eq: "site_metadata"}}) {
      elements {
        copyright {
          value
        }
        subtitle {
          value
        }
        title {
          value
        }
      }
    }
    kontentItemMenu(system: {codename: {eq: "navigation_menu"}}) {
      elements {
        menu_items {
          value {
            ... on kontent_item_menu_item {
              id
              elements {
                label {
                  value
                }
                path {
                  value
                }
              }
            }
          }
        }
      }
    }
    kontentItemAuthor(system: {codename: {eq: "author"}}) {
      elements {
        bio {
          value
        }
        email {
          value
        }
        github {
          value
        }
        name {
          value
        }
        rss {
          value
        }
        telegram {
          value
        }
        twitter {
          value
        }
        vk {
          value
        }
        avatar_image {
          value {
            url
          }
        }
      }
    }
  }
`
  )

  const author = data.kontentItemAuthor
  const menu = data.kontentItemMenu
  const copyright = data.kontentItemSiteMetadata.elements.copyright.value
  const isHomePage = get(data, 'pathname', '/') === '/'
  const profilePic = data.kontentItemAuthor.elements.avatar_image.value[0].url

  return (
    <div className="sidebar">
      <div className="sidebar__inner">
        <div className="sidebar__author">
          <div>
            <Link to="/">
              <img
                src={profilePic}
                className="sidebar__author-photo"
                width="75"
                height="75"
                alt={author.name}
              />
            </Link>
            {isHomePage ? (
              <h1 className="sidebar__author-title">
                <Link className="sidebar__author-title-link" to="/">
                  {author.name}
                </Link>
              </h1>
            ) : (
              <h2 className="sidebar__author-title">
                <Link className="sidebar__author-title-link" to="/">
                  {author.name}
                </Link>
              </h2>
            )}
            <p className="sidebar__author-subtitle">
              {author.elements.bio.value}
            </p>
          </div>
        </div>
        <div>
          <Menu data={menu} />
          <Links data={author} />
          <p className="sidebar__copyright">{copyright}</p>
        </div>
      </div>
    </div>
  )
}

export default sidebar
