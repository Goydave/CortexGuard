import { BottomNav } from "@/components/cortex-mobile/bottom-nav";

export function MobileLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="bg-background flex justify-center items-start min-h-dvh">
      <div className="relative w-full max-w-3xl h-dvh bg-background flex flex-col">
        <main className="flex-1 overflow-y-auto pb-24 no-scrollbar">
          {children}
        </main>
        <BottomNav />
      </div>
    </div>
  );
}
