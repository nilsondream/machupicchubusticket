"use client"

import { useState } from "react"
import { ArrowLeft, ArrowRight, Image, X } from "lucide-react";
import { Button } from "@/components/ui/button";

const images = [
  "https://d30oa1noalw1jv.cloudfront.net/images/IQLerwp2GRuvZwrhY4rw0akiWOz7FX-bus-machu-picchu/bus-machu-picchu.jpg",
  "https://d30oa1noalw1jv.cloudfront.net/images/k2PrcgGuW8bnaTNQv8NvMXhCwG72jG-bus-machu-picchu/bus-machu-picchu.jpg",
  "https://d30oa1noalw1jv.cloudfront.net/images/oU57wfnrQ1tEB7F30ce0qU8cpWbP0i-bus-machu-picchu/bus-machu-picchu.jpg",
  "https://d30oa1noalw1jv.cloudfront.net/images/LMCuDkBrOFfepUJlHtImCeXg9f6I94-bus-machu-picchu/bus-machu-picchu.jpg",
  "https://d30oa1noalw1jv.cloudfront.net/images/PEuq6pDmVxGXldWV0fDFwkB0zW7xB6-bus-machu-picchu/bus-machu-picchu.jpg",
  "https://d30oa1noalw1jv.cloudfront.net/images/v5omXGtcvvEXwlhLBpQVPiNWTvhOwx-bus-machu-picchu/bus-machu-picchu.jpg",
]

const galleryData = [
  { image: images[0], className: "col-span-3 row-span-2 max-md:col-span-4 max-md:row-span-3" },
  { image: images[1], className: "col-start-4 max-md:row-start-4 max-md:col-start-1" },
  { image: images[2], className: "col-start-5 max-md:row-start-4 max-md:col-start-2" },
  { image: images[3], className: "col-start-4 row-start-2 max-md:row-start-4 max-md:col-start-3" },
  { image: images[4], className: "col-start-5 row-start-2 max-md:row-start-4 max-md:col-start-4" },
];

const Gallery = () => {
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);

  const handleNext = () => {
    if (selectedIndex === null) return;
    setSelectedIndex((prev) => (prev! + 1) % galleryData.length);
  };

  const handlePrev = () => {
    if (selectedIndex === null) return;
    setSelectedIndex((prev) => (prev! - 1 + galleryData.length) % galleryData.length);
  };

  const openLightbox = () => setSelectedIndex(0);
  const closeLightbox = () => setSelectedIndex(null);

  return (
    <>
      <div className="grid grid-cols-5 grid-rows-2 gap-3 max-md:gap-2 max-md:grid-cols-4 max-md:grid-rows-4 relative h-80 max-md:h-auto">
        {galleryData.map((item, index) => (
          <div
            key={index}
            className={`${item.className} overflow-hidden rounded-xl max-md:rounded-lg cursor-pointer bg-muted`}
            onClick={() => setSelectedIndex(index)}
          >
            <img
              src={item.image}
              alt="MP"
              className="object-cover w-full h-full hover:brightness-75 duration-300"
            />
          </div>
        ))}
        <Button variant={"outline"} onClick={openLightbox} className="absolute bottom-0 right-0 m-3">
          <Image />
          Ver Galería
        </Button>
      </div>

      {selectedIndex !== null && (
        <div className="fixed w-full h-full top-0 left-0 bg-black/50 backdrop-blur-md flex items-center justify-center z-50 max-md:px-5">
          <img
            src={images[selectedIndex]}
            alt="Full view"
            className="max-w-5xl max-h-[80vh] max-md:w-full rounded-3xl shadow-lg transition-all select-none"
          />

          <Button
            variant={"secondary"}
            size={"icon"}
            onClick={closeLightbox}
            className="absolute top-5 right-5 rounded-full"
          >
            <X size={20} />
          </Button>

          <Button
            variant={"secondary"}
            size={"icon"}
            onClick={handlePrev}
            className="absolute left-5 max-md:left-1 max-md:scale-90 rounded-full"
          >
            <ArrowLeft size={20} />
          </Button>

          <Button
            variant={"secondary"}
            size={"icon"}
            onClick={handleNext}
            className="absolute right-5 max-md:right-1 max-md:scale-90 rounded-full"
          >
            <ArrowRight size={20} />
          </Button>
        </div>
      )}
    </>
  )
}

export default Gallery