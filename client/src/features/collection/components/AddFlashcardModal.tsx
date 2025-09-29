import {
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useState } from "react";
import AddFlashcardForm from "./AddFlashcardForm";
import z from "zod";
import { useFieldArray, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import AIGenerateFlashcardForm from "./AIGenerateFlashcardForm";

export const flashcardFormSchema = z.object({
  flashcards: z.array(
    z.object({
      question: z.string().min(1, {
        error: "Name must not be empty.",
      }),
      answer: z
        .string()
        .min(1, {
          error: "Answer cannot be empty",
        })
        .max(500, {
          error: "Must not exceed 500 characters",
        }),
    })
  ),
});

export const aiGenerateFlashcardFormSchema = z.object({
  number: z
    .number()
    .min(1, {
      error: "You must generate at least one flashcard",
    })
    .max(25, {
      error: "Cannot generate more than 25 cards at a time.",
    }),
  subject: z
    .string()
    .min(1, {
      error: "Subject must not be empty.",
    })
    .max(50, {
      error: "Subject cannot exceed 50 characters.",
    }),
  description: z.string().max(255, {
    error: "Description cannot exceed 255 characters.",
  }),
});

interface AddFlashcardModalProps {
  setIsCreateFlashcardModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

const AddFlashcardModal = ({
  setIsCreateFlashcardModalOpen,
}: AddFlashcardModalProps) => {
  const [tab, setTab] = useState("create");

  const addFlashcardForm = useForm<z.infer<typeof flashcardFormSchema>>({
    defaultValues: {
      flashcards: [{ question: "", answer: "" }],
    },
    resolver: zodResolver(flashcardFormSchema),
  });

  const addFlashcardFieldArray = useFieldArray({
    control: addFlashcardForm.control,
    name: "flashcards",
  });

  const aiGenerateFlashcardForm = useForm<
    z.infer<typeof aiGenerateFlashcardFormSchema>
  >({
    defaultValues: {
      number: 1,
      subject: "",
      description: "",
    },
    resolver: zodResolver(aiGenerateFlashcardFormSchema),
  });
  return (
    <DialogContent
      onPointerDownOutside={(e) => e.preventDefault()}
      className="max-w-11/12 flex flex-col"
    >
      <DialogHeader className="h-4">
        <DialogTitle>Add Flashcards</DialogTitle>
      </DialogHeader>
      <Tabs defaultValue="create" value={tab} onValueChange={setTab}>
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="create">Create</TabsTrigger>
          <TabsTrigger value="ai">Let AI Help</TabsTrigger>
        </TabsList>
        <TabsContent value="create" className="space-y-4 flex-col">
          <AddFlashcardForm
            form={addFlashcardForm}
            fieldArray={addFlashcardFieldArray}
            setIsCreateFlashcardModalOpen={setIsCreateFlashcardModalOpen}
          />
        </TabsContent>

        <TabsContent value="ai" className="space-y-4 mt-4">
          <AIGenerateFlashcardForm
            aiGenerateFlashcardForm={aiGenerateFlashcardForm}
            addFlashcardFieldArray={addFlashcardFieldArray}
            setTab={setTab}
          />
        </TabsContent>
      </Tabs>
    </DialogContent>
  );
};

export default AddFlashcardModal;
