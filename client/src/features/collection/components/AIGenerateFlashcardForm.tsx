import { type UseFieldArrayReturn, type UseFormReturn } from "react-hook-form";
import type z from "zod";
import type { aiGenerateFlashcardFormSchema } from "./AddFlashcardModal";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import useAiGenerateFlashcards from "../hooks/useAiGenerateFlashcards";

interface AIGenerateFlashcardFormProps {
  aiGenerateFlashcardForm: UseFormReturn<
    {
      number: number;
      subject: string;
      description: string;
    },
    any,
    {
      number: number;
      subject: string;
      description: string;
    }
  >;
  addFlashcardFieldArray: UseFieldArrayReturn<
    {
      flashcards: {
        question: string;
        answer: string;
      }[];
    },
    "flashcards",
    "id"
  >;
  setTab: React.Dispatch<React.SetStateAction<string>>;
}

const AIGenerateFlashcardForm = ({
  aiGenerateFlashcardForm,
  addFlashcardFieldArray,
  setTab,
}: AIGenerateFlashcardFormProps) => {
  const { mutate, isPending } = useAiGenerateFlashcards({
    onSuccess: (data) => {
      data.data.flashcards.forEach((card) => {
        addFlashcardFieldArray.append({
          question: card.question,
          answer: card.answer,
        });
      });
      setTab("create");
    },
  });
  const handleSubmit = (
    values: z.infer<typeof aiGenerateFlashcardFormSchema>
  ) => {
    mutate(values);
  };
  return (
    <Form {...aiGenerateFlashcardForm}>
      <form onSubmit={aiGenerateFlashcardForm.handleSubmit(handleSubmit)}>
        <div className="max-h-[65vh] sm:max-h-[60vh]">
          <FormField
            control={aiGenerateFlashcardForm.control}
            name="subject"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Input placeholder="Subject (e.g., Biology)" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={aiGenerateFlashcardForm.control}
            name="number"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Input
                    type="number"
                    placeholder="Number of cards"
                    {...field}
                    {...aiGenerateFlashcardForm.register("number", {
                      valueAsNumber: true,
                    })}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={aiGenerateFlashcardForm.control}
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Textarea placeholder="Optional description" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <Button
          className={`${isPending && "pointer-events-none opacity-30"}`}
          type="submit"
        >
          Generate Flashcards
        </Button>
      </form>
    </Form>
  );
};

export default AIGenerateFlashcardForm;
