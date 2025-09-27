import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useCreateCollection } from "../hooks/useCreateColllection";
import { useGetCollections } from "../hooks/useGetCollections";

interface AddNewCollectionFormProps {
  setIsCollectionFormOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

const collectionFormSchema = z.object({
  name: z.string().min(1, {
    error: "Name must not be empty.",
  }),
  description: z.string().max(500, {
    error: "Must not exceed 500 characters",
  }),
});

const AddNewCollectionForm = ({
  setIsCollectionFormOpen,
}: AddNewCollectionFormProps) => {
  const { mutate } = useCreateCollection({
    onSuccess: () => {
      refetch();
      setIsCollectionFormOpen(false);
    },
    onError: (error) => {
      alert(error);
    },
  });
  const { refetch } = useGetCollections();
  const form = useForm<z.infer<typeof collectionFormSchema>>({
    resolver: zodResolver(collectionFormSchema),
    defaultValues: {
      name: "",
      description: "",
    },
  });
  const handleSubmit = (values: z.infer<typeof collectionFormSchema>) => {
    mutate(values);
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(handleSubmit)}
        className="grid gap-4 py-4"
      >
        <div className="grid gap-2">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Name</FormLabel>
                <FormControl>
                  <Input placeholder="e.g. Physics Formulas" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <div className="grid gap-2">
          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Description</FormLabel>
                <FormControl>
                  <Textarea
                    className="min-h-24"
                    placeholder="Brief description..."
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <Button type="submit">Save</Button>
      </form>
    </Form>
  );
};

export default AddNewCollectionForm;
