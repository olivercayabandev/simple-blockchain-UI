import { motion } from 'framer-motion';
import { portfolioData } from '~/data/portfolio';

export function About() {
  return (
    <section id="about" className="py-24 md:py-32">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-4xl md:text-5xl font-bold text-center mb-8">
            About Me
          </h2>
          
          <div className="max-w-3xl mx-auto">
            <motion.div
              className="bg-card rounded-2xl p-8 md:p-12 shadow-lg"
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2, duration: 0.5 }}
            >
              <p className="text-lg md:text-xl text-card-foreground leading-relaxed">
                {portfolioData.about}
              </p>
              
              <motion.div
                className="mt-8 flex flex-wrap gap-4"
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.4, duration: 0.5 }}
              >
                <div className="flex items-center gap-2 px-4 py-2 bg-secondary rounded-full">
                  <span className="text-sm font-medium">🚀 5+ Years Experience</span>
                </div>
                <div className="flex items-center gap-2 px-4 py-2 bg-secondary rounded-full">
                  <span className="text-sm font-medium">💼 Multiple Industries</span>
                </div>
                <div className="flex items-center gap-2 px-4 py-2 bg-secondary rounded-full">
                  <span className="text-sm font-medium">🎯 Client-Focused</span>
                </div>
              </motion.div>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
