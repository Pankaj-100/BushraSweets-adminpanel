// Layout.tsx
import React from "react";

interface LayoutProps {
  children: React.ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  return (
    <div className="w-[800px]">
      {/* 
        px-* → responsive horizontal padding
        mx-auto → centers the container
        max-w-screen-xl → limits maximum width on large screens
      */}
      {children}
    </div>
  );
}
