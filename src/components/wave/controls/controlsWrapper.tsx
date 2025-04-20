import { useState } from "react";

export default function ControlsWrapper() {
  const [expanded, setExpanded] = useState(false);
  const handleClick = () => {
    setExpanded((prev) => !prev);
  };
  return (
    <div>
      <button onClick={handleClick}>Header</button>
      <div>controls</div>
    </div>
  );
}
