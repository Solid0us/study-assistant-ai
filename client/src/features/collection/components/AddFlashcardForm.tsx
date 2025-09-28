import { z } from "zod";
import { useFieldArray, type UseFormReturn } from "react-hook-form";
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
import { Trash } from "lucide-react";
import type { flashcardFormSchema } from "./AddFlashcardModal";
import useCreateFlashcards from "../hooks/useCreateFlashcards";
import { getCollectionIdFromPath } from "../CollectionPage";
import useGetCollectionFlashCards from "../hooks/useGetCollectionFlashcards";

interface AddFlashcardFormProps {
  setIsCreateFlashcardModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
  form: UseFormReturn<
    {
      flashcards: {
        question: string;
        answer: string;
      }[];
    },
    any,
    {
      flashcards: {
        question: string;
        answer: string;
      }[];
    }
  >;
}

const AddFlashcardForm = ({
  form,
  setIsCreateFlashcardModalOpen,
}: AddFlashcardFormProps) => {
  const { refetch } = useGetCollectionFlashCards(getCollectionIdFromPath());
  const { mutate } = useCreateFlashcards(getCollectionIdFromPath(), {
    onSuccess: () => {
      refetch();
      form.reset();
      setIsCreateFlashcardModalOpen(false);
    },
  });
  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "flashcards",
  });

  const handleSubmit = (values: z.infer<typeof flashcardFormSchema>) => {
    mutate(values);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)}>
        <div className="max-h-[65vh] sm:max-h-[60vh] overflow-auto duration 300">
          {fields.map((item, index) => (
            <div key={item.id} className="flex gap-x-2 pb-6">
              <div className="flex flex-col items-center gap-y-2">
                <p className="font-semibold">{index + 1}.</p>
                <Trash
                  onClick={() => remove(index)}
                  className={`fill-red-300 ${
                    fields.length === 1
                      ? "pointer-events-none opacity-30"
                      : "hover:cursor-pointer"
                  }`}
                />
              </div>
              <div className="grid gap-2 w-full">
                <FormField
                  control={form.control}
                  name={`flashcards.${index}.question`}
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Input placeholder="Question" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name={`flashcards.${index}.answer`}
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Textarea placeholder="Answer" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>
          ))}
        </div>
        <div className="flex gap-x-3">
          <Button
            variant="outline"
            type="button"
            onClick={() => append({ question: "", answer: "" })}
          >
            + Add Card
          </Button>
          <Button type="submit">Save Flashcards</Button>
        </div>
      </form>
    </Form>
  );
};

export default AddFlashcardForm;
