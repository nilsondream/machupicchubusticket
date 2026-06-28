"use client"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Card, CardContent } from "@/components/ui/card"
import { Star } from "lucide-react"

const reviews = [{ name: "Carlos Ramírez", country: "Chile", content: "Reservar el bus a Machu Picchu fue muy sencillo. Recibí mi boleto digital en pocos minutos y todo el proceso fue rápido y seguro.", avatar: "https://images.unsplash.com/photo-1599566150163-29194dcaad36?q=80&w=100&auto=format&fit=crop", }, { name: "Laura Fernández", country: "España", content: "La plataforma es fácil de usar y la información es muy clara. Pudimos organizar nuestro viaje sin preocuparnos por el transporte.", avatar: "https://images.unsplash.com/photo-1732551137243-683bbd502bf1?q=80&w=100&auto=format&fit=crop", }, { name: "Miguel Torres", country: "México", content: "Excelente servicio. Presentamos el boleto desde el celular y abordamos sin inconvenientes. Una opción práctica para visitar Machu Picchu.", avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=100&auto=format&fit=crop", }]

const Reviews = () => {
  return (
    <section className="py-24 max-md:py-20">
      <div className="max-w-6xl mx-auto max-md:px-5">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-semibold tracking-tight mb-4">
            Lo que dicen nuestros viajeros
          </h2>
          <p className="text-muted-foreground text-lg">
            Conoce las experiencias de quienes reservaron su bus a Machu Picchu con nosotros.
          </p>
        </div>

        <div className="grid grid-cols-3 max-md:grid-cols-1 gap-5">
          {reviews.map((testimonial, index) => (
            <Card key={index} className="shadow-none rounded-2xl">
              <CardContent className="flex flex-col h-full">
                <div className="flex gap-1 mb-6">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} size={20} className="fill-current text-orange-500" />
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
          ))}
        </div>
      </div>
    </section>
  )
}

export default Reviews