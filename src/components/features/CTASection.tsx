import { forwardRef } from "react";
import { motion } from "framer-motion";
import { ArrowRight, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { AppLink } from "@/components/AppLink";

export const CTASection = forwardRef<HTMLElement>(function CTASection(_, ref) {
  return (
    <section ref={ref} className="py-24 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-primary/5 to-transparent" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] bg-primary/10 rounded-full blur-[150px] pointer-events-none" />

      <div className="container-arena relative">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="max-w-3xl mx-auto text-center"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-card mb-8">
            <Zap className="w-4 h-4 text-primary" />
            <span className="text-sm font-medium">Built for serious fan competition</span>
          </div>

          <h2 className="font-display font-black text-4xl md:text-5xl lg:text-6xl mb-6">
            <span className="text-foreground">Turn every match into a </span>
            <span className="gradient-text-primary text-glow-cyan">high-pressure moment</span>
          </h2>

          <p className="text-lg text-muted-foreground mb-10 max-w-xl mx-auto">
            Join a sharper class of esports fans. Make confident live calls,
            earn premium rewards, and build a reputation that carries across the platform.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <AppLink href="/auth">
              <Button variant="hero" size="xl" className="group">
                Start Free
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Button>
            </AppLink>

            <AppLink href="/dashboard">
              <Button variant="heroOutline" size="xl">
                Preview the Experience
              </Button>
            </AppLink>
          </div>
        </motion.div>
      </div>
    </section>
  );
});
