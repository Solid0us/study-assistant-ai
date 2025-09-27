import { useGetCollections } from "./hooks/useGetCollections";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import AddNewCollectionForm from "./components/AddNewCollectionForm";
import { useState } from "react";

const CollectionsPage = () => {
  const { data } = useGetCollections();
  const [isCollectionFormOpen, setIsCollectionFormOpen] = useState(false);
  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 to-rose-50 p-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-amber-700">Your Collections</h1>
        <Dialog
          open={isCollectionFormOpen}
          onOpenChange={setIsCollectionFormOpen}
        >
          <DialogTrigger asChild>
            <Button className="flex items-center gap-2">
              <Plus className="h-4 w-4" />
              Add New Collection
            </Button>
          </DialogTrigger>
          <DialogContent
            onPointerDownOutside={(e) => e.preventDefault()}
            className="sm:max-w-md rounded-2xl"
          >
            <DialogHeader>
              <DialogTitle>Add a New Collection</DialogTitle>
              <DialogDescription>
                Give your collection a name and description to get started.
              </DialogDescription>
            </DialogHeader>

            <AddNewCollectionForm
              setIsCollectionFormOpen={setIsCollectionFormOpen}
            />
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {data ? (
          data.data.collections.map((collection) => (
            <Card
              key={collection.id}
              className="shadow-md rounded-2xl hover:scale-105 duration-100"
            >
              <CardHeader>
                <CardTitle>{collection.name}</CardTitle>
                <CardDescription className="italic">
                  {collection.description}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-500">
                  Created on{" "}
                  {new Date(collection.created_at).toLocaleDateString()}
                </p>
              </CardContent>
            </Card>
          ))
        ) : (
          <p>Your collection is empty!</p>
        )}
      </div>
    </div>
  );
};

export default CollectionsPage;
