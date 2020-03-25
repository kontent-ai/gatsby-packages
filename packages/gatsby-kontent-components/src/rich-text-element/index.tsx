/* eslint-disable @typescript-eslint/no-explicit-any */
import React from 'react';
import parseHTML, { DomElement } from 'html-react-parser';

interface Props {
  value: string;
  linkedItems?: any[];
  resolveLinkedItem?: Function;
  images?: any[];
  resolveImage?: Function;
  links?: any[];
  resolveLink?: Function;
}

const isLinkedItem = (domNode: DomElement): boolean =>
  domNode.name === 'object' && domNode.attribs?.type === 'application/kenticocloud';

const isImage = (domNode: DomElement): boolean =>
  domNode.name === 'figure' && typeof domNode.attribs?.['data-image-id'] !== 'undefined'

const isLink = (domNode: DomElement): boolean =>
  domNode.name === 'a' && typeof domNode.attribs?.['data-item-id'] !== 'undefined'

const replaceNode = (
  domNode: DomElement,
  linkedItems: any[] | undefined,
  resolveLinkedItem: Function | undefined,
  images: any[] | undefined,
  resolveImage: Function | undefined,
  links: any[] | undefined,
  resolveLink: Function | undefined): void => {
  if (resolveLinkedItem && linkedItems) {
    if (isLinkedItem(domNode)) {
      const codeName = domNode.attribs?.["data-codename"];
      const linkedItem = linkedItems.find(item => item.system.codename === codeName);
      return resolveLinkedItem(linkedItem);
    }
  }

  if (resolveImage && images) {
    if (isImage(domNode)) {
      const imageId = domNode.attribs?.['data-image-id'];
      const image = images.find(image => image.image_id === imageId);
      return resolveImage(image);
    }
  }

  if (resolveLink && links) {
    if (isLink(domNode)) {
      const linkId = domNode.attribs?.['data-item-id'];
      const link = links.find(links => links.link_id === linkId);
      return resolveLink(link, domNode);
    }
  }
};

const RichTextElement = ({ value, linkedItems, resolveLinkedItem, images, resolveImage, links, resolveLink }: Props): string
  | React.DetailedReactHTMLElement<{}, HTMLElement>
  | Array<React.DetailedReactHTMLElement<{}, HTMLElement>> => (
    parseHTML(value, {
      replace: (domNode: DomElement) => replaceNode(domNode, linkedItems, resolveLinkedItem, images, resolveImage, links, resolveLink),
    })
  );

export { RichTextElement };

