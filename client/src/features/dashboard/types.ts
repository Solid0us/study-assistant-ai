import type { JSX } from "react";

export type SidebarItemProps = {
  icon: JSX.Element;
  text: string;
  isOpen: boolean;
  path: string;
};
