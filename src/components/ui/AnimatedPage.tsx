"use client";
import React, { useEffect, useState } from "react";

export const AnimatedPage = ({ children, className = "" }: { children: React.ReactNode, className?: string }) => {
  const [mounted, setMounted] = useState(false);
  
  useEffect(() => {
    setMounted(true);
  }, []);
  
  return (
    <div className={`transition-opacity duration-500 ease-in-out ${mounted ? "opacity-100" : "opacity-0"} ${className}`}>
      {children}
    </div>
  );
};
