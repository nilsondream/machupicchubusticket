import Link from "next/link"
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel"
import { ArrowRight, Calendar, ChartNoAxesColumnIncreasing } from "lucide-react"
import { tours } from "@/data/tours";
import { Button } from "../ui/button";

const bestTours = tours.slice(0, 9);

const BestTours = () => {
  return (
    <section id="tours" className="py-24 max-md:py-20 border-t">
      <div className="max-w-6xl mx-auto max-md:px-5">
        <div className="flex justify-between items-end mb-10">
          <div className="space-y-2">
            <h2 className="text-3xl font-semibold tracking-tight">Explora nuestros tours y aventuras</h2>
            <p className="text-muted-foreground">Descubre nuestros tours más populares y recomendados</p>
          </div>
          <Link href="/tours">
            <Button variant="outline" className="max-md:hidden">
              Ver Tours
              <ArrowRight />
            </Button>
          </Link>
        </div>
        <Carousel>
          <CarouselContent>
            {bestTours.map((item, index) => (
              <CarouselItem key={index} className="basis-1/3 max-md:basis-full">
                <Link href={"/tours/" + item.slug + "/"}>
                  <div className="flex flex-col gap-2 group border bg-card rounded-xl transition-all overflow-hidden hover:bg-muted/50 mx-px">
                    <div className="relative aspect-2/1 flex items-center justify-center rounded-t-lg bg-muted overflow-hidden">
                      {item.best && (
                        <span className="absolute z-10 top-5 left-5 shadow-lg bg-orange-500 text-white text-sm leading-none font-semibold py-2 px-4 rounded-full">
                          {item.best}
                        </span>
                      )}
                      <img src={item.thumb} alt={item.title} width={400} height={200} className="w-full h-full absolute object-cover group-hover:scale-110 duration-300" />
                    </div>
                    <div className="flex flex-col justify-between gap-6 p-5 max-md:p-3">
                      <div className="space-y-3">
                        <h3 className="font-semibold max-md:line-clamp-1 text-lg group-hover:text-orange-500">{item.title}</h3>
                        <div className="flex gap-2 text-xs">
                          <span className="flex items-center gap-2 border bg-muted rounded-full px-2 py-1"><Calendar size={12.5} />{item.duration}</span>
                          <span className="flex items-center gap-2 border bg-muted rounded-full px-2 py-1"><ChartNoAxesColumnIncreasing size={12.5} />{item.rating}</span>
                        </div>
                        <p className="line-clamp-2 text-sm text-muted-foreground">{item.overview[0]?.text}</p>
                      </div>
                      <p className="text-muted-foreground text-sm">
                        From<br /><b className="text-2xl text-foreground">${item.price}</b> / per person
                      </p>
                    </div>
                  </div>
                </Link>
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious />
          <CarouselNext />
        </Carousel>
      </div>
    </section>
  )
}

export default BestTours