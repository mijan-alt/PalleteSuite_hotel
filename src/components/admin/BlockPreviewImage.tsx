// src/components/admin/BlockPreviewImage.tsx
'use client';

import Image from 'next/image';
import React from 'react';

type Props = {
  /** filename inside public/admin/block-previews/ (without extension) */
  name: string;
  /** optional caption shown under the image */
  caption?: string;
};

export const BlockPreviewImage: React.FC<Props> = ({ name, caption }) => {
  return (
    <div className="my-6 rounded-lg border border-gray-200 bg-gray-50 p-4">
      <Image
        src={`/admin/block-previews/${name}.png`}
        alt={`Preview of ${name} block`}
        width={1200}
        height={600}
        className="w-full rounded-md shadow-sm"
        unoptimized // static file, no need for next/image optimisation
      />
      {caption && (
        <p className="mt-2 text-center text-sm italic text-gray-600">{caption}</p>
      )}
    </div>
  );
};