/* eslint-disable @typescript-eslint/no-explicit-any */
import React from 'react';
import parseHTML, { DomElement, domToReact } from 'html-react-parser';
import { ImageItem } from '../image-element';

const IMAGE_ID_ATTRIBUTE_IDENTIFIER = 'data-image-id';
const LINKED_ITEM_ID_ATTRIBUTE_IDENTIFIER = 'data-item-id';

interface Props {
  value: string;
  linkedItems?: any[];
  resolveLinkedItem?: Function;
  images?: ImageItem[];
  resolveImage?: ((image?: ImageItem) => JSX.Element) | undefined;
  links?: any[];
  resolveLink?: Function;
  resolveDomNode?: Function;
}

const isLinkedItem = (domNode: DomElement): boolean =>
  domNode.name === 'object' &&
  domNode.attribs?.type === 'application/kenticocloud';

const isImage = (domNode: DomElement): boolean =>
  domNode.name === 'figure' &&
  typeof domNode.attribs?.[IMAGE_ID_ATTRIBUTE_IDENTIFIER] !== 'undefined';

const isLink = (domNode: DomElement): boolean =>
  domNode.name === 'a' &&
  typeof domNode.attribs?.[LINKED_ITEM_ID_ATTRIBUTE_IDENTIFIER] !== 'undefined';

const replaceNode = (
  domNode: DomElement,
  linkedItems: any[] | undefined,
  resolveLinkedItem: Function | undefined,
  images: any[] | undefined,
  resolveImage: ((image?: ImageItem) => JSX.Element) | undefined,
  links: any[] | undefined,
  resolveLink: Function | undefined,
  resolveDomNode: Function | undefined,
): JSX.Element | void => {
  if (resolveLinkedItem && linkedItems) {
    if (isLinkedItem(domNode)) {
      const codeName = domNode.attribs?.['data-codename'];
      const linkedItem = linkedItems.find(
        item => item.system.codename === codeName,
      );
      return resolveLinkedItem(linkedItem);
    }
  }

  if (resolveImage && images) {
    if (isImage(domNode)) {
      const imageId = domNode.attribs?.[IMAGE_ID_ATTRIBUTE_IDENTIFIER];
      const image = images.find(image => image.image_id === imageId);
      return resolveImage(image);
    }
  }

  if (resolveLink && links) {
    if (isLink(domNode)) {
      const linkId = domNode.attribs?.[LINKED_ITEM_ID_ATTRIBUTE_IDENTIFIER];
      const link = links.find(links => links.link_id === linkId);
      return resolveLink(link, domNode);
    }
  }

  if (resolveDomNode) {
    return resolveDomNode(domNode, domToReact);
  }
};

const RichTextElement = ({
  value,
  linkedItems,
  resolveLinkedItem,
  images,
  resolveImage,
  links,
  resolveLink,
  resolveDomNode,
}: Props): JSX.Element => {
  const result = parseHTML(value, {
    replace: (domNode: DomElement) =>
      replaceNode(
        domNode,
        linkedItems,
        resolveLinkedItem,
        images,
        resolveImage,
        links,
        resolveLink,
        resolveDomNode,
      ),
  });

  if (result as JSX.Element[]) {
    return <>{result}</>;
  }

  return result as JSX.Element;
};

export { RichTextElement };
