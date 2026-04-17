import { createFileRoute } from "@tanstack/react-router";
import { AshleyForm } from "~/components/ashley/AshleyForm";

export const Route = createFileRoute("/ashley/")({
  component: AshleyPage,
});

function AshleyPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-800">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">Ashley</h1>
          <p className="text-purple-200">Secure Multi-Step Student Registration System</p>
        </div>
        <AshleyForm />
      </div>
    </div>
  );
}
