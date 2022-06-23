import {
  IGatsbyImageData,
  getImageData,
  Layout,
  IGetImageDataArgs,
} from 'gatsby-plugin-image';
import { ImageItem } from '.';

export interface ImageOptions {
  fit?: 'crop' | 'clip' | 'scale';
  quality?: number;
  lossless?: boolean;
}

export interface GetGatsbyImageDataProps {
  image: ImageItem;
  width?: number;
  height?: number;
  layout?: Layout;
  backgroundColor?: string;
  sizes?: string;
  aspectRatio?: number;
  options?: ImageOptions;
}

export function getGatsbyImageData({
  image,
  backgroundColor,
  options = {},
  layout = `constrained`,
  ...props
}: GetGatsbyImageDataProps): IGatsbyImageData {
  const urlBuilder: IGetImageDataArgs<ImageOptions>['urlBuilder'] = ({
    baseUrl,
    width,
    height,
    options: { quality, fit = 'crop', lossless },
  }): string => {
    const props = [
      ['w', width],
      ['h', height],
      ['auto', 'format'],
      ['bg', backgroundColor],
      ['q', quality],
      ['lossless', lossless],
      ['fit', fit],
    ];
    const query = props
      .filter(([, val]) => typeof val !== 'undefined')
      .map(([key, val]) => `${key}=${encodeURIComponent(val)}`)
      .join('&');

    return `${baseUrl}?${query}`;
  };

  return getImageData({
    baseUrl: image.url,
    sourceWidth: image.width,
    sourceHeight: image.height,
    layout,
    urlBuilder,
    backgroundColor,
    pluginName: 'gatsby-kontent-components',
    options,
    ...props,
  });
}
