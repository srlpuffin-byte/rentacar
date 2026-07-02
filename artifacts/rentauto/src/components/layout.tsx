import { Navbar } from "./navbar";
import { Footer } from "./footer";
import { CartSidebar } from "./cart-sidebar";

export function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground">
      <Navbar />
      <main className="flex-1 flex flex-col">
        {children}
      </main>
      <Footer />
      <CartSidebar />
    </div>
  );
}
