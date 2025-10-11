import { motion, AnimatePresence } from "framer-motion";
interface SubmitMessageProps {
  score: number;
}

const EncouragementMessage = ({ score }: SubmitMessageProps) => {
  const displayMessage = (score: number) => {
    if (score >= 5) {
      return "Excellent! Amazing recall!";
    } else if (score === 4) {
      return "Great work! You clearly remember this well.";
    } else if (score === 3) {
      return "Nice! You're halfway there. Keep practicing for mastery.";
    } else if (score === 2) {
      return "Great effort! You're getting there. Review it once more for clarity.";
    } else {
      return "No worries. You'll get it next time!";
    }
  };
  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={score}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -10 }}
        transition={{ duration: 0.3 }}
        className="text-center text-[oklch(0.4_0.02_40)] bg-[oklch(0.95_0.05_85)] px-4 py-2 rounded-xl shadow-sm max-w-md"
      >
        {displayMessage(score)}
      </motion.div>
    </AnimatePresence>
  );
};

export default EncouragementMessage;
