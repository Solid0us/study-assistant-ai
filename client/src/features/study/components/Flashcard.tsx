import { Card, CardContent } from "@/components/ui/card";
import { useState } from "react";
import { motion } from "framer-motion";

interface FlashcardProps {
  front: string;
  back: string;
}

const Flashcard = ({ front, back }: FlashcardProps) => {
  const [flipped, setFlipped] = useState(false);
  return (
    <div className="w-full max-w-md cursor-pointer perspective-[1000px]">
      <motion.div
        className="relative w-full h-96"
        onClick={() => setFlipped(!flipped)}
        animate={{ rotateY: flipped ? 180 : 0 }}
        transition={{ duration: 0.6, ease: "easeInOut" }}
        style={{ transformStyle: "preserve-3d" }}
      >
        <Card
          className={`
        absolute w-full h-full backface-hidden flex items-center justify-center text-center
        text-2xl p-6 rounded-2xl shadow-xl
        border border-border/40 bg-gradient-to-br from-background to-muted/30
        hover:shadow-2xl transition-all duration-300 overflow-y-auto
      `}
        >
          <CardContent className="flex flex-col items-center justify-center">
            <span className="font-bold text-foreground/90">Question:</span>
            &nbsp;{front}
          </CardContent>
        </Card>

        <Card
          className={`
        absolute w-full h-full rotate-y-180 backface-hidden flex items-center justify-center text-center
        text-2xl p-6 rounded-2xl shadow-xl
        border border-border/40
        bg-gradient-to-br from-primary/20 via-primary/30 to-primary/40
        dark:from-primary/40 dark:via-primary/30 dark:to-primary/20
        
      `}
        >
          <CardContent className="flex flex-col items-center justify-center overflow-y-auto">
            <span className="font-bold text-foreground/90">Answer:</span>&nbsp;
            {back}
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
};

export default Flashcard;
