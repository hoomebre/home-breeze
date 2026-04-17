"use client";

import { motion } from "framer-motion";
import { ShieldCheck, Truck, CreditCard, Headphones } from "lucide-react";

export function WhyChooseUs() {
  const benefits = [
    {
      icon: <ShieldCheck className="w-8 h-8 md:w-10 md:h-10 text-accent" />,
      title: "Premium Quality",
      description: "Only the finest materials and craftsmanship for products that last a lifetime."
    },
    {
      icon: <Truck className="w-8 h-8 md:w-10 md:h-10 text-accent" />,
      title: "Fast Delivery",
      description: "Expedited shipping nationwide ensuring your project stays on schedule."
    },
    {
      icon: <CreditCard className="w-8 h-8 md:w-10 md:h-10 text-accent" />,
      title: "Secure Payment",
      description: "Convenient Cash on Delivery (COD) for your peace of mind."
    },
    {
      icon: <Headphones className="w-8 h-8 md:w-10 md:h-10 text-accent" />,
      title: "Expert Support",
      description: "Our sanitary specialists are here to guide your selection process."
    }
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.15 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    show: { opacity: 1, y: 0, transition: { duration: 0.6 } }
  };

  return (
    <section className="py-24 bg-background">
      <div className="container mx-auto px-4 md:px-6">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-serif font-semibold mb-4">
            Why Choose Home Breeze
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto text-lg">
            We go beyond just selling products. We deliver an exceptional experience from discovery to installation.
          </p>
        </div>

        <motion.div 
          variants={containerVariants}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-50px" }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 md:gap-12"
        >
          {benefits.map((benefit, index) => (
            <motion.div 
              key={index} 
              variants={itemVariants}
              className="group flex flex-col items-center text-center p-6 rounded-2xl bg-card border border-border/50 shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-2"
            >
              <div className="w-20 h-20 rounded-full bg-accent/10 flex items-center justify-center mb-6 group-hover:bg-accent/20 transition-colors duration-300">
                {benefit.icon}
              </div>
              <h3 className="text-xl font-serif font-semibold mb-3">{benefit.title}</h3>
              <p className="text-muted-foreground leading-relaxed">{benefit.description}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
