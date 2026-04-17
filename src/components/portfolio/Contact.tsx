import { motion } from 'framer-motion';
import { Mail, Linkedin, Github, Globe } from 'lucide-react';
import { portfolioData } from '~/data/portfolio';

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  email: Mail,
  linkedin: Linkedin,
  github: Github,
  website: Globe
};

export function Contact() {
  return (
    <section id="contact" className="py-24 md:py-32 bg-secondary/30">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-4xl md:text-5xl font-bold text-center mb-8">
            Get In Touch
          </h2>
          
          <p className="text-lg text-muted-foreground text-center max-w-2xl mx-auto mb-12">
            Interested in working together? Feel free to reach out through any of these channels
          </p>

          <div className="flex flex-wrap justify-center gap-4">
            {portfolioData.contact.map((method, index) => {
              const Icon = iconMap[method.type] || Mail;
              
              return (
                <motion.a
                  key={method.type}
                  href={method.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-3 px-6 py-3 bg-card rounded-full shadow-lg hover:shadow-xl transition-shadow"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1, duration: 0.5 }}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Icon className="h-5 w-5 text-primary" />
                  <span className="font-medium">{method.label}</span>
                </motion.a>
              );
            })}
          </div>

          <motion.div
            className="mt-16 text-center"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.5, duration: 0.5 }}
          >
            <p className="text-muted-foreground">
              © {new Date().getFullYear()} {portfolioData.name}. All rights reserved.
            </p>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
