
'use client';

import React from 'react';
import { motion } from 'framer-motion';

interface PlantVisualizationProps {
  progressPercentage: number;
  plantType?: string;
  size?: 'small' | 'medium' | 'large';
  className?: string;
}

export function PlantVisualization({ 
  progressPercentage, 
  plantType = 'sunflower',
  size = 'medium',
  className = ''
}: PlantVisualizationProps) {
  const getStage = (percentage: number) => {
    if (percentage < 10) return 'seed';
    if (percentage < 25) return 'sprout';
    if (percentage < 50) return 'small';
    if (percentage < 75) return 'medium';
    if (percentage < 95) return 'large';
    if (percentage < 100) return 'flowering';
    return 'fruiting';
  };

  const stage = getStage(progressPercentage);
  
  const getSizeClasses = () => {
    switch (size) {
      case 'small': return 'w-32 h-32';
      case 'large': return 'w-96 h-96';
      default: return 'w-64 h-64';
    }
  };

  const getPlantHeight = () => {
    const baseHeight = progressPercentage * 0.8; // 80% of container
    return Math.max(baseHeight, 5); // Minimum 5%
  };

  const getPlantColor = () => {
    switch (plantType) {
      case 'rose': return '#ff6b9d';
      case 'tulip': return '#c44569';
      case 'daisy': return '#f8b500';
      default: return '#ffd700'; // sunflower
    }
  };

  const plantHeight = getPlantHeight();
  const plantColor = getPlantColor();
  const stemHeight = Math.max(plantHeight * 0.6, 10);
  const leafCount = Math.floor(progressPercentage / 20);

  return (
    <div className={`relative ${getSizeClasses()} ${className}`}>
      <svg
        width="100%"
        height="100%"
        viewBox="0 0 200 200"
        className="overflow-visible"
      >
        {/* Soil/Ground */}
        <ellipse
          cx="100"
          cy="190"
          rx="80"
          ry="10"
          fill="#8B4513"
          opacity="0.3"
        />

        {/* Plant stem */}
        {stage !== 'seed' && (
          <motion.rect
            x="97"
            y={190 - stemHeight}
            width="6"
            height={stemHeight}
            fill="#228B22"
            rx="3"
            initial={{ height: 0, y: 190 }}
            animate={{ 
              height: stemHeight, 
              y: 190 - stemHeight 
            }}
            transition={{ duration: 1, ease: "easeOut" }}
          />
        )}

        {/* Leaves */}
        {Array.from({ length: leafCount }, (_, i) => (
          <motion.g key={i}>
            <motion.path
              d={`M ${95 + (i % 2 === 0 ? -10 : 15)} ${180 - (i * 15)} Q ${100 + (i % 2 === 0 ? -20 : 25)} ${175 - (i * 15)} ${97 + (i % 2 === 0 ? -5 : 10)} ${170 - (i * 15)}`}
              fill="#32CD32"
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ 
                duration: 0.5, 
                delay: i * 0.2,
                ease: "easeOut"
              }}
            />
          </motion.g>
        ))}

        {/* Flower center */}
        {stage === 'flowering' || stage === 'fruiting' ? (
          <motion.circle
            cx="100"
            cy={190 - stemHeight}
            r="15"
            fill={plantColor}
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.8, delay: 1 }}
          />
        ) : null}

        {/* Flower petals */}
        {(stage === 'flowering' || stage === 'fruiting') && (
          <>
            {Array.from({ length: 8 }, (_, i) => {
              const angle = (i * 45) * (Math.PI / 180);
              const petalX = 100 + Math.cos(angle) * 20;
              const petalY = (190 - stemHeight) + Math.sin(angle) * 20;
              
              return (
                <motion.ellipse
                  key={i}
                  cx={petalX}
                  cy={petalY}
                  rx="8"
                  ry="12"
                  fill={plantColor}
                  transform={`rotate(${i * 45} ${petalX} ${petalY})`}
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: 1, opacity: 0.9 }}
                  transition={{ 
                    duration: 0.6, 
                    delay: 1.2 + (i * 0.1),
                    ease: "easeOut"
                  }}
                />
              );
            })}
          </>
        )}

        {/* Fruit/Seeds (100% completion) */}
        {stage === 'fruiting' && (
          <motion.circle
            cx="100"
            cy={190 - stemHeight}
            r="8"
            fill="#8B4513"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.5, delay: 2 }}
          />
        )}

        {/* Seed stage */}
        {stage === 'seed' && (
          <motion.ellipse
            cx="100"
            cy="185"
            rx="4"
            ry="6"
            fill="#8B4513"
            initial={{ scale: 0, y: 190 }}
            animate={{ scale: 1, y: 185 }}
            transition={{ duration: 0.5 }}
          />
        )}

        {/* Sprout stage */}
        {stage === 'sprout' && (
          <motion.g>
            <motion.path
              d="M 100 185 Q 95 175 100 170"
              stroke="#32CD32"
              strokeWidth="3"
              fill="none"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 1 }}
            />
            <motion.ellipse
              cx="98"
              cy="172"
              rx="3"
              ry="5"
              fill="#32CD32"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.5, delay: 0.8 }}
            />
          </motion.g>
        )}

        {/* Sparkles for milestones */}
        {progressPercentage >= 25 && (
          <>
            {Array.from({ length: 3 }, (_, i) => (
              <motion.circle
                key={`sparkle-${i}`}
                cx={80 + i * 40}
                cy={150 - i * 10}
                r="2"
                fill="#FFD700"
                initial={{ scale: 0, opacity: 0 }}
                animate={{ 
                  scale: [0, 1, 0],
                  opacity: [0, 1, 0]
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  delay: i * 0.5
                }}
              />
            ))}
          </>
        )}
      </svg>

      {/* Progress text overlay */}
      <div className="absolute bottom-0 left-0 right-0 text-center">
        <div className="bg-white/90 backdrop-blur-sm rounded-lg px-3 py-1 mx-4">
          <span className="text-sm font-semibold text-gray-700">
            {Math.round(progressPercentage)}%
          </span>
        </div>
      </div>
    </div>
  );
}
