"use client"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Card, CardContent } from "@/components/ui/card"
import { Star } from "lucide-react"
import { Carousel, CarouselContent, CarouselItem } from "@/components/ui/carousel"

const reviews = [
  {
    name: "Charles Ramsey",
    country: "United States",
    content: "Booking the bus to Machu Picchu was incredibly simple. I received my digital ticket within minutes, and the whole process was fast and secure.",
    avatar: "https://images.unsplash.com/photo-1599566150163-29194dcaad36?q=80&w=100&auto=format&fit=crop",
  },
  {
    name: "Laura Fernandes",
    country: "United Kingdom",
    content: "The platform is easy to use and the information is very clear. We were able to organize our trip without worrying about transportation.",
    avatar: "https://images.unsplash.com/photo-1732551137243-683bbd502bf1?q=80&w=100&auto=format&fit=crop",
  },
  {
    name: "Michael Towers",
    country: "Canada",
    content: "Excellent service. We showed the ticket right from our phones and boarded without any issues. A very practical option for visiting Machu Picchu.",
    avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=100&auto=format&fit=crop",
  },
  {
    name: "Sarah Jenkins",
    country: "Australia",
    content: "Highly recommend this service! Getting our bus tickets ahead of time saved us so much stress on the day of our Machu Picchu tour.",
    avatar: "https://unsplash.com",
  },
  {
    name: "David Kim",
    country: "New Zealand",
    content: "Smooth process from start to finish. The instructions on where to catch the bus in Aguas Calientes were spot on.",
    avatar: "https://unsplash.com",
  },
  {
    name: "Emma Watson",
    country: "Ireland",
    content: "Fast, reliable, and convenient. Skip the ticket lines at the station and buy them here. It made our morning completely hassle-free.",
    avatar: "https://unsplash.com",
  }
]

const Reviews = () => {
  return (
    <section className="py-24 max-md:py-20">
      <div className="max-w-6xl mx-auto max-md:px-5">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-semibold tracking-tight mb-4">
            What our travelers say
          </h2>
          <p className="text-muted-foreground text-lg">
            Read about the experiences of those who booked their bus to Machu Picchu with us.
          </p>
        </div>

        <Carousel>
          <CarouselContent>
            {reviews.map((testimonial, index) => (
              <CarouselItem key={index} className="basis-1/3 max-md:basis-full">
                <Card className="shadow-none rounded-2xl select-none m-1">
                  <CardContent className="flex flex-col h-full">
                    <div className="flex gap-1 mb-6">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} size={16} className="fill-current text-orange-500" />
                      ))}
                    </div>
                    <p className="mb-8 grow leading-relaxed">
                      {testimonial.content}
                    </p>
                    <div className="flex items-center gap-4">
                      <Avatar className="h-12 w-12">
                        <AvatarImage src={testimonial.avatar} alt={testimonial.name} />
                        <AvatarFallback>{testimonial.name.charAt(0).toUpperCase()}</AvatarFallback>
                      </Avatar>
                      <div>
                        <p>{testimonial.name}</p>
                        <p className="text-sm text-muted-foreground">{testimonial.country}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </CarouselItem>
            ))}
          </CarouselContent>
        </Carousel>
      </div>
    </section>
  )
}

export default Reviews