import { useState } from "react";
import { Button } from "@/components/ui/button";
import Suinose from "./assets/suinose.ico";
import Suinose67 from "./assets/suinose-67.gif";

type SuiseiIconProps = {
  animate?: boolean;
};

export function SuiseiIcon({ animate = false }: SuiseiIconProps) {
  const [hovered, setHovered] = useState(false);

  const isAnimating = hovered || animate;

  return (
    <Button
      variant="outline"
      size="icon"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      asChild
    >
      <a
        href="https://www.youtube.com/@HoshimachiSuisei/join"
        target="_blank"
        rel="noopener noreferrer"
      >
        <img src={isAnimating ? Suinose67 : Suinose} alt="My Icon" />
      </a>
    </Button>
  );
}
