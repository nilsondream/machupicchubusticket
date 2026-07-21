import { CheckCircle, Earth, Headset, Mail, MessageCircle, ShieldCheck } from "lucide-react";

const benefits = [
  {
    icon: CheckCircle,
    title: "Easy Online Booking",
    description: "Complete your reservation in just a few steps from any device."
  },
  {
    icon: Headset,
    title: "Personalized Assistance",
    description: "Our team is available to answer your questions before and after your booking."
  },
  {
    icon: Mail,
    title: "Email Confirmation",
    description: "Receive your booking details directly in your inbox for quick and easy access."
  },
  {
    icon: MessageCircle,
    title: "WhatsApp Support",
    description: "Need help? Contact us through WhatsApp for fast assistance."
  },
  {
    icon: ShieldCheck,
    title: "Secure Reservation Process",
    description: "We guide you through every step to help make your booking experience simple and reliable."
  },
  {
    icon: Earth,
    title: "English & Spanish Service",
    description: "We assist travelers from around the world in both English and Spanish."
  }
];

const WhyChoose = () => {
  return (
    <section className="py-24 max-md:py-20">
      <div className="max-w-6xl mx-auto space-y-15 max-md:px-5">
        {/* Título principal */}
        <div className="text-center">
          <h2 className="text-3xl font-semibold mb-5">
            Why Book With Us?
          </h2>
          <p className="text-lg text-muted-foreground max-w-4xl mx-auto">
            Planning your visit to Machu Picchu should be easy. Our team provides personalized assistance and reliable support to help make your reservation process simple and stress-free.
          </p>
        </div>

        <div className="grid grid-cols-3 gap-10 max-md:grid-cols-1">
          {benefits.map((benefit, index) => (
            <div key={index} className="flex gap-4">
              <div className="size-12 bg-orange-500 text-white rounded-xl flex items-center justify-center shrink-0">
                <benefit.icon />
              </div>
              <div>
                <h3 className="font-semibold mb-2">
                  {benefit.title}
                </h3>
                <p className="text-muted-foreground">
                  {benefit.description}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Mensaje final 
        <div className="flex items-center gap-5 w-full">
          <div className="h-px w-full bg-border"></div>
          <p className="w-3/5 text-muted-foreground text-center shrink-0 text-sm">
            Our goal is to make your journey to Machu Picchu easier from the very beginning.
            From your reservation to the day of your visit, we're here to help whenever you need assistance.
          </p>
          <div className="h-px w-full bg-border"></div>
        </div>*/}
      </div>
    </section>
  )
}

export default WhyChoose