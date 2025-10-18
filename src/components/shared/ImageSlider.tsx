'use client'

import React, { useState, useEffect, useCallback } from 'react'
import useEmblaCarousel from 'embla-carousel-react'
import Autoplay from 'embla-carousel-autoplay'
import Image from 'next/image'

type PropType = {
  images: string[]
}

export const ImageSlider: React.FC<PropType> = ({ images }) => {
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true }, [Autoplay()])

  if (images.length === 0) {
    return (
      <div className="relative h-[500px] w-full bg-gray-200">
        <Image src="/images/placeholder.jpg" alt="No image available" layout="fill" objectFit="cover" />
      </div>
    );
  }

  return (
    <div className="overflow-hidden relative h-[500px]" ref={emblaRef}>
      <div className="flex h-full">
        {images.map((src, index) => (
          <div className="flex-[0_0_100%] relative" key={index}>
            <Image src={src} alt={`Slide ${index + 1}`} layout="fill" objectFit="cover" className="brightness-75"/>
          </div>
        ))}
      </div>
    </div>
  )
}