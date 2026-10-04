import React, { useEffect, useState } from "react";

const UNITS = [
  ["일", 86400],
  ["시간", 3600],
  ["분", 60],
  ["초", 1],
];

const remainingFrom = (target) => {
  const diff = Math.max(0, target.getTime() - Date.now());
  let left = Math.floor(diff / 1000);

  return UNITS.map(([label, size]) => {
    const value = Math.floor(left / size);
    left -= value * size;
    return { label, value };
  });
};

/** 예식까지 남은 시간. `target`은 Date. */
const Countdown = ({ target }) => {
  const [parts, setParts] = useState(() => remainingFrom(target));

  useEffect(() => {
    const id = setInterval(() => setParts(remainingFrom(target)), 1000);
    return () => clearInterval(id);
  }, [target]);

  const past = target.getTime() - Date.now() <= 0;

  if (past) {
    return (
      <div className="countdown-done">
        저희 결혼했습니다. 함께해 주셔서 감사합니다.
      </div>
    );
  }

  return (
    <div className="countdown" aria-label="예식까지 남은 시간">
      {parts.map(({ label, value }) => (
        <div className="countdown-cell" key={label}>
          <span className="countdown-value">
            {String(value).padStart(2, "0")}
          </span>
          <span className="countdown-label">{label}</span>
        </div>
      ))}
    </div>
  );
};

export default Countdown;
