"use client";

import * as React from "react";
import { useEffect, useRef, useState } from "react";

interface PupilProps {
  size?: number;
  maxDistance?: number;
  color?: string;
  forceLookX?: number;
  forceLookY?: number;
}

export function Pupil({
  size = 8,
  maxDistance = 4,
  color = "#0B1F3A",
  forceLookX,
  forceLookY,
}: PupilProps) {
  const [mouse, setMouse] = useState({ x: 0, y: 0 });
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onMove = (e: MouseEvent) => setMouse({ x: e.clientX, y: e.clientY });
    window.addEventListener("mousemove", onMove);
    return () => window.removeEventListener("mousemove", onMove);
  }, []);

  let x = 0;
  let y = 0;
  if (forceLookX !== undefined && forceLookY !== undefined) {
    x = forceLookX;
    y = forceLookY;
  } else if (ref.current) {
    const r = ref.current.getBoundingClientRect();
    const cx = r.left + r.width / 2;
    const cy = r.top + r.height / 2;
    const dx = mouse.x - cx;
    const dy = mouse.y - cy;
    const dist = Math.min(Math.sqrt(dx * dx + dy * dy), maxDistance);
    const angle = Math.atan2(dy, dx);
    x = Math.cos(angle) * dist;
    y = Math.sin(angle) * dist;
  }

  return (
    <div
      ref={ref}
      style={{
        width: size,
        height: size,
        borderRadius: "50%",
        background: color,
        transform: `translate(${x}px, ${y}px)`,
        transition: "transform 80ms ease-out",
      }}
    />
  );
}

interface EyeBallProps {
  size?: number;
  pupilSize?: number;
  maxDistance?: number;
  eyeColor?: string;
  pupilColor?: string;
  isBlinking?: boolean;
  forceLookX?: number;
  forceLookY?: number;
}

export function EyeBall({
  size = 24,
  pupilSize = 10,
  maxDistance = 6,
  eyeColor = "white",
  pupilColor = "#0B1F3A",
  isBlinking = false,
  forceLookX,
  forceLookY,
}: EyeBallProps) {
  return (
    <div
      style={{
        width: size,
        height: size,
        borderRadius: "50%",
        background: eyeColor,
        display: "grid",
        placeItems: "center",
        transform: isBlinking ? "scaleY(0.08)" : "scaleY(1)",
        transition: "transform 100ms ease",
        boxShadow: "inset 0 1px 2px rgba(0,0,0,0.15)",
      }}
    >
      {!isBlinking && (
        <Pupil
          size={pupilSize}
          maxDistance={maxDistance}
          color={pupilColor}
          forceLookX={forceLookX}
          forceLookY={forceLookY}
        />
      )}
    </div>
  );
}

interface CharacterProps {
  containerRef: React.RefObject<HTMLDivElement | null>;
  mouse: { x: number; y: number };
  isTyping: boolean;
  isLookingAtEachOther: boolean;
  hidesPasswordEyes: boolean; // covers eyes when password typed (not visible)
  peeking: boolean; // sneak-peek when password visible
}

function usePosition(ref: React.RefObject<HTMLDivElement | null>, mouse: { x: number; y: number }) {
  const [pos, setPos] = useState({ faceX: 0, faceY: 0, skew: 0 });
  useEffect(() => {
    if (!ref.current) return;
    const r = ref.current.getBoundingClientRect();
    const cx = r.left + r.width / 2;
    const cy = r.top + r.height / 3;
    const dx = mouse.x - cx;
    const dy = mouse.y - cy;
    setPos({
      faceX: Math.max(-12, Math.min(12, dx / 25)),
      faceY: Math.max(-8, Math.min(8, dy / 35)),
      skew: Math.max(-5, Math.min(5, -dx / 140)),
    });
  }, [mouse, ref]);
  return pos;
}

function useBlink() {
  const [blink, setBlink] = useState(false);
  useEffect(() => {
    let t: ReturnType<typeof setTimeout>;
    const schedule = () => {
      t = setTimeout(() => {
        setBlink(true);
        setTimeout(() => {
          setBlink(false);
          schedule();
        }, 140);
      }, Math.random() * 4000 + 3000);
    };
    schedule();
    return () => clearTimeout(t);
  }, []);
  return blink;
}

