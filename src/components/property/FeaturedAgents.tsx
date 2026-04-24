import { MOCK_AGENTS } from '../../data/mockData';
import { BadgeCheck, Star, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';
import { Button } from '../ui/Button';

export function FeaturedAgents() {
  return (
    <section className="py-24 bg-white dark:bg-slate-900 border-y border-slate-100 dark:border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row items-end justify-between gap-4 mb-16">
          <div className="max-w-xl">
            <BadgeCheck className="h-10 w-10 text-blue-600 mb-4" />
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white mb-4">
              Expert Agents at Your Service
            </h2>
            <p className="text-slate-500 dark:text-slate-400">
              Our team of verified agents brings deep local expertise and a passion 
              for finding your perfect space in Karnataka.
            </p>
          </div>
          <Button variant="outline">
            Meet All Agents <ArrowRight className="h-4 w-4 ml-2" />
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {MOCK_AGENTS.map((agent, index) => (
            <motion.div
              key={agent.id}
              initial={{ opacity: 0, x: index % 2 === 0 ? -30 : 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="group bg-slate-50 dark:bg-slate-800/50 rounded-3xl p-8 flex flex-col sm:flex-row gap-6 border border-transparent hover:border-blue-500/20 hover:bg-white dark:hover:bg-slate-800 transition-all duration-300 shadow-sm hover:shadow-xl"
            >
              <div className="relative shrink-0">
                <img 
                  src={agent.avatar} 
                  alt={agent.name} 
                  className="h-32 w-32 rounded-2xl object-cover ring-4 ring-white dark:ring-slate-900 shadow-lg" 
                />
                <div className="absolute -bottom-2 -right-2 h-8 w-8 bg-blue-600 rounded-lg flex items-center justify-center text-white border-2 border-white dark:border-slate-800">
                  <Star className="h-4 w-4 fill-current" />
                </div>
              </div>

              <div className="flex-1">
                <div className="flex items-center justify-between gap-2 mb-1">
                  <h3 className="text-xl font-bold text-slate-900 dark:text-white group-hover:text-blue-600 transition-colors">
                    {agent.name}
                  </h3>
                  <span className="text-xs font-bold text-blue-600 dark:text-blue-400 uppercase tracking-widest">{agent.experience} Exp</span>
                </div>
                <p className="text-blue-600 dark:text-blue-400 font-medium text-sm mb-3">
                  {agent.role}
                </p>
                <p className="text-slate-500 dark:text-slate-400 text-sm mb-4 leading-relaxed line-clamp-2">
                  Specializing in <span className="font-semibold text-slate-700 dark:text-slate-200">{agent.specialty}</span>. 
                  Committed to excellence in every transaction.
                </p>
                
                <div className="flex items-center gap-6 pt-4 border-t border-slate-200 dark:border-slate-700">
                  <div>
                    <p className="text-xl font-bold text-slate-900 dark:text-white">{agent.stats.properties}</p>
                    <p className="text-[10px] text-slate-500 uppercase font-bold tracking-tighter">Properties</p>
                  </div>
                  <div>
                    <p className="text-xl font-bold text-slate-900 dark:text-white">{agent.stats.rating}</p>
                    <p className="text-[10px] text-slate-500 uppercase font-bold tracking-tighter">Rating</p>
                  </div>
                  <Button size="sm" className="ml-auto rounded-xl">View Profile</Button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
