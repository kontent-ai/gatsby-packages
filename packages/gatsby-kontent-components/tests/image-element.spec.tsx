/* eslint-disable @typescript-eslint/camelcase */
import React from "react";
import { getGatsbyImageData } from "../src/image-element/get-gatsby-image-data";
import TestRenderer from 'react-test-renderer';
import { ImageElement } from '../src';

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

describe('<ImageElement />', () => {
  it('generates the correct image src', () => {
    const data = getGatsbyImageData({ image: images[0] });
    expect(data.images.fallback.src).toEqual(
      'https://assets-us-01.kc-usercontent.com:443/0fe3ab32-97a8-005d-6928-eda983ea70a5/44299668-b37b-4224-a115-1fd66f7d7b36/Yprofile.jpg?w=500&h=500&auto=format&fit=crop',
    );
  });
  it('generates the srcset', () => {
    const data = getGatsbyImageData({ image: images[0] });
    expect(data.images.fallback.srcSet).toMatchInlineSnapshot(`
        "https://assets-us-01.kc-usercontent.com:443/0fe3ab32-97a8-005d-6928-eda983ea70a5/44299668-b37b-4224-a115-1fd66f7d7b36/Yprofile.jpg?w=320&h=320&auto=format&fit=crop 320w,
        https://assets-us-01.kc-usercontent.com:443/0fe3ab32-97a8-005d-6928-eda983ea70a5/44299668-b37b-4224-a115-1fd66f7d7b36/Yprofile.jpg?w=500&h=500&auto=format&fit=crop 500w"
      `);
  });

  it('generates the correct dimensions', () => {
    const data = getGatsbyImageData({
      image: images[0],
      width: 200,
      aspectRatio: 2 / 1,
    });
    expect(data.width).toEqual(200);
    expect(data.height).toEqual(100);
  });

  it('renders the correct image', () => {
    const testRenderer = TestRenderer.create(
      <ImageElement image={images[0]} />,
    );
    expect(
      testRenderer.root.findByProps({ 'data-main-image': '' }).props.fallback,
    ).toMatchSnapshot();
  });

  it('renders the correct image with correct options', () => {
    const testRenderer = TestRenderer.create(
      <ImageElement
        image={images[0]}
        options={{
          fit: 'clip',
          quality: 77,
          lossless: false,
        }} />,
    );
    expect(
      testRenderer.root.findByProps({ 'data-main-image': '' }).props.fallback,
    ).toMatchSnapshot();
  });
});