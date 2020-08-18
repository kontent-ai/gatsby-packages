import React from 'react';
import { Link } from 'gatsby';
import { resolveUrl } from '../utils/resolvers';

const Website = ({ item }) => {
  return (
    <div style={{
      border: 'silver 1px solid',
      display: 'inline-block',
      padding: '1em'
    }}>
      <h3>
        <Link to={resolveUrl(item.__typename, item.elements.slug.value)}
        >Website: {item.elements.name.value}
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
        Enter website
      </a>
    </div>
  );
};

export default Website;