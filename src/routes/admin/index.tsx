import { createFileRoute } from "@tanstack/react-router";
import { AdminDashboard } from "~/components/routes/admin/index";

export const Route = createFileRoute("/admin/")({
  component: AdminDashboard,
});
