import { createFileRoute } from "@tanstack/react-router";
import Timer from "../components/timer/timer";

export const Route = createFileRoute("/")({
  component: Index,
});

function Index() {
  return <Timer />;
}
