import { Navbar } from "@/app/components/Navbar";
import { PlumbingLanding } from "@/app/components/PlumbingLanding";
import { Footer } from "@/app/components/Footer";

export default function Home() {
  return (
    <div className="flex flex-1 flex-col bg-background font-sans text-foreground">
      <Navbar />
      <main className="flex w-full flex-1 flex-col">
        <PlumbingLanding />
        <Footer />
      </main>
    </div>
  );
}
