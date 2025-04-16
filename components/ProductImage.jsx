import { useState } from 'react';

export function ProductImage({ src, alt, className }) {
  const placeholder = `https://via.placeholder.com/300x200?text=Imagem+Indisponível`;
  const generated = `https://source.unsplash.com/300x200/?${encodeURIComponent(alt)}`;

  const [imgSrc, setImgSrc] = useState(src || generated);

  return (
    <img
      src={imgSrc}
      alt={alt}
      className={className}
      width={300}
      height={200}
      onError={() => {
        if (imgSrc !== placeholder) {
          setImgSrc(placeholder);
        }
      }}
    />
  );
}
