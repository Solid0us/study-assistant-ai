import type { JSX } from "react";

export type SidebarItemProps = {
  icon: JSX.Element;
  text: string;
  isOpen: boolean;
  path: string;
};

export type CollectionsResponse = {
  collections: {
    id: string;
    name: string;
    description?: string;
    user_id: string;
    created_at: Date;
  }[];
};

export type CreateCollectionBody = {
  name: string;
  description: string;
};
