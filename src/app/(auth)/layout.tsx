import type { ReactNode } from "react";

export default function AuthLayout({ children }: { children: ReactNode }) {
  return (
    
        <div className="min-h-screen flex flex-col items-center justify-center">
          <div className="w-full max-w-lg p-6">{children}</div>
        </div>
      
  );
}