import { useSyncExternalStore } from "react";
import {
  applyTextSize,
  getNextTextSize,
  getTextSize,
  subscribeTextSize,
} from "../utils/textSize.js";

const SIZE_LABELS = {
  standard: "standard",
  large: "large",
  larger: "extra large",
};

export default function TextSizeToggle({ className = "" }) {
  const size = useSyncExternalStore(subscribeTextSize, getTextSize, () => "standard");
  const nextSize = getNextTextSize(size);
  const label =
    size === "larger"
      ? `Text size: ${SIZE_LABELS[size]}. Click to reset to standard.`
      : `Text size: ${SIZE_LABELS[size]}. Click to enlarge.`;

  return (
    <button
      type="button"
      className={`text-size-toggle ${className}`}
      onClick={() => applyTextSize(nextSize)}
      aria-label={label}
      aria-pressed={size !== "standard"}
      title={label}
    >
      <span aria-hidden="true">Aa</span>
    </button>
  );
}
