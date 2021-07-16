import React from 'react';
import { GatsbyImageProps, GatsbyImage } from 'gatsby-plugin-image';
import {
  getGatsbyImageData,
  GetGatsbyImageDataProps,
} from './get-gatsby-image-data';

export interface ImageItem {
  image_id: string;
  url: string;
  description?: string;
  name?: string;
  height: number;
  width: number;
  type?: string;
}

export interface ImageElementProps
  extends GetGatsbyImageDataProps,
    Omit<GatsbyImageProps, 'image' | 'alt'> {
  alt?: string;
}

export const ImageElement: React.FC<ImageElementProps> = React.memo(function ImageElement({
  image,
  width,
  height,
  layout,
  backgroundColor,
  sizes,
  aspectRatio,
  options,
  alt,
  ...props
}): JSX.Element {
  const imageData = getGatsbyImageData({
    image,
    width,
    height,
    layout,
    backgroundColor,
    sizes,
    aspectRatio,
    options,
  });
  alt = alt ?? image.description ?? '';
  return <GatsbyImage image={imageData} {...props} alt={alt} />;
});
