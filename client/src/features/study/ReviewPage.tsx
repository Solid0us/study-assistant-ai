import useUrlId from "@/hooks/useUrlId";
import useGetCollectionFlashCards from "../collection/hooks/useGetCollectionFlashcards";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import Flashcard from "./components/Flashcard";
import { HandIcon, ArrowLeftRight } from "lucide-react";
import { motion } from "framer-motion";

const ReviewPage = () => {
  const collectionId = useUrlId("id");
  const { data } = useGetCollectionFlashCards(collectionId ?? "");

  return (
    <div className="flex flex-col items-center justify-top md:justify-center w-full h-[100dvh] bg-background overflow-hidden">
      <h1 className="align-text-top mb-10">{data?.data.collection.name}</h1>
      <Carousel
        className="w-full max-w-2xl h-[70vh]"
        opts={{
          align: "center",
          loop: false,
        }}
      >
        <CarouselContent>
          {data?.data.flashcards.map((card, index) => (
            <CarouselItem
              key={index}
              className="basis-full flex justify-center items-center h-[500px]"
            >
              <Flashcard front={card.question} back={card.answer} />
            </CarouselItem>
          ))}
        </CarouselContent>

        <motion.div
          className="flex items-center justify-center gap-4 mt-6"
          animate={{ opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <HandIcon className="w-5 h-5" />
          <ArrowLeftRight className="w-5 h-5" />
          <span className="text-sm font-medium">Swipe to navigate</span>
        </motion.div>

        <div className="flex items-center justify-center gap-4 mt-6">
          <CarouselPrevious className="static translate-y-0" />
          <CarouselNext className="static translate-y-0" />
        </div>
      </Carousel>
    </div>
  );
};

export default ReviewPage;
