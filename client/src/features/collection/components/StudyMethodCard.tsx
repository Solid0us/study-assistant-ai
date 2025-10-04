import React from "react";
import { useNavigate } from "react-router";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

interface StudyMethodCardProps {
  title: string;
  description: string;
  link: string;
  icon: React.ReactNode;
}

const StudyMethodCard = ({
  title,
  description,
  icon,
  link,
}: StudyMethodCardProps) => {
  const navigate = useNavigate();
  return (
    <Card
      onClick={() => navigate(link)}
      className="hover:shadow-md transition-shadow cursor-pointer min-w-64 sm:min-w-96 rounded-2xl border-4 border-rose-100 hover:border-rose-200"
    >
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent>{icon}</CardContent>
    </Card>
  );
};

export default StudyMethodCard;
