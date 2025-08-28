import { BottomNav } from "@/components/cortex-mobile/bottom-nav";

export function MobileLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="bg-black flex justify-center items-start md:items-center min-h-screen">
      <div className="relative w-full max-w-md h-screen md:h-[90vh] md:max-h-[896px] bg-background md:border-[10px] md:border-neutral-800 md:rounded-[40px] md:shadow-2xl overflow-hidden flex flex-col">
        <div className="flex-1 overflow-y-auto pb-24 no-scrollbar">
          {children}
        </div>
        <BottomNav />
      </div>
    </div>
  );
}
