"use client";
import { useState } from "react";
import type React from "react";

import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Field, FieldError, FieldLabel } from "@/components/ui/field";

interface SkillsInputProps {
  value: string[];
  onChange: (skills: string[]) => void;
  invalid?: boolean;
  error?: any;
}

export const SkillsInput = ({ value = [], onChange, invalid, error }: SkillsInputProps) => {
  const [input, setInput] = useState("");

  const handleAddSkill = () => {
    const trimmedInput = input.trim();
    if (trimmedInput && !value.includes(trimmedInput)) {
      onChange([...value, trimmedInput]);
      setInput("");
    }
  };

  const handleRemoveSkill = (index: number) => {
    onChange(value.filter((_, i) => i !== index));
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleAddSkill();
    }
  };

  return (
    <Field data-invalid={invalid} className="gap-1 col-span-2">
      <FieldLabel>Add Skills</FieldLabel>
      <div className="space-y-3">
        <div className="flex relative">
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Enter a skill and press Enter"
            className="h-11 flex-1 pr-16"
            aria-invalid={invalid}
          />
          <Button
            type="button"
            onClick={handleAddSkill}
            className="absolute top-0 right-0 h-full px-4 rounded-l-none disabled:opacity-100"
            disabled={!input.trim()}
          >
            Add
          </Button>
        </div>

        {value.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {value.map((skill, index) => (
              <div
                key={index}
                className="inline-flex items-center gap-2 px-3 py-1 bg-primary/10 border border-primary/20 rounded-full text-sm"
              >
                {skill}
                <button
                  type="button"
                  onClick={() => handleRemoveSkill(index)}
                  className="hover:text-destructive transition"
                  aria-label={`Remove ${skill}`}
                >
                  <X className="size-4" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
      {invalid && <FieldError errors={[error]} />}
    </Field>
  );
};
