import type { CSSProperties, ReactNode } from "react";
import { Icons } from "../../../../components/icons";
import type { TurnIconProps } from "../types";

export function TurnIcon({ action, direction, compact = false }: TurnIconProps) {
  const isRightTurn =
    action === "turn" && direction?.toLowerCase().includes("right") === true;
  const style: CSSProperties | undefined = isRightTurn
    ? { transform: "scaleX(-1)" }
    : undefined;

  return (
    <span
      className={`flex shrink-0 items-center justify-center rounded-full bg-accent-subtle text-accent-light ${
        compact ? "h-9 w-9" : "h-14 w-14"
      }`}
    >
      {renderTurnIcon(action, compact ? 19 : 30, style)}
    </span>
  );
}

function renderTurnIcon(
  action: string,
  size: number,
  style?: CSSProperties
): ReactNode {
  const normalizedAction = action.toLowerCase();
  const props = { size, stroke: 2.4, style };

  if (normalizedAction === "depart") {
    return <Icons.NavigationDepart {...props} />;
  }
  if (normalizedAction === "arrive") {
    return <Icons.NavigationArrive {...props} />;
  }
  if (normalizedAction.includes("roundabout")) {
    return <Icons.NavigationRoundabout {...props} />;
  }
  if (normalizedAction.includes("turn")) {
    return <Icons.NavigationTurn {...props} />;
  }
  return <Icons.NavigationStraight {...props} />;
}
