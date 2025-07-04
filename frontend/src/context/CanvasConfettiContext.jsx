// frontend/src/context/CanvasConfettiContext.jsx
import React, { createContext, useRef } from "react";
import ReactCanvasConfetti from "react-canvas-confetti";

export const CanvasConfettiContext = createContext();

export function CanvasConfettiProvider({ children }) {
    const ref = useRef();

    const fire = (opts = {}) => {
        console.log("fire called", ref.current);
        if (ref.current && typeof ref.current.fire === "function") {
            ref.current.fire({
                particleCount: 100,
                spread: 70,
                origin: { y: 0.6 },
                ...opts
            });
        }
    };

    return (
        <CanvasConfettiContext.Provider value={{ fire }}>
            <ReactCanvasConfetti
                ref={ref}
                style={{
                    position: "fixed",
                    pointerEvents: "none",
                    width: "100vw",
                    height: "100vh",
                    top: 0,
                    left: 0,
                    zIndex: 9999
                }}
            />
            {children}
        </CanvasConfettiContext.Provider>
    );
}