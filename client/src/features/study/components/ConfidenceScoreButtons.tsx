import { useState } from "react";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";

const CONFIDENCE_LABELS = {
  1: "Not confident at all",
  2: "Somewhat confident",
  3: "Moderately confident",
  4: "Confident",
  5: "Very confident",
};

interface ConfidenceScoreButtonsProps {
  onSelect?: (score: number) => void;
}

const ConfidenceScoreButtons = ({ onSelect }: ConfidenceScoreButtonsProps) => {
  const [selected, setSelected] = useState<number | null>(null);
  const [hovered, setHovered] = useState<number | null>(null);

  const handleClick = (score: number) => {
    setSelected(score);
    onSelect?.(score);
  };

  const scores = [1, 2, 3, 4, 5];
  const active = hovered ?? selected;
  return (
    <>
      <div className="flex justify-center gap-3">
        {scores.map((score) => (
          <motion.div
            key={score}
            whileHover={{ scale: 1.08 }}
            whileTap={{ scale: 0.95 }}
            onMouseEnter={() => setHovered(score)}
            onMouseLeave={() => setHovered(null)}
          >
            <Button
              onClick={() => handleClick(score)}
              className={`
                w-12 h-12 rounded-2xl font-semibold transition-all shadow-sm
                ${
                  selected === score
                    ? "bg-[oklch(0.75_0.16_70)] text-[oklch(0.98_0.02_95)] shadow-md"
                    : score < 3
                    ? "bg-[oklch(0.96_0.02_80)] text-[oklch(0.4_0.02_40)]"
                    : score < 5
                    ? "bg-[oklch(0.85_0.1_50)] text-[oklch(0.2_0.02_40)]"
                    : "bg-[oklch(0.7_0.12_20)] text-[oklch(0.98_0.02_95)]"
                }
                hover:shadow-md hover:ring-2 hover:ring-[oklch(0.7_0.05_80)]
              `}
            >
              {score}
            </Button>
          </motion.div>
        ))}
      </div>

      <div className="h-6 mt-1">
        <AnimatePresence mode="wait">
          {active && (
            <motion.p
              key={active}
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -5 }}
              transition={{ duration: 0.25 }}
              className="text-sm text-[oklch(0.4_0.02_40)] font-medium"
            >
              {CONFIDENCE_LABELS[active as keyof typeof CONFIDENCE_LABELS]}
            </motion.p>
          )}
        </AnimatePresence>
      </div>
    </>
  );
};

export default ConfidenceScoreButtons;
