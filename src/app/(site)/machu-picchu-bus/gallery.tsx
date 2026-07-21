"use client"

import { useState } from "react"
import { Carousel, CarouselContent, CarouselItem, type CarouselApi } from "@/components/ui/carousel"
import { cn } from "@/lib/utils"

const images = [
  {
    src: "https://images.unsplash.com/photo-1587595431973-160d0d94add1?q=80&w=1200&auto=format&fit=crop",
    alt: "Machu Picchu bus on mountain road",
  },
  {
    src: "https://images.unsplash.com/photo-1723134084358-20a2dc177ff1?q=80&w=1200&auto=format&fit=crop",
    alt: "Panoramic view of Machu Picchu",
  },
  {
    src: "https://images.unsplash.com/photo-1526392060635-9d601c43719e?q=80&w=1200&auto=format&fit=crop",
    alt: "Aguas Calientes town",
  },
  {
    src: "https://images.unsplash.com/photo-1624571430789-0caff6e15f96?q=80&w=1200&auto=format&fit=crop",
    alt: "Bus station Aguas Calientes",
  },
  {
    src: "https://images.unsplash.com/photo-1580619305218-8423a7ef79b4?q=80&w=1200&auto=format&fit=crop",
    alt: "Cloud forest road to Machu Picchu",
  },
]

const Gallery = () => {
  const [api, setApi] = useState<CarouselApi>()
  const [current, setCurrent] = useState(0)
  const [count, setCount] = useState(0)

  const onSelect = (api: CarouselApi) => {
    if (!api) return
    setCurrent(api.selectedScrollSnap())
    setCount(api.scrollSnapList().length)
  }

  return (
    <section className="py-8">
      <Carousel setApi={(api) => { setApi(api); if (api) { setCount(api.scrollSnapList().length); api.on("select", () => onSelect(api)) } }}>
        <CarouselContent>
          {images.map((image, index) => (
            <CarouselItem key={index}>
              <div className="aspect-21/9 max-md:aspect-4/3 rounded-2xl overflow-hidden">
                <img
                  src={image.src}
                  alt={image.alt}
                  className="w-full h-full object-cover"
                />
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
        <div className="flex justify-center gap-2 mt-4">
          {Array.from({ length: count }).map((_, index) => (
            <button
              key={index}
              onClick={() => api?.scrollTo(index)}
              className={cn(
                "rounded-full transition-all duration-300",
                current === index
                  ? "h-2 w-6 bg-orange-500"
                  : "h-2 w-2 bg-border hover:bg-muted-foreground/50"
              )}
              aria-label={`Go to image ${index + 1}`}
            />
          ))}
        </div>
      </Carousel>
    </section>
  )
}

export default Gallery
