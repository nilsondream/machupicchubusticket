"use client"
import { cn } from "@/lib/utils";
import { ChevronDown } from "lucide-react";
import { useState } from "react"

const faqs = [
  {
    question: "What time is recommended to take the bus to Machu Picchu?",
    answer: "The first buses start operating at 5:30 a.m. If you want to explore Machu Picchu with more peace and fewer visitors, it is ideal to travel on the earliest schedules. The journey from Aguas Calientes takes about 30 minutes."
  },
  {
    question: "Is it possible to book round-trip tickets?",
    answer: "Yes. You can choose a one-way uphill ticket, a downhill-only ticket, or a round-trip ticket. The round-trip option is usually the most practical, as it guarantees your return transportation to Aguas Calientes after your visit."
  },
  {
    question: "Do I need to bring a printed ticket to board?",
    answer: "It is not mandatory to print it. You can simply show the digital ticket from your mobile phone. Once the reservation is completed, you will receive the confirmation and receipt in your email."
  },
  {
    question: "Where is the bus departure point located?",
    answer: "Buses depart from the official station located in the center of Aguas Calientes, also known as Machu Picchu Pueblo. The location is just a few minutes' walk from the train station."
  },
  {
    question: "What happens if I miss my scheduled bus?",
    answer: "The service does not use assigned seats or rigid boarding times. If you miss your planned bus, you can generally board the next available unit within operating hours."
  }
];

const FAQs = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(0);
  const toggleAccordion = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section className="py-24 max-md:py-20">
      <div className="max-w-6xl mx-auto max-md:px-5">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-semibold tracking-tight mb-4">
            Frequently Asked Questions
          </h2>
          <p className="text-muted-foreground text-lg">
            We answer your questions
          </p>
        </div>

        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <div
              key={index}
              onClick={() => toggleAccordion(index)}
              className="cursor-pointer py-5 border bg-card p-6 rounded-2xl"
            >
              <div className="flex items-center justify-between gap-5">
                <h4 className="font-semibold text-lg max-md:text-base">{faq.question}</h4>
                <ChevronDown className={cn("duration-300 shrink-0", openIndex === index && "rotate-180")} />
              </div>
              <p className={cn("mt-2.5 text-muted-foreground", openIndex === index ? "block" : "hidden")}>
                {faq.answer}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default FAQs