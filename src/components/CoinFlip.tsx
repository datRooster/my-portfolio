'use client';

import Image from "next/image";
import { useState, useEffect } from "react";

interface CoinFlipProps {
  width?: number;
  height?: number;
  className?: string;
  flipInterval?: number; // in millisecondi
}

export default function CoinFlip({
  width = 96,
  height = 96,
  className = "",
  flipInterval = 3000
}: CoinFlipProps) {
  const [isFlipped, setIsFlipped] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setIsFlipped(prev => !prev);
    }, flipInterval);

    return () => clearInterval(interval);
  }, [flipInterval]);

  return (
    <div className={`coin-container ${className}`}>
      <div className={`coin ${isFlipped ? 'flipped' : ''}`}>
        <div className="coin-side coin-front">
          <Image
            src="/images/gallo.png"
            width={width}
            height={height}
            alt="theWebRooster Avatar"
            className="rounded-full border-2 border-yellow-500"
          />
        </div>
        <div className="coin-side coin-back">
          <Image
            src="/images/avatar.jpg"
            width={width}
            height={height}
            alt="theWebRooster Logo"
            className="rounded-full border-2 border-yellow-500"
          />
        </div>
      </div>
      
      <style jsx>{`
        .coin-container {
          perspective: 1000px;
        }
        
        .coin {
          position: relative;
          width: ${width}px;
          height: ${height}px;
          transform-style: preserve-3d;
          transition: transform 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94);
        }
        
        .coin.flipped {
          transform: rotateY(180deg);
        }
        
        .coin-side {
          position: absolute;
          width: 100%;
          height: 100%;
          backface-visibility: hidden;
          border-radius: 50%;
        }
        
        .coin-front {
          z-index: 2;
        }
        
        .coin-back {
          transform: rotateY(180deg);
        }
        
        /* Effetto hover per fermare temporaneamente l'animazione */
        .coin-container:hover .coin {
          animation-play-state: paused;
        }
        
        /* Leggero effetto ombra durante la rotazione */
        .coin::before {
          content: '';
          position: absolute;
          top: 10%;
          left: 10%;
          right: 10%;
          bottom: 10%;
          background: rgba(0, 0, 0, 0.1);
          border-radius: 50%;
          z-index: -1;
          transform: translateZ(-2px);
          transition: opacity 0.3s ease;
        }
        
        .coin.flipped::before {
          opacity: 0.2;
        }
      `}</style>
    </div>
  );
}