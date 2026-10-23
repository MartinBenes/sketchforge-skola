import { publicPath } from "@/lib/publicPath";
import type { Metadata } from "next";
import { EditorModeProvider } from "@/components/EditorModeProvider";
import "./globals.css";

export const metadata: Metadata = {
  title: "SketchForge – 3D editor",
  description: "Pracovní prostředí 3D editoru SketchForge v prohlížeči",
  icons: {
    icon: publicPath("assets/sketchforge/sketchforge-logo.png"),
    apple: publicPath("assets/sketchforge/sketchforge-logo.png"),
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="cs" style={{ colorScheme: "light" }}>
      <body suppressHydrationWarning><EditorModeProvider>{children}</EditorModeProvider></body>
    </html>
  );
}
