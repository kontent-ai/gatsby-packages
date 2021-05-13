/* eslint-disable @typescript-eslint/camelcase */
import React from 'react';
import TestRenderer from 'react-test-renderer';
import { RichTextElement } from '../src';

const sampleComplexValue =
  '<p>This is Ondřej Chrastina - Developer Advocate with <a href="https://kontent.ai" data-new-window="true" target="_blank" rel="noopener noreferrer">Kentico Kontent</a>.</p>\n<figure data-asset-id="d32b8ad5-0cf4-47a8-8b53-ed4a1e80dc88" data-image-id="d32b8ad5-0cf4-47a8-8b53-ed4a1e80dc88"><img src="https://assets-us-01.kc-usercontent.com:443/0fe3ab32-97a8-005d-6928-eda983ea70a5/44299668-b37b-4224-a115-1fd66f7d7b36/Yprofile.jpg" data-asset-id="d32b8ad5-0cf4-47a8-8b53-ed4a1e80dc88" data-image-id="d32b8ad5-0cf4-47a8-8b53-ed4a1e80dc88" alt=""></figure>\n<p>He likes to do web sites. This is his latest project:</p>\n<object type="application/kenticocloud" data-type="item" data-rel="link" data-codename="ondrej_chrastina_tech"></object>\n<p><br>\nHe also likes OSS. This is his latest repository:</p>\n<object type="application/kenticocloud" data-type="item" data-rel="link" data-codename="simply007_kontent_gatsby_benchmark"></object>\n<p><br>\nOn some projects, he was cooperating with <a data-item-id="2b805947-7ca5-4e6a-baa5-734a91f3cfa2" href="">John Doe</a>.</p>\n<p>You could take a look at their&nbsp;<a href="https://google.com" title="sample link">latest project</a>.</p>\n<table><tbody>\n  <tr><td>col1</td><td>col2</td></tr>\n  <tr><td>data1</td><td>data2</td></tr>\n  <tr><td>data3</td><td>data4</td></tr>\n</tbody></table>';
const links = [
  {
    url_slug: 'john-doe',
    type: 'person',
    link_id: '2b805947-7ca5-4e6a-baa5-734a91f3cfa2',
    codename: 'john_doe',
  },
];
const images = [
  {
    description: null,
    height: 500,
    image_id: 'd32b8ad5-0cf4-47a8-8b53-ed4a1e80dc88',
    url:
      'https://assets-us-01.kc-usercontent.com:443/0fe3ab32-97a8-005d-6928-eda983ea70a5/44299668-b37b-4224-a115-1fd66f7d7b36/Yprofile.jpg',
    width: 500,
  },
];
const linkedItems = [
  {
    __typename: 'kontent_item_website',
    system: {
      codename: 'ondrej_chrastina_tech',
    },
    elements: {
      name: {
        value: 'ondrej.chrastina.tech',
      },
      slug: {
        value: 'ondrej-chrastina-tech',
      },
      summary: {
        value: "Ondřej Chrastina's personal site",
      },
      url: {
        value: 'https://ondrej.chrastina.tech',
      },
      source_repository: {
        value: [
          {
            __typename: 'kontent_item_repository',
            elements: {
              slug: {
                value: 'simply007-simply007-github-io',
              },
            },
          },
        ],
      },
    },
  },
  {
    __typename: 'kontent_item_repository',
    system: {
      codename: 'simply007_kontent_gatsby_benchmark',
    },
    elements: {
      name: {
        value: 'Simply007/kontent-gatsby-benchmark',
      },
      slug: {
        value: 'simply007-kontent-gatsby-benchmark',
      },
      summary: {
        value:
          'Example site for Kontent as a source for "Will It Build". Should/Will be generalized into e.g. a theme.',
      },
      url: {
        value: 'https://github.com/Simply007/kontent-gatsby-benchmark',
      },
    },
  },
];

describe('<RichTextElement/>', () => {
  it('Empty rich-text value - render properly', () => {
    const testRenderer = TestRenderer.create(
      <RichTextElement value="<p><br></p>" />,
    );
    expect(testRenderer.toJSON()).toMatchSnapshot();
  });

  it('Complex rich-text value - render properly no resolution', () => {
    const testRenderer = TestRenderer.create(
      <RichTextElement value={sampleComplexValue} />,
    );
    expect(testRenderer.toJSON()).toMatchSnapshot();
  });

  it('Resolve images', () => {
    const testRenderer = TestRenderer.create(
      <RichTextElement
        value={sampleComplexValue}
        images={images}
        resolveImage={(image): JSX.Element => (
          <img
            src={image.url}
            alt={image.description ? image.description : image.name}
            width="200"
          />
        )}
      />,
    );
    expect(testRenderer.toJSON()).toMatchSnapshot();
  });

  it('Resolve links', () => {
    const complexValueRenderer = TestRenderer.create(
      <RichTextElement
        value={sampleComplexValue}
        links={links}
        resolveLink={(link, domNode): JSX.Element => {
          return (
            // normally a Link component from gatsby package would be used
            <a href={`/${link.type}/${link.url_slug}`}>
              {domNode.children[0].data}
            </a>
          );
        }}
      />,
    );
    expect(complexValueRenderer.toJSON()).toMatchSnapshot();


    const simpleValueRenderer = TestRenderer.create(
      <RichTextElement
        value={'<p>This is the page text.</p><ul><li><a data-item-id="1abb6bf1-1e29-4deb-bb0c-b5928ffb0cc9" href="">Test link</a></li></ul>'}
        links={[
          {
            "url_slug": "test-nico",
            "type": "page",
            "link_id": "1abb6bf1-1e29-4deb-bb0c-b5928ffb0cc9",
            "codename": "test_page_nico"
          }
        ]}
        resolveLink={(link, domNode): JSX.Element => {
          return (
            // normally a Link component from gatsby package would be used
            <a href={`/${link.type}/${link.url_slug}`}>
              {domNode.children[0].data}
            </a>
          );
        }}
      />,
    );
    expect(simpleValueRenderer.toJSON()).toMatchSnapshot();
  });

  it('Resolve linked items', () => {
    const testRenderer = TestRenderer.create(
      <RichTextElement
        value={sampleComplexValue}
        linkedItems={linkedItems}
        resolveLinkedItem={(linkedItem): JSX.Element => {
          return <pre>{JSON.stringify(linkedItem, undefined, 2)}</pre>;
        }}
      />,
    );
    expect(testRenderer.toJSON()).toMatchSnapshot();
  });

  it('Resolve geneal node - wrap table element', () => {
    const testRenderer = TestRenderer.create(
      <RichTextElement
        value={sampleComplexValue}
        resolveDomNode={(domNode, domToReact): JSX.Element => {
          if (domNode.name === 'table') {
            return <div className="table-wrapper">{domToReact([domNode])}</div>;
          }
        }}
      />,
    );
    expect(testRenderer.toJSON()).toMatchSnapshot();
  });
});
