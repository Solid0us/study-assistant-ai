import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { MoreVertical, Plus } from "lucide-react";
import useGetCollectionFlashCards from "./hooks/useGetCollectionFlashcards";
import { Dialog, DialogTrigger } from "@/components/ui/dialog";
import AddFlashcardModal from "./components/AddFlashcardModal";
import { useState } from "react";

export const getCollectionIdFromPath = () => {
  const paths = window.location.pathname.split("/");
  return paths[paths.length - 1];
};

const CollectionPage = () => {
  const { data } = useGetCollectionFlashCards(getCollectionIdFromPath());
  const [isCreateFlashcardModalOpen, setIsCreateFlashcardModalOpen] =
    useState(false);
  return (
    <div className="p-6 space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">{data?.data.collection.name}</h1>
          <p className="text-gray-600">
            {data?.data.collection.description
              ? data?.data.collection.description
              : "No description"}
          </p>
          <div className="text-sm text-gray-500 mt-1">
            Created:{" "}
            {data?.data &&
              new Date(data?.data.collection.created_at).toLocaleString()}
          </div>
        </div>
        <div className="flex gap-2">
          <Dialog
            open={isCreateFlashcardModalOpen}
            onOpenChange={setIsCreateFlashcardModalOpen}
          >
            <DialogTrigger asChild>
              <Button variant="default" className="flex items-center gap-2">
                <Plus className="w-4 h-4" /> Add Flashcard
              </Button>
            </DialogTrigger>
            <AddFlashcardModal
              setIsCreateFlashcardModalOpen={setIsCreateFlashcardModalOpen}
            />
          </Dialog>

          <Button variant="outline">Edit Collection</Button>
          <Button variant="ghost">
            <MoreVertical className="w-5 h-5" />
          </Button>
        </div>
      </div>
      <Tabs defaultValue="flashcards" className="w-full">
        <TabsList className="grid w-full max-w-md grid-cols-2">
          <TabsTrigger value="flashcards">Flashcards</TabsTrigger>
          <TabsTrigger value="study">Study</TabsTrigger>
        </TabsList>

        <TabsContent
          value="flashcards"
          className="mt-6 grid gap-4 md:grid-cols-3"
        >
          {data?.data.flashcards && data?.data.flashcards.length > 0
            ? data.data.flashcards.map((flashcard) => (
                <Card
                  key={flashcard.id}
                  className="hover:shadow-md transition-shadow cursor-pointer"
                >
                  <CardHeader>
                    <CardTitle>{flashcard.question}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-600">{flashcard.answer}</p>
                  </CardContent>
                </Card>
              ))
            : "Deck is empty!"}
        </TabsContent>

        <TabsContent value="study" className="mt-6">
          <div className="flex flex-col items-center justify-center py-12 border rounded-lg bg-gray-50">
            <h2 className="text-xl font-semibold mb-4">Ready to Study?</h2>
            <Button size="lg" className="text-lg px-6 py-4">
              Start Studying
            </Button>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default CollectionPage;
