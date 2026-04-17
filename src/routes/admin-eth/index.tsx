import { createFileRoute } from "@tanstack/react-router";
import { AdminEthDashboard } from "~/components/routes/admin-eth/index";

export const Route = createFileRoute("/admin-eth/")({
  component: AdminEthDashboard,
});
