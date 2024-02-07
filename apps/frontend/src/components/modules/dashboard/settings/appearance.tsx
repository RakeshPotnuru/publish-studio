"use client";

import { useEffect, useState } from "react";
import Image from "next/image";

import { RadioGroup, RadioGroupItem } from "@itsrakesh/ui";
import { useTheme } from "next-themes";

import { Images } from "@/assets/images";
import { Heading } from "@/components/ui/heading";

export function Appearance() {
  const [mounted, setMounted] = useState(false);
  const { theme, setTheme } = useTheme();

  useEffect(() => setMounted(true), []);

  if (!mounted) return null;

  return (
    <div>
      <div className="space-y-2">
        <Heading>Appearance</Heading>
        <p className="text-muted-foreground">Select your preferred theme</p>
      </div>
      <RadioGroup
        defaultValue={theme}
        onValueChange={(value) => setTheme(value)}
        className="mt-8 flex flex-row space-x-4"
      >
        <div className="space-y-2">
          <div className="grid grid-cols-2 items-center space-x-4 rounded-lg border bg-white p-4">
            <RadioGroupItem value="light" />
            <Image
              src={Images.logo}
              alt="Light theme"
              width={25}
              height={25}
              className="rounded-md"
            />
          </div>
          <p className="text-center">Light</p>
        </div>
        <div className="space-y-2">
          <div className="grid grid-cols-2 items-center space-x-4 rounded-lg border bg-black p-4">
            <RadioGroupItem value="dark" />
            <Image
              src={Images.logo}
              alt="Dark theme"
              width={25}
              height={25}
              className="rounded-md"
            />
          </div>
          <p className="text-center">Dark</p>
        </div>
        <div className="space-y-2">
          <div className="grid grid-cols-2 items-center rounded-lg border">
            <div className="rounded-l-lg bg-white p-4">
              <RadioGroupItem value="system" />
            </div>
            <div className="rounded-r-lg bg-black p-4">
              <Image
                src={Images.logo}
                alt="System theme"
                width={25}
                height={25}
                className="rounded-md"
              />
            </div>
          </div>
          <p className="text-center">System</p>
        </div>
      </RadioGroup>
    </div>
  );
}
