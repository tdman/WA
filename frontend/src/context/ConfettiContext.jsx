// frontend/src/contexts/ConfettiContext.jsx
import React, { createContext, useState } from "react";
import ReactConfetti from "react-confetti";
import { useWindowSize } from "@react-hook/window-size";

export const ConfettiContext = createContext();

export function ConfettiProvider({ children }) {
  const [showConfetti, setShowConfetti] = useState(false);
  const [width, height] = useWindowSize();

  return (
      <ConfettiContext.Provider value={{ showConfetti, setShowConfetti }}>
        {showConfetti && (
            <ReactConfetti
                width={width}
                height={height}
                style={{
                  position: "fixed",
                  top: 0,
                  left: 0,
                  pointerEvents: "none",
                  zIndex: 9999
                }}
            />
        )}
        {children}
      </ConfettiContext.Provider>
  );
}