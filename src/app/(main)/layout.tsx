import { MobileLayout } from "@/components/cortex-mobile/mobile-layout";

export default function MainPagesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <MobileLayout>{children}</MobileLayout>;
}
