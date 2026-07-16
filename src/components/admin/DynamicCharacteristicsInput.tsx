"use client";

import React, { useState } from "react";
import { Plus, Trash2 } from "lucide-react";

interface Characteristic {
  name: string;
  value: string;
}

export const DynamicCharacteristicsInput = ({ initialCharacteristics }: { initialCharacteristics?: Characteristic[] }) => {
  const [characteristics, setCharacteristics] = useState<Characteristic[]>(initialCharacteristics || []);

  React.useEffect(() => {
    // Only load from autosave if we are not editing an existing item
    if (initialCharacteristics && initialCharacteristics.length > 0) return;

    try {
      // First check if the FormAutoSaver saved the whole form
      const savedForm = localStorage.getItem("autosave_new-item-form");
      if (savedForm) {
        const data = JSON.parse(savedForm);
        if (data.characteristics_json) {
          setCharacteristics(JSON.parse(data.characteristics_json));
        }
      }
    } catch (e) {
      console.error("Failed to load characteristics from autosave", e);
    }
  }, []);

  const addCharacteristic = () => {
    setCharacteristics([...characteristics, { name: "", value: "" }]);
  };

  const removeCharacteristic = (index: number) => {
    setCharacteristics(characteristics.filter((_, i) => i !== index));
  };

  const updateCharacteristic = (index: number, field: "name" | "value", newValue: string) => {
    const newChars = [...characteristics];
    newChars[index][field] = newValue;
    setCharacteristics(newChars);
  };

  return (
    <div className="flex flex-col gap-4">
      {/* Hidden input to pass the JSON stringified data to the server action */}
      <input type="hidden" name="characteristics_json" value={JSON.stringify(characteristics)} />

      <label className="block text-sm font-medium text-zinc-400">
        Динамічні характеристики
      </label>

      {characteristics.map((char, index) => (
        <div key={index} className="flex items-center gap-3">
          <input
            type="text"
            placeholder="Назва (напр. Колір)"
            value={char.name}
            onChange={(e) => updateCharacteristic(index, "name", e.target.value)}
            className="flex-1 bg-zinc-950 text-white border border-zinc-800 rounded-xl px-4 py-3 focus:outline-none focus:border-brand-500 transition-colors"
          />
          <input
            type="text"
            placeholder="Значення (напр. Чорний)"
            value={char.value}
            onChange={(e) => updateCharacteristic(index, "value", e.target.value)}
            className="flex-1 bg-zinc-950 text-white border border-zinc-800 rounded-xl px-4 py-3 focus:outline-none focus:border-brand-500 transition-colors"
          />
          <button
            type="button"
            onClick={() => removeCharacteristic(index)}
            className="p-3 text-red-500 hover:bg-red-500/10 rounded-xl transition-colors"
          >
            <Trash2 size={20} />
          </button>
        </div>
      ))}

      <button
        type="button"
        onClick={addCharacteristic}
        className="flex items-center justify-center gap-2 border border-dashed border-zinc-700 text-zinc-400 hover:border-brand-500 hover:text-white rounded-xl py-3 transition-colors"
      >
        <Plus size={20} />
        <span className="font-medium">Додати характеристику</span>
      </button>
    </div>
  );
};
