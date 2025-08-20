import Link from "next/link";
import { Button } from "../ui/button";

const Navbar = () => {
  return (
    <nav className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between px-4 md:px-8">
        <div className="flex items-center space-x-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
            <svg
              className="h-5 w-5 text-primary-foreground"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
              />
            </svg>
          </div>
          <span className="text-xl font-bold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
            StudySmart
          </span>
        </div>

        <div className="hidden md:flex items-center space-x-6">
          <a
            href="#about"
            className="text-lg font-medium text-muted-foreground hover:text-primary transition-colors"
          >
            About
          </a>
          <a
            href="#features"
            className="text-lg font-medium text-muted-foreground hover:text-primary transition-colors"
          >
            Features
          </a>

          {/* <a
            href="#pricing"
            className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors"
          >
            Pricing
          </a> */}
        </div>

        <div className="flex items-center space-x-3">
          <Button variant="ghost" className="hidden sm:inline-flex" asChild>
            <Link href="/Login">Login</Link>
          </Button>
          <Button
            className="bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary"
            asChild
          >
            <Link href="/Signup">Get Started</Link>
          </Button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
