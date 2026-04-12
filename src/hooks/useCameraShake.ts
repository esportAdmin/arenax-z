"use client";

import { useEffect, useState } from "react";

export function useCameraShake(trigger: any, intensity = 6, duration = 180) {
  const [offset, setOffset] = useState({ x: 0, y: 0 });

  useEffect(() => {
    if (!trigger) return;

    let frame: number;
    const start = Date.now();

    function animate() {
      const elapsed = Date.now() - start;

      if (elapsed > duration) {
        setOffset({ x: 0, y: 0 });
        return;
      }

      setOffset({
        x: (Math.random() - 0.5) * intensity,
        y: (Math.random() - 0.5) * intensity,
      });

      frame = requestAnimationFrame(animate);
    }

    animate();

    return () => cancelAnimationFrame(frame);
  }, [trigger, duration, intensity]);

  return offset;
}
