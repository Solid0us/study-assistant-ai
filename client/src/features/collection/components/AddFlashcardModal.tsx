import { Button } from "@/components/ui/button";
import {
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { useState } from "react";
import AddFlashcardForm from "./AddFlashcardForm";
import z from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

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

interface AddFlashcardModalProps {
  setIsCreateFlashcardModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

const AddFlashcardModal = ({
  setIsCreateFlashcardModalOpen,
}: AddFlashcardModalProps) => {
  const [tab, setTab] = useState("create");
  const [aiConfig, setAiConfig] = useState({
    subject: "",
    count: 5,
    description: "",
  });
  const handleGenerateAI = () => {
    console.log("Generating AI flashcards with:", aiConfig);
  };

  const form = useForm<z.infer<typeof flashcardFormSchema>>({
    defaultValues: {
      flashcards: [{ question: "", answer: "" }],
    },
    resolver: zodResolver(flashcardFormSchema),
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
            form={form}
            setIsCreateFlashcardModalOpen={setIsCreateFlashcardModalOpen}
          />
        </TabsContent>

        <TabsContent value="ai" className="space-y-4 mt-4">
          <div className="max-h-[65vh] sm:max-h-[60vh]">
            <Input
              placeholder="Subject (e.g., Biology)"
              value={aiConfig.subject}
              onChange={(e) =>
                setAiConfig({ ...aiConfig, subject: e.target.value })
              }
            />
            <Input
              type="number"
              placeholder="Number of cards"
              value={aiConfig.count}
              onChange={(e) =>
                setAiConfig({
                  ...aiConfig,
                  count: Number(e.target.value),
                })
              }
            />
            <Textarea
              placeholder="Optional description"
              value={aiConfig.description}
              onChange={(e) =>
                setAiConfig({ ...aiConfig, description: e.target.value })
              }
            />
          </div>
          <Button onClick={handleGenerateAI}>Generate Flashcards</Button>
        </TabsContent>
      </Tabs>
    </DialogContent>
  );
};

export default AddFlashcardModal;