/**
 * Pill-shaped cartoon characters that react to mouse, blink, look at each other
 * when the user starts typing, and cover their eyes when the password is hidden.
 * The teal "peeker" character sneakily peeks when the password is visible.
 */
export function CharacterScene({
  isTyping,
  passwordLength,
  showPassword,
}: {
  isTyping: boolean;
  passwordLength: number;
  showPassword: boolean;
}) {
  const sceneRef = useRef<HTMLDivElement>(null);
  const tealRef = useRef<HTMLDivElement>(null);
  const navyRef = useRef<HTMLDivElement>(null);
  const cyanRef = useRef<HTMLDivElement>(null);
  const goldRef = useRef<HTMLDivElement>(null);

  const [mouse, setMouse] = useState({ x: 0, y: 0 });
  useEffect(() => {
    const onMove = (e: MouseEvent) => setMouse({ x: e.clientX, y: e.clientY });
    window.addEventListener("mousemove", onMove);
    return () => window.removeEventListener("mousemove", onMove);
  }, []);

  const tealBlink = useBlink();
  const navyBlink = useBlink();

  const [lookAtEachOther, setLookAtEachOther] = useState(false);
  useEffect(() => {
    if (isTyping) {
      setLookAtEachOther(true);
      const t = setTimeout(() => setLookAtEachOther(false), 900);
      return () => clearTimeout(t);
    }
  }, [isTyping]);

  // Peeking when password visible
  const [peeking, setPeeking] = useState(false);
  useEffect(() => {
    if (passwordLength > 0 && showPassword) {
      let t: ReturnType<typeof setTimeout>;
      const schedule = () => {
        t = setTimeout(() => {
          setPeeking(true);
          setTimeout(() => {
            setPeeking(false);
            schedule();
          }, 700);
        }, Math.random() * 2500 + 1800);
      };
      schedule();
      return () => clearTimeout(t);
    } else {
      setPeeking(false);
    }
  }, [passwordLength, showPassword]);

  const passwordHidden = passwordLength > 0 && !showPassword;

  const tealPos = usePosition(tealRef, mouse);
  const navyPos = usePosition(navyRef, mouse);
  const cyanPos = usePosition(cyanRef, mouse);
  const goldPos = usePosition(goldRef, mouse);

  return (
    <div
      ref={sceneRef}
      className="relative flex h-[420px] w-full items-end justify-center gap-4 px-6"
    >
      {/* glow */}
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-72 rounded-[40%] bg-teal/25 blur-3xl" />

      {/* Teal tall pill — back left (the peeker) */}
      <div
        ref={tealRef}
        className="relative shrink-0 rounded-t-[80px] shadow-[0_20px_60px_-15px_rgba(0,194,203,0.55)]"
        style={{
          width: 110,
          height: passwordHidden ? 360 : 320,
          background: "linear-gradient(180deg, oklch(0.86 0.13 195), oklch(0.7 0.16 200))",
          transform: passwordHidden
            ? `skewX(${tealPos.skew - 10}deg) translateX(20px)`
            : `skewX(${tealPos.skew}deg)`,
          transformOrigin: "bottom center",
          transition: "all 280ms cubic-bezier(.2,.8,.2,1)",
          zIndex: 1,
        }}
      >
        <div
          className="absolute flex gap-2"
          style={{
            left: 22 + tealPos.faceX,
            top: 60 + tealPos.faceY,
            transition: "all 200ms ease",
          }}
        >
          <EyeBall
            size={22}
            pupilSize={9}
            isBlinking={tealBlink}
            eyeColor="white"
            pupilColor="#0B1F3A"
            forceLookX={
              showPassword && passwordLength > 0 ? (peeking ? 4 : -4) : lookAtEachOther ? 4 : undefined
            }
            forceLookY={
              showPassword && passwordLength > 0 ? (peeking ? 4 : -3) : lookAtEachOther ? 3 : undefined
            }
          />
          <EyeBall
            size={22}
            pupilSize={9}
            isBlinking={tealBlink}
            eyeColor="white"
            pupilColor="#0B1F3A"
            forceLookX={
              showPassword && passwordLength > 0 ? (peeking ? 4 : -4) : lookAtEachOther ? 4 : undefined
            }
            forceLookY={
              showPassword && passwordLength > 0 ? (peeking ? 4 : -3) : lookAtEachOther ? 3 : undefined
            }
          />
        </div>
      </div>

      {/* Navy tall pill — middle */}
      <div
        ref={navyRef}
        className="relative shrink-0 rounded-t-[70px] shadow-[0_20px_60px_-15px_rgba(11,31,58,0.6)]"
        style={{
          width: 90,
          height: 280,
          background: "linear-gradient(180deg, oklch(0.32 0.06 255), oklch(0.18 0.06 255))",
          transform: lookAtEachOther
            ? `skewX(${navyPos.skew * 1.5 + 8}deg) translateX(10px)`
            : `skewX(${navyPos.skew * 1.4}deg)`,
          transformOrigin: "bottom center",
          transition: "all 280ms cubic-bezier(.2,.8,.2,1)",
          zIndex: 2,
        }}
      >
        <div
          className="absolute flex gap-2"
          style={{
            left: 16 + navyPos.faceX,
            top: 50 + navyPos.faceY,
            transition: "all 200ms ease",
          }}
        >
          <EyeBall
            size={20}
            pupilSize={8}
            isBlinking={navyBlink}
            eyeColor="oklch(0.86 0.13 195)"
            pupilColor="#0B1F3A"
            forceLookX={lookAtEachOther ? -3 : undefined}
            forceLookY={lookAtEachOther ? -2 : undefined}
          />
          <EyeBall
            size={20}
            pupilSize={8}
            isBlinking={navyBlink}
            eyeColor="oklch(0.86 0.13 195)"
            pupilColor="#0B1F3A"
            forceLookX={lookAtEachOther ? -3 : undefined}
            forceLookY={lookAtEachOther ? -2 : undefined}
          />
        </div>
      </div>

      {/* Cyan dome — front left */}
      <div
        ref={cyanRef}
        className="relative shrink-0"
        style={{
          width: 130,
          height: 130,
          borderRadius: "130px 130px 16px 16px",
          background: "linear-gradient(180deg, oklch(0.9 0.1 195), oklch(0.78 0.14 195))",
          transform: `skewX(${cyanPos.skew}deg)`,
          transformOrigin: "bottom center",
          transition: "all 280ms cubic-bezier(.2,.8,.2,1)",
          zIndex: 3,
          boxShadow: "0 25px 50px -15px rgba(0,194,203,0.5)",
        }}
      >
        <div
          className="absolute flex gap-3"
          style={{
            left: 38 + cyanPos.faceX,
            top: 55 + cyanPos.faceY,
            transition: "all 200ms ease",
          }}
        >
          <Pupil size={9} color="#0B1F3A" />
          <Pupil size={9} color="#0B1F3A" />
        </div>
      </div>

      {/* Gold pill — front right */}
      <div
        ref={goldRef}
        className="relative shrink-0 rounded-t-[50px]"
        style={{
          width: 75,
          height: 200,
          background: "linear-gradient(180deg, oklch(0.88 0.14 85), oklch(0.75 0.17 70))",
          transform: `skewX(${goldPos.skew}deg)`,
          transformOrigin: "bottom center",
          transition: "all 280ms cubic-bezier(.2,.8,.2,1)",
          zIndex: 3,
          boxShadow: "0 20px 45px -15px rgba(220, 160, 30, 0.5)",
        }}
      >
        <div
          className="absolute flex gap-2"
          style={{
            left: 18 + goldPos.faceX,
            top: 40 + goldPos.faceY,
            transition: "all 200ms ease",
          }}
        >
          <Pupil size={7} color="#0B1F3A" />
          <Pupil size={7} color="#0B1F3A" />
        </div>
        {/* mouth */}
        <div
          className="absolute h-0.5 rounded-full bg-navy"
          style={{
            width: 22,
            left: 26 + goldPos.faceX,
            top: 78 + goldPos.faceY,
            transition: "all 200ms ease",
          }}
        />
      </div>
    </div>
  );
}