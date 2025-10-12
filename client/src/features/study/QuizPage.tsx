import useUrlId from "@/hooks/useUrlId";
import useGetCollectionFlashCards from "../collection/hooks/useGetCollectionFlashcards";
import Flashcard from "./components/Flashcard";
import type { FlashcardSchema } from "@/types";
import { useEffect, useRef, useState } from "react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";
import { type CarouselApi } from "@/components/ui/carousel";
import { Button } from "@/components/ui/button";
import ConfidenceScoreButtons from "./components/ConfidenceScoreButtons";
import useCreateScore from "./hooks/useCreateScore";
import EncouragementMessage from "./components/EncouragementMessage";
import { Spinner } from "@/components/ui/spinner";

const shuffleCards = (flashcards: FlashcardSchema[]) => {
  const copy = [...flashcards];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
};

const QuizPage = () => {
  const { data } = useGetCollectionFlashCards(useUrlId("id") ?? "");
  const [shuffledCards, setShuffledCards] = useState<FlashcardSchema[]>([]);
  const hasShuffled = useRef(false);
  const [emblaApi, setEmblaApi] = useState<CarouselApi>();
  const [didFlip, setDidFlip] = useState(false);
  const [currentFlashcardIndex, setCurrentFlashcardIndex] = useState(0);
  const [score, setScore] = useState<number | null>(null);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const { mutate, isPending } = useCreateScore(
    shuffledCards[currentFlashcardIndex]?.id,
    {
      onSuccess: () => {
        setIsSubmitted(true);
      },
    }
  );
  const handleFlip = () => {
    setDidFlip(true);
  };

  const handleScrollNext = () => {
    emblaApi?.scrollNext();
    setDidFlip(false);
    setIsSubmitted(false);
    setScore(null);
    setCurrentFlashcardIndex((prev) => prev + 1);
  };

  const handleScoreSelect = (score: number) => {
    setScore(score);
  };

  const submitScore = () => {
    if (score) {
      mutate({
        confidence_level: score,
      });
    }
  };

  useEffect(() => {
    if (!hasShuffled.current && data?.data.flashcards.length) {
      setShuffledCards(shuffleCards(data.data.flashcards));
      hasShuffled.current = true;
    }
  }, [data?.data.flashcards]);

  return (
    <div className="flex flex-col items-center justify-top md:justify-center w-full h-[100dvh] bg-background overflow-hidden">
      <Carousel
        setApi={setEmblaApi}
        className="w-full max-w-2xl h-[70vh]"
        opts={{
          align: "center",
          loop: false,
          watchDrag: false,
        }}
      >
        <CarouselContent>
          {shuffledCards.map((card, index) => (
            <CarouselItem
              key={index}
              className="basis-full flex justify-center items-center h-[500px] p-0"
            >
              <Flashcard
                front={card.question}
                back={card.answer}
                handleClick={handleFlip}
              />
            </CarouselItem>
          ))}
        </CarouselContent>
        <div className="flex flex-col items-center gap-4 p-4">
          {didFlip && !isSubmitted && (
            <>
              <ConfidenceScoreButtons onSelect={handleScoreSelect} />
              {score && <Button onClick={submitScore}>Submit Score</Button>}
              {isPending && <Spinner />}
            </>
          )}
          {isSubmitted && (
            <div className="flex flex-col items-center gap-4">
              <EncouragementMessage score={score ?? 1} />
              <Button onClick={handleScrollNext}>Next</Button>
            </div>
          )}
        </div>
      </Carousel>
    </div>
  );
};

export default QuizPage;
