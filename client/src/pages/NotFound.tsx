import { Button } from "@/components/ui/button";
import { Link } from "wouter";

export default function NotFound() {
  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-background text-foreground px-4">
      <div className="text-center max-w-md">
        <p className="num text-7xl md:text-8xl font-semibold text-primary">404</p>
        <div className="minute-track my-8" />
        <h1 className="text-3xl mb-3">Off the dial</h1>
        <p className="text-muted-foreground mb-8">This page isn't part of the register. It may have moved, or never existed.</p>
        <Link href="/">
          <Button className="bg-primary text-primary-foreground hover:bg-primary/90">Back to dashboard</Button>
        </Link>
      </div>
    </div>
  );
}
