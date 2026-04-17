import { createFileRoute } from "@tanstack/react-router";
import { Navigation } from "~/components/portfolio/Navigation";
import { Hero } from "~/components/portfolio/Hero";
import { About } from "~/components/portfolio/About";
import { Experience } from "~/components/portfolio/Experience";
import { Skills } from "~/components/portfolio/Skills";
import { Projects } from "~/components/portfolio/Projects";
import { Services } from "~/components/portfolio/Services";
import { Contact } from "~/components/portfolio/Contact";

export const Route = createFileRoute("/")({
  component: Home,
});

function Home() {
  return (
    <div className="min-h-screen">
      <Navigation />
      <main>
        <Hero />
        <About />
        <Experience />
        <Skills />
        <Projects />
        <Services />
        <Contact />
      </main>
    </div>
  );
}
