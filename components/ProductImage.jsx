import { useState } from 'react';

export function ProductImage({ src, alt, className }) {
  const placeholder = '/products/placeholder.jpg';

  const [imgSrc, setImgSrc] = useState(src || placeholder);

  console.log('img', imgSrc);

  return (
    <img
      src={imgSrc}
      alt={alt}
      className={className}
      width={300}
      height={200}
      onError={() => {
        setImgSrc(placeholder);
      }}
    />
  );
}
