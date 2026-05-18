import { motion } from "motion/react";
import { Sparkles, Globe, Heart, Shield, Award, Users } from "lucide-react";

export default function Impact() {
  const stats = [
    { label: "Community Pros", value: "150+", icon: Users, color: "bg-blue-500" },
    { label: "Village Coverage", value: "24", icon: Globe, iconColor: "text-green-500", color: "bg-green-50" },
    { label: "Verified Reviews", value: "1,200", icon: Award, color: "bg-orange-500" },
    { label: "Neighbor Safety", value: "100%", icon: Shield, color: "bg-purple-500" },
  ];

  return (
    <div className="space-y-24 py-12 pb-40">
      {/* Hero Section */}
      <section className="text-center space-y-8 max-w-4xl mx-auto">
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="inline-flex items-center gap-2 bg-orange-50 text-orange-600 px-6 py-2 rounded-full text-xs font-black uppercase tracking-widest border border-orange-100"
        >
          <Sparkles className="w-4 h-4" /> The Kaushalya Mission
        </motion.div>
        
        <motion.h1 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-6xl md:text-8xl font-black tracking-tight leading-[0.9]"
        >
          Empowering Every <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-600 to-orange-400 font-black">Karnataka Professional.</span>
        </motion.h1>
        
        <motion.p 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="text-xl text-gray-500 font-medium leading-relaxed"
        >
          We're building more than a dashboard. We're building a trust economy where local skills are valued, verified, and visible to every neighbor.
        </motion.p>
      </section>

      {/* Grid of Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        {stats.map((stat, i) => (
          <motion.div 
            key={i}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="bg-white p-10 rounded-[3rem] border border-gray-100 shadow-xl shadow-gray-200/50 flex flex-col items-center text-center space-y-4 hover:-translate-y-2 transition-transform"
          >
            <div className={`w-16 h-16 ${stat.color} rounded-2xl flex items-center justify-center text-white mb-4`}>
               <stat.icon className="w-8 h-8" />
            </div>
            <h3 className="text-4xl font-black">{stat.value}</h3>
            <p className="text-xs font-black uppercase tracking-widest text-gray-400">{stat.label}</p>
          </motion.div>
        ))}
      </div>

      {/* Narrative Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
        <motion.div 
          initial={{ opacity: 0, x: -40 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          className="bg-orange-600 rounded-[4rem] p-12 md:p-20 text-white space-y-8 shadow-2xl shadow-orange-600/30 overflow-hidden relative"
        >
          <div className="absolute -top-20 -right-20 w-80 h-80 bg-white/10 blur-[100px] rounded-full" />
          <Heart className="w-16 h-16 fill-white opacity-20" />
          <h2 className="text-4xl md:text-6xl font-black tracking-tight leading-[0.95]">
            Supporting India's Small Businesses.
          </h2>
          <p className="text-xl font-medium opacity-80 leading-relaxed">
            Every job through Kaushalya Karnataka directly supports a family in your neighborhood. We ensure that skilled laborers aren't hidden behind billboards, but spotlighted in our community.
          </p>
          <div className="pt-8 flex items-center gap-6">
             <div className="space-y-1">
               <p className="text-[10px] font-black uppercase tracking-[0.2em]">Local Impact</p>
               <p className="text-3xl font-black">₹4.2 Lakhs</p>
               <p className="text-[9px] font-bold opacity-60 uppercase">Direct Trade Value Weekly</p>
             </div>
          </div>
        </motion.div>

        <div className="space-y-12">
          <div className="space-y-6">
             <h3 className="text-3xl font-black tracking-tight italic">Our Core Principles</h3>
             <div className="space-y-8">
               <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-gray-50 rounded-2xl flex items-center justify-center flex-shrink-0 text-orange-600">
                    <Shield className="w-6 h-6" />
                  </div>
                  <div className="space-y-1">
                    <h4 className="font-black text-xl">Verified Trust</h4>
                    <p className="text-gray-500 font-medium">Every professional undergoes a basic verification process to ensure neighbor safety.</p>
                  </div>
               </div>
               <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-gray-50 rounded-2xl flex items-center justify-center flex-shrink-0 text-orange-600">
                    <Award className="w-6 h-6" />
                  </div>
                  <div className="space-y-1">
                    <h4 className="font-black text-xl">Skill Professionalization</h4>
                    <p className="text-gray-500 font-medium">We provide tools for workers to showcase their best work through high-quality portfolios.</p>
                  </div>
               </div>
               <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-gray-50 rounded-2xl flex items-center justify-center flex-shrink-0 text-orange-600">
                    <Globe className="w-6 h-6" />
                  </div>
                  <div className="space-y-1">
                    <h4 className="font-black text-xl">Economic Empowerment</h4>
                    <p className="text-gray-500 font-medium">Reducing the gap between local talent and community needs increases the standard of living.</p>
                  </div>
               </div>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
}
