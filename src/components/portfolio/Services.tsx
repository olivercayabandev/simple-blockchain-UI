import { motion } from 'framer-motion';
import { Code, Lightbulb, Search } from 'lucide-react';
import { portfolioData } from '~/data/portfolio';

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  Code,
  Lightbulb,
  Search
};

export function Services() {
  return (
    <section id="services" className="py-24 md:py-32">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-4xl md:text-5xl font-bold text-center mb-8">
            Services
          </h2>
          
          <p className="text-lg text-muted-foreground text-center max-w-2xl mx-auto mb-12">
            I offer a range of engineering services to help businesses build better software
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {portfolioData.services.map((service, index) => {
              const Icon = iconMap[service.icon] || Code;
              
              return (
                <motion.div
                  key={service.title}
                  className="bg-card rounded-2xl p-8 text-center shadow-lg group"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1, duration: 0.5 }}
                  whileHover={{ y: -5 }}
                >
                  <motion.div
                    className="w-16 h-16 mx-auto mb-6 rounded-2xl bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors"
                    whileHover={{ scale: 1.1, rotate: 5 }}
                  >
                    <Icon className="h-8 w-8 text-primary" />
                  </motion.div>
                  
                  <h3 className="text-xl font-semibold mb-3">{service.title}</h3>
                  <p className="text-muted-foreground">{service.description}</p>
                </motion.div>
              );
            })}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
