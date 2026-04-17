import { createFileRoute } from "@tanstack/react-router";
import { VotingPage } from "~/components/routes/voting/index";

export const Route = createFileRoute("/voting/")({
  component: VotingPage,
});
