"use client";

import { useEffect } from "react";

export const FormAutoSaver = ({ formId }: { formId: string }) => {
  useEffect(() => {
    const form = document.getElementById(formId) as HTMLFormElement;
    if (!form) return;

    const storageKey = `autosave_${formId}`;

    // 1. Restore data on mount
    const saved = localStorage.getItem(storageKey);
    if (saved) {
      try {
        const data = JSON.parse(saved);
        Object.keys(data).forEach((key) => {
          const input = form.elements.namedItem(key);
          if (input) {
            // Handle RadioNodeList (multiple inputs with same name, e.g., radio buttons)
            if (input instanceof RadioNodeList) {
              const el = Array.from(input).find((el) => (el as HTMLInputElement).value === data[key]);
              if (el) (el as HTMLInputElement).checked = true;
            } 
            // Handle individual Checkbox
            else if (input instanceof HTMLInputElement && input.type === "checkbox") {
              input.checked = data[key] === "on" || data[key] === true;
            } 
            // Handle standard Inputs, Textareas, Selects
            else if (
              input instanceof HTMLInputElement ||
              input instanceof HTMLTextAreaElement ||
              input instanceof HTMLSelectElement
            ) {
              // Only restore if it's not a file input
              if (input.type !== "file") {
                input.value = data[key];
              }
            }
          }
        });
      } catch (e) {
        console.error("Failed to parse autosave data", e);
      }
    }

    // 2. Save data on change
    const handleChange = () => {
      const formData = new FormData(form);
      const data: Record<string, any> = {};
      formData.forEach((value, key) => {
        // Skip files
        if (value instanceof File) return;
        data[key] = value;
      });
      localStorage.setItem(storageKey, JSON.stringify(data));
    };

    // 3. Clear data on submit
    const handleSubmit = () => {
      localStorage.removeItem(storageKey);
    };

    form.addEventListener("input", handleChange);
    form.addEventListener("change", handleChange);
    form.addEventListener("submit", handleSubmit);

    return () => {
      form.removeEventListener("input", handleChange);
      form.removeEventListener("change", handleChange);
      form.removeEventListener("submit", handleSubmit);
    };
  }, [formId]);

  return null;
};
