import { useState } from "react";
import Link from "next/link";

interface Props {
  title?: string;
  tours: { name: string; path: string; duration: string; best?: string; img: string; }[];
  text?: string;
}

const MegaMenu = ({ tours, title, text }: Props) => {
  const [overlay, setOverlay] = useState(true);
  const numberTours = tours.length;

  return (
    <div className={`absolute top-14 left-0 w-full ${overlay ? "min-h-screen" : null} max-md:hidden max-md:invisible opacity-0 invisible group-hover:opacity-100 group-hover:visible`}>
      <div className="pt-7 pb-16 bg-background">
        <div className="max-w-6xl mx-auto max-2xl:max-w-6xl grid grid-cols-3 gap-5 items-start max-xl:px-16 max-md:px-5 max-xl:w-full">
          <div>
            <p className="font-bold text-lg">{title}</p>
            <span className="text-sm text-muted-foreground w-3/4 mt-2">{text}</span>
          </div>
          <div className={`grid grid-cols-2 ${(numberTours > 3) ? "grid-rows-3" : "grid-rows-2"} grid-flow-col col-span-2 gap-2 w-full`}>
            {tours.map((tour, index) => (
              <Link key={index} href={tour.path} className="flex gap-2.5 items-center justify-start p-2 rounded-xl hover:bg-muted">
                <div className="w-12 h-12 rounded-lg overflow-hidden bg-muted">
                  <img
                    src={tour.img}
                    alt={tour.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div>
                  <div className="font-medium flex items-center gap-2">
                    <p className="line-clamp-1 text-sm">{tour.name}</p>
                    {tour.best && <span className="line-clamp-1 text-xs text-white bg-orange-500 py-0.5 px-1.5 rounded-full">{tour.best}</span>}
                  </div>
                  <p className="text-muted-foreground text-sm">{tour.duration}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
      <div onMouseEnter={() => setOverlay(false)} onMouseLeave={() => setOverlay(true)} className={`bg-black/50 h-screen ${overlay ? "block" : "hidden"}`} />
    </div>
  )
}

export default MegaMenu