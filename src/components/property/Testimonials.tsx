import { MOCK_TESTIMONIALS } from '../../data/mockData';
import { Quote } from 'lucide-react';
import { motion } from 'framer-motion';

export function Testimonials() {
  return (
    <section className="py-20 bg-slate-50 dark:bg-slate-900/50 relative overflow-hidden">
      {/* Decorative circles */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-blue-400/5 rounded-full blur-3xl -mr-48 -mt-48" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-blue-400/5 rounded-full blur-3xl -ml-48 -mb-48" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white mb-4">
            Hear from our Happy Clients
          </h2>
          <p className="text-slate-500 dark:text-slate-400 max-w-2xl mx-auto">
            We've helped thousands of families find their perfect home in Karnataka. 
            Here's what some of them have to say.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {MOCK_TESTIMONIALS.map((t, index) => (
            <motion.div
              key={t.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="bg-white dark:bg-slate-800 p-8 rounded-3xl shadow-xl shadow-slate-200/50 dark:shadow-none border border-slate-100 dark:border-slate-700 relative"
            >
              <div className="absolute top-6 right-8 opacity-10">
                <Quote className="h-12 w-12 text-blue-600" />
              </div>
              
              <p className="text-slate-600 dark:text-slate-300 mb-8 leading-relaxed italic">
                "{t.content}"
              </p>

              <div className="flex items-center gap-4">
                <img src={t.avatar} alt={t.name} className="h-12 w-12 rounded-2xl object-cover ring-2 ring-blue-50 dark:ring-slate-700" />
                <div>
                  <h4 className="font-bold text-slate-900 dark:text-white">{t.name}</h4>
                  <p className="text-xs text-blue-600 dark:text-blue-400 font-medium">{t.role}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
