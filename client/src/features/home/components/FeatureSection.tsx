import { motion } from "framer-motion";
import { BookOpen, Brain, Layers, Sparkles } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const features = [
  {
    icon: <BookOpen className="h-10 w-10 text-primary" />,
    title: "Flashcards",
    description:
      "Create, organize, and review flashcards for smarter studying.",
  },
  {
    icon: <Brain className="h-10 w-10 text-primary" />,
    title: "AI Assistant",
    description:
      "Use AI to generate study materials and answer questions instantly.",
  },
  {
    icon: <Layers className="h-10 w-10 text-primary" />,
    title: "Collections",
    description:
      "Group flashcards into collections to keep your study organized.",
  },
  {
    icon: <Sparkles className="h-10 w-10 text-primary" />,
    title: "Smart Insights",
    description:
      "Track progress and get insights tailored to your learning style.",
  },
];

const FeaturesSection = () => {
  return (
    <section id="features" className="px-8 py-16">
      <h3 className="text-3xl font-bold text-center text-primary mb-12">
        Core Features
      </h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
        {features.map((feature, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.2 }}
            viewport={{ once: true }}
          >
            <Card className="rounded-2xl shadow-md hover:shadow-lg transition h-full flex flex-col">
              <CardHeader className="flex flex-col items-center text-center">
                {feature.icon}
                <CardTitle className="mt-4 text-xl font-semibold text-secondary">
                  {feature.title}
                </CardTitle>
              </CardHeader>
              <CardContent className="text-center text-muted-foreground">
                {feature.description}
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>
    </section>
  );
};

export default FeaturesSection;
