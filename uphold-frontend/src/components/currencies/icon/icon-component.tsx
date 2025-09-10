import React from 'react';

interface IconProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  src: string;
  alt?: string;
  size?: number;
}

export const IconComponent: React.FC<IconProps> = ({ src, alt = '', size = 24, ...rest }) => {
  return <img src={src} alt={alt} width={size} height={size} {...rest} />;
};
