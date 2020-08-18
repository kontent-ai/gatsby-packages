import React from 'react';
import { Link } from 'gatsby';
import { resolveUrl } from '../utils/resolvers';

const Repository = ({ item }) => {
  return (
    <div style={{
      border: 'silver 1px dashed',
      display: 'inline-block',
      padding: '1em',
      maxWidth: '400px'
    }}>
      <h3>
        <Link to={resolveUrl(item.__typename, item.elements.slug.value)}
        >Repository: {item.elements.name.value}
        </Link>
      </h3>
      <p>{item.elements.summary.value}</p>
      <a
        href={item.elements.url.value}
        style={{
          padding: '.5em',
          float: 'right',
          border: '1px solid silver'
        }}>
        Enter repo
      </a>
    </div>
  );
};

export default Repository;