import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";

const HeroSection = () => {
  return (
    <header className="flex flex-col items-center justify-center text-center px-6 py-20">
      <motion.h2
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-4xl sm:text-5xl font-extrabold text-primary"
      >
        Your Cozy AI-Powered Study Companion
      </motion.h2>
      <p className="mt-6 max-w-2xl text-lg text-muted-foreground">
        Organize your learning, create smart flashcards, and let AI guide you
        along the way.
      </p>
      <motion.div whileHover={{ scale: 1.05 }} className="mt-8">
        <Button
          size="lg"
          className="bg-primary text-primary-foreground hover:bg-secondary hover:text-secondary-foreground rounded-2xl shadow"
        >
          Start Learning Today
        </Button>
      </motion.div>
    </header>
  );
};

export default HeroSection;
