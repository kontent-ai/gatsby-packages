import React from 'react'
import { Link, graphql } from 'gatsby'
import Helmet from 'react-helmet'
import Layout from '../components/Layout'
import Sidebar from '../components/Sidebar'

class TagsRoute extends React.Component {
  render() {
    const tagsData = this.props
    const title = tagsData.data.kontentItemSiteMetadata.elements.title.value
    const tags = tagsData.data.allKontentItemTag.nodes

    return (
      <Layout>
        <div>
          <Helmet title={`All Tags - ${title}`} />
          <Sidebar />
          <div className="content">
            <div className="content__inner">
              <div className="page">
                <h1 className="page__title">Tags</h1>
                <div className="page__body">
                  <div className="tags">
                    <ul className="tags__list">
                      {tags.map(tag => (
                        <li key={tag.elements.title.value} className="tags__list-item">
                          <Link
                            to={`/tags/${tag.elements.slug.value}/`}
                            className="tags__list-item-link"
                          >
                            {tag.elements.title.value} (9)
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Layout>
    )
  }
}

export default TagsRoute

export const pageQuery = graphql`
  query TagsQuery {
    kontentItemSiteMetadata(system: {codename: {eq: "site_metadata"}}) {
      elements {
        title {
          value
        }
      }
    }
    allKontentItemTag {
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
