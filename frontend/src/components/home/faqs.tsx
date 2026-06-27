"use client"
import { cn } from "@/lib/utils";
import { ChevronDown } from "lucide-react";
import { useState } from "react"

const faqs = [
  {
    question: "¿A qué hora es recomendable tomar el bus a Machu Picchu?",
    answer:
      "Los primeros buses comienzan a operar desde las 5:30 a. m. Si deseas recorrer Machu Picchu con mayor tranquilidad y encontrar menos visitantes, lo ideal es viajar en los primeros horarios. El trayecto desde Aguas Calientes dura cerca de 30 minutos."
  },
  {
    question: "¿Es posible reservar boletos de ida y vuelta?",
    answer:
      "Sí. Puedes elegir un boleto solo de subida, únicamente de bajada o un pasaje de ida y retorno. Esta última alternativa suele ser la más práctica, ya que asegura tu transporte de regreso a Aguas Calientes después de la visita."
  },
  {
    question: "¿Necesito llevar el boleto impreso para abordar?",
    answer:
      "No es obligatorio imprimirlo. Basta con presentar el ticket digital desde tu teléfono móvil. Una vez completada la reserva, recibirás la confirmación y el comprobante en tu correo electrónico."
  },
  {
    question: "¿Dónde se encuentra el punto de salida del bus?",
    answer:
      "Los buses parten desde la estación oficial ubicada en el centro de Aguas Calientes, también conocido como Machu Picchu Pueblo. El lugar se encuentra a pocos minutos caminando de la estación de tren."
  },
  {
    question: "¿Qué pasa si no llego al horario previsto de mi bus?",
    answer:
      "El servicio no utiliza asientos asignados ni un embarque rígido por horario. Si no alcanzas el bus que tenías previsto, generalmente podrás abordar la siguiente unidad disponible dentro del horario de funcionamiento."
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
          <h2 className="text-3xl font-semibold tracking-tight mb-4">Preguntas frecuentes</h2>
          <p className="text-muted-foreground text-lg">
            Respondemos a tus dudas
          </p>
        </div>

        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <div
              key={index}
              onClick={() => toggleAccordion(index)}
              className="cursor-pointer py-5 border bg-card p-6 rounded-xl"
            >
              <div className="flex items-center justify-between gap-5">
                <h4 className="font-semibold text-lg max-md:text-base">{faq.question}</h4>
                <ChevronDown className={cn("duration-300 shrink-0", openIndex === index && "rotate-180")} />
              </div>
              <p className={cn("mt-2.5 text-muted-foreground", openIndex === index ? "block" : "hidden")}>{faq.answer}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default FAQs