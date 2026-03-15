"use client";

import { useState, useRef, useEffect } from "react";
import styles from "./page.module.css";

const FloatingHearts = () => {
  const [hearts, setHearts] = useState<{ id: number; left: number; delay: number; duration: number }[]>([]);

  useEffect(() => {
    // Generate initial hearts
    const newHearts = Array.from({ length: 20 }).map((_, i) => ({
      id: i,
      left: Math.random() * 100, // random horizontal position 0-100%
      delay: Math.random() * 10, // random start delay up to 10s
      duration: Math.random() * 10 + 10 // random duration between 10-20s
    }));
    setHearts(newHearts);
  }, []);

  return (
    <>
      {hearts.map((heart) => (
        <div
          key={heart.id}
          className={styles.floatingHeart}
          style={{
            left: `${heart.left}%`,
            animationDelay: `${heart.delay}s`,
            animationDuration: `${heart.duration}s`
          }}
        >
          ❤️
        </div>
      ))}
    </>
  );
};

export default function Home() {
  const [accepted, setAccepted] = useState(false);
  const [noPosition, setNoPosition] = useState({ top: 0, left: 0 });
  const [isMoved, setIsMoved] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Create audio references
  const nopeSound = useRef<HTMLAudioElement | null>(null);
  const yesSound = useRef<HTMLAudioElement | null>(null);
  const kissSound = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    // Initialize audio objects only on client side
    nopeSound.current = new Audio('/nope.mp3');
    yesSound.current = new Audio('/fah.mp3');
    kissSound.current = new Audio('/kiss.mp3');
  }, []);

  const moveButton = () => {
    // Get viewport dimensions to keep the button inside visible screen
    const windowWidth = typeof window !== "undefined" ? window.innerWidth : 800;
    const windowHeight = typeof window !== "undefined" ? window.innerHeight : 600;

    // Approximate button size
    const btnWidth = 100;
    const btnHeight = 50;
    const padding = 20;

    // Calculate maximum allowed positions to stay on screen
    const maxLeft = windowWidth - btnWidth - padding;
    const maxTop = windowHeight - btnHeight - padding;

    // Generate random coordinates within bounds
    const newLeft = Math.floor(Math.random() * (maxLeft - padding)) + padding;
    const newTop = Math.floor(Math.random() * (maxTop - padding)) + padding;

    setNoPosition({ left: newLeft, top: newTop });
    setIsMoved(true);

    // Play the nope sound
    if (nopeSound.current) {
      nopeSound.current.currentTime = 0; // Rewind to start if already playing
      nopeSound.current.play().catch(e => console.log("Audio play failed:", e));
    }
  };

  if (accepted) {
    return (
      <div className={styles.container}>
        <FloatingHearts />
        <h1 className={styles.title}>Yayy! Let's go! 💖✨</h1>
        <div className={styles.gifContainer}>
          <img
            src="https://media.tenor.com/gUiu1zyxfzYAAAAi/bear-kiss-bear-kisses.gif"
            alt="cute bear kiss"
            className={styles.gif}
            style={{ cursor: "pointer" }}
            onClick={() => {
              if (kissSound.current) {
                kissSound.current.currentTime = 0;
                kissSound.current.play().catch(e => console.log("Audio play failed:", e));
              }
            }}
          />
        </div>
      </div>
    );
  }

  return (
    <div className={styles.container} ref={containerRef}>
      <FloatingHearts />
      <h2 className={styles.subtitle}>ABHILASHA ❤️</h2>
      <h1 className={styles.title}>Will you be my Valentine?</h1>

      <div className={styles.buttonsWrapper}>
        <div className={styles.yesContainer}>
          <button
            className={`${styles.btn} ${styles.btnYes}`}
            onClick={() => {
              if (yesSound.current) {
                yesSound.current.currentTime = 0;
                yesSound.current.play().catch(e => console.log("Audio play failed:", e));
              }
              setAccepted(true);
            }}
          >
            Yes ✅
          </button>
          <div className={styles.hint}>Smart girl chooses YES 🤫</div>
        </div>

        <button
          className={`${styles.btn} ${styles.btnNo}`}
          style={isMoved ? {
            position: 'fixed',
            left: `${noPosition.left}px`,
            top: `${noPosition.top}px`,
            transition: 'all 0.2s ease',
            zIndex: 100
          } : {}}
          onMouseEnter={moveButton}
          onClick={moveButton}
        >
          No 🥺
        </button>
      </div>
    </div>
  );
}
