"use client";
import React, { useState } from "react";

export const EventOrderButton = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <button 
        onClick={() => setIsOpen(true)}
        className="px-6 py-3 bg-brand-600 hover:bg-brand-500 text-white rounded-md transition-colors font-medium shadow-md hover:shadow-lg"
      >
        Замовити банкет
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6 max-w-md w-full relative shadow-2xl">
            <button 
              onClick={() => setIsOpen(false)} 
              className="absolute top-4 right-4 text-zinc-400 hover:text-white text-xl transition-colors"
            >
              &times;
            </button>
            <h2 className="text-2xl font-bold mb-2">Замовлення банкету</h2>
            <p className="text-zinc-400 mb-6 text-sm">Залиште ваші дані, і ми зв'яжемося з вами для обговорення деталей.</p>
            
            <form className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-zinc-300 mb-1">Ваше ім'я</label>
                <input 
                  type="text" 
                  placeholder="Олександр" 
                  className="w-full bg-zinc-800 border border-zinc-700 rounded-lg p-3 text-white focus:outline-none focus:ring-2 focus:ring-brand-500" 
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-zinc-300 mb-1">Номер телефону</label>
                <input 
                  type="tel" 
                  placeholder="+380 (__) ___-__-__" 
                  className="w-full bg-zinc-800 border border-zinc-700 rounded-lg p-3 text-white focus:outline-none focus:ring-2 focus:ring-brand-500" 
                />
              </div>
              <button 
                type="button" 
                className="w-full bg-brand-600 hover:bg-brand-500 text-white rounded-lg py-3 mt-2 transition-colors font-semibold"
              >
                Відправити заявку
              </button>
            </form>
          </div>
        </div>
      )}
    </>
  );
};
