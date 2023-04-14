import React from 'react';
import { Link } from "gatsby"
import { toPlainText, PortableText } from '@portabletext/react';
import { nodeParse, resolveTable, transformToPortableText } from '@pokornyd/kontent-ai-rich-text-parser';
import { resolveUrl } from "../utils/resolvers"
import Website from '../components/website'
import Repository from '../components/repository'

const PortableRichText = ({ value, images, links, linkedItems }) => {

  const portableTextComponents = {
    types: {
      image: ({ value }) => {
        // const image = images.find(image => image.image_id === value.asset._ref)
        const alt = value.asset.description || value.asset.url.split("/").pop();
        return (
          <img
            src={`${value.asset.url}?w=200`}
            alt={alt}
            width="200"
          />
        );
      },
      component: (block) => {
        const linkedItem = linkedItems.find(item => item.system.codename === block.value.component._ref);

        // In case of linked item is not a part fo the response
        if(!linkedItem) {
          return <strong style={{color: "red"}}>⚠ Linked item is no longer in the response. ⚠</strong>
        }

        switch (linkedItem.__typename) {
          case 'kontent_item_website':
            return (
              <Website item={linkedItem} />
            );
          case 'kontent_item_repository':
            return (
              <Repository item={linkedItem} />
            );
          default:
            return <div>Content item not supported</div>;
        }
      },
      // TODO add table to the showcase
      table: ({ value }) => {
        const tableString = resolveTable(value, toPlainText);
        return <>{tableString}</>;
      }
    },
    marks: {
      link: ({ value, children }) => {
        const target = (value?.href || '').startsWith('http') ? '_blank' : undefined
        return (
          <a href={value?.href} target={target} rel={value?.rel} title={value?.title} data-new-window={value['data-new-window']}>
            {children}
          </a>
        )
      },
      internalLink: ({ value, children }) => {
        const link = links.find(link => link.link_id === value.reference._ref)
        // i.e. person -> kontent_item_person
        const linkType = `kontent_item_${link.type}`;
        // TODO How to handle more children? Add to showcase
        return (
          <Link to={resolveUrl(linkType, link.url_slug)}>
            {children[0]}
          </Link>
        );
      }
    }
  }

  // TODO add automatic distinguish
  const parsedTree = nodeParse(value);
  const portableText = transformToPortableText(parsedTree);


  return (
    <div>
      <PortableText value={portableText} components={portableTextComponents} />
    </div>
  );
}

export default PortableRichText;
