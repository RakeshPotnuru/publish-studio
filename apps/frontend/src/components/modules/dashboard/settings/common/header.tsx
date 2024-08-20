import React from "react";

import { Heading } from "@/components/ui/heading";

interface HeaderProps {
  children: React.ReactNode;
  title: string;
  description?: string;
}

export default function Header({
  children,
  title,
  description,
}: Readonly<HeaderProps>) {
  return (
    <div className="space-y-8">
      <div className="space-y-2">
        <Heading>{title}</Heading>
        {description && <p className="text-muted-foreground">{description}</p>}
      </div>
      {children}
    </div>
  );
}
