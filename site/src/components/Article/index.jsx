import React from 'react'
import { Link } from 'gatsby'
import moment from 'moment'
import './style.scss'

class Article extends React.Component {
  render() {
    const title = this.props.data.elements.title.value
    const date = this.props.data.elements.date.value
    const category = this.props.data.elements.category.value[0].elements.title.value
    const categorySlug = this.props.data.elements.category.value[0].elements.slug.value
    const description = this.props.data.elements.description.value
    const slug = `/articles/${this.props.data.elements.slug.value}`

    return (
      <div className="article">
        <div className="article__meta">
          <time
            className="article__meta-time"
            dateTime={moment(date).format('MMMM D, YYYY')}
          >
            {moment(date).format('MMMM YYYY')}
          </time>
          <span className="article__meta-divider" />
          <span className="article__meta-category" key={categorySlug}>
            <Link to={`/categories/${categorySlug}/`} className="article__meta-category-link">
              {category}
            </Link>
          </span>
        </div>
        <h2 className="article__title">
          <Link className="article__title-link" to={slug}>
            {title}
          </Link>
        </h2>
        <p className="article__description">{description}</p>
        <Link className="article__readmore" to={slug}>
          Read
        </Link>
      </div>
    )
  }
}

export default Article
