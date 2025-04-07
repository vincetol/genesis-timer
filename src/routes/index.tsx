import { createFileRoute } from "@tanstack/react-router";
import Timer from "../components/timer/timer";
import Wave from "../components/wave/wave";

export const Route = createFileRoute("/")({
  component: Index,
});

function Index() {
  return (
    <>
      <Timer />
      <Wave />
    </>
  );
}
