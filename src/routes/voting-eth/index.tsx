import { createFileRoute } from "@tanstack/react-router";
import { VotingEthPage } from "~/components/routes/voting-eth/index";

export const Route = createFileRoute("/voting-eth/")({
  component: VotingEthPage,
});
