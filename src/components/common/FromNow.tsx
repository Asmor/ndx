import { useEffect, useState } from "react";
import moment from "moment";

interface FromNowProps {
  date: Date;
  intervalMs?: number;
}

export default function FromNow({ date, intervalMs = 5000 }: FromNowProps) {
  const [, setTick] = useState(0);

  useEffect(() => {
    const id = setInterval(() => setTick((t) => t + 1), intervalMs);
    return () => clearInterval(id);
  }, [intervalMs]);

  const momentDate = moment(date);

  let text = momentDate.fromNow();

  if (text === "a few seconds ago") text = "less than a minute ago";

  return (
    <span
      data-tooltip-id="tooltip"
      data-tooltip-content={moment(date).calendar()}
    >
      {text}
    </span>
  );
}
