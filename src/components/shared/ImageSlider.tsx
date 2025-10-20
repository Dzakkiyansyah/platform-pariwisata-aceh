'use client'

import useEmblaCarousel from 'embla-carousel-react'
import Autoplay from 'embla-carousel-autoplay'
import Image from 'next/image'

type PropType = {
  images: string[]
}

export const ImageSlider: React.FC<PropType> = ({ images }) => {
  const [emblaRef] = useEmblaCarousel({ loop: true }, [Autoplay({ delay: 3000 })])

  if (images.length === 0) {
    return (
      <div className="relative h-[500px] w-full bg-gray-200">
        <Image
          src="/images/placeholder.jpg"
          alt="No image available"
          fill
          className="object-cover"
        />
      </div>
    )
  }

  return (
    <div className="overflow-hidden relative h-[500px]" ref={emblaRef}>
      <div className="flex h-full">
        {images.map((src, index) => (
          <div className="flex-[0_0_100%] relative" key={index}>
            <Image
              src={src}
              alt={`Slide ${index + 1}`}
              fill
              className="object-cover brightness-75"
            />
          </div>
        ))}
      </div>
    </div>
  )
}
