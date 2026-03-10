'use client';

import React, { useRef } from 'react';
import { motion } from 'framer-motion';
import { Lock, Play, Star } from 'lucide-react';
import { useLanguage } from '@/components/providers/LanguageProvider';

interface LessonNode {
  id: string;
  title: string;
  status: 'completed' | 'in-progress' | 'locked' | 'unlocked';
  score?: number;
  progress?: number;
  x: number; // Percentage X
  y: number; // Percentage Y
}

interface MapDashboardProps {
  language: string;
  lessons: any[];
  onStartLesson: (lessonId: string) => void;
}

export function MapDashboard({ language, lessons, onStartLesson }: MapDashboardProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const { t } = useLanguage();

  // Coordinates path pattern (Y values as percentages of height, X will be calculated dynamically)
  const mapCoordinates = [50, 30, 60, 35, 70, 40, 60, 30, 50, 70];

  // If no lessons are provided, show a thematic sample path
  const sampleNodes: any[] = [
    { id: '1', title: 'Basics 1', status: 'completed', score: 100 },
    { id: '2', title: 'Phrases', status: 'in-progress', progress: 50 },
    { id: '3', title: 'Food', status: 'locked' },
    { id: '4', title: 'Animals', status: 'locked' },
  ];

  const sourceData = lessons && lessons.length > 0 ? lessons : sampleNodes;

  const displayNodes: LessonNode[] = sourceData.map((lesson: any, index: number) => {
    let status: 'completed' | 'in-progress' | 'locked' | 'unlocked' = 'locked';
    if (lesson.status === 'completed') status = 'completed';
    else if (lesson.status === 'in-progress') status = 'in-progress';
    else if (index === 0 || sourceData[index - 1]?.status === 'completed') status = 'unlocked';

    const yCoord = mapCoordinates[index % mapCoordinates.length];
    
    // Constant pixel distance between nodes
    const NODE_DISTANCE = 180;
    const INITIAL_OFFSET = 120;
    const xCoord = INITIAL_OFFSET + index * NODE_DISTANCE;

    return {
      id: lesson.lessonId || lesson.id || `node-${index}`,
      title: lesson.title || `Lesson ${index + 1}`,
      status,
      score: lesson.score,
      progress: lesson.progress || 0,
      x: xCoord,
      y: yCoord,
    };
  });

  const mapWidthPx = Math.max(800, displayNodes.length * 180 + 300);

  return (
    <div className="relative w-full h-[500px] overflow-hidden bg-gradient-to-br from-[#7a9b7e] to-[#5a8c5c] rounded-3xl border-4 border-white shadow-lg mb-8" ref={containerRef}>
      {/* Decorative background elements (stars, clouds, etc) */}
      <div className="absolute inset-0 opacity-20 pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle, #ffffff 2px, transparent 2px)', backgroundSize: '40px 40px' }} />
      
      <motion.div
        drag="x"
        dragConstraints={containerRef}
        className="absolute top-0 left-0 h-full flex items-center cursor-grab active:cursor-grabbing"
        style={{ width: `${mapWidthPx}px`, touchAction: 'none' }}
      >
        {/* Dotted lines connecting nodes */}
        <svg className="absolute top-0 left-0 w-full h-full pointer-events-none">
          {displayNodes.map((node, i) => {
            if (i === displayNodes.length - 1) return null;
            const nextNode = displayNodes[i + 1];
            return (
              <line
                key={`line-${i}`}
                x1={`${node.x}px`}
                y1={`${node.y}%`}
                x2={`${nextNode.x}px`}
                y2={`${nextNode.y}%`}
                stroke={node.status === 'completed' ? '#4ade80' : 'rgba(255,255,255,0.3)'}
                strokeWidth="8"
                strokeDasharray="16 16"
                strokeLinecap="round"
              />
            );
          })}
        </svg>

        {/* Nodes */}
        {displayNodes.map((node, index) => {
          const isLocked = node.status === 'locked';
          const isCompleted = node.status === 'completed';
          const isInProgress = node.status === 'in-progress' || node.status === 'unlocked';

          // Calculate ring offset for progress
          const ringCircumference = 289; // 2 * pi * 46
          const ringOffset = isInProgress && node.progress ? ringCircumference - (node.progress / 100) * ringCircumference : ringCircumference;

          return (
            <motion.div
              key={`map-node-${index}-${node.id}`}
              className="absolute transform -translate-x-1/2 -translate-y-1/2 flex flex-col items-center"
              style={{ left: `${node.x}px`, top: `${node.y}%` }}
              whileHover={!isLocked ? { scale: 1.1 } : {}}
              whileTap={!isLocked ? { scale: 0.95 } : {}}
            >
              {/* Tooltip / Title */}
              <div className={`mb-3 px-4 py-2 rounded-2xl text-sm font-bold shadow-xl whitespace-nowrap transition-colors ${
                isCompleted ? 'bg-[#4ade80] text-teal-900' : 
                isInProgress ? 'bg-white text-blue-900 border-2 border-blue-200' : 
                'bg-slate-800 text-slate-400 border border-slate-700'
              }`}>
                {node.title}
              </div>

              {/* Pin */}
              <button
                onClick={() => !isLocked && onStartLesson(node.id)}
                className={`relative flex items-center justify-center w-24 h-24 rounded-full shadow-[0_10px_25px_rgba(0,0,0,0.3)] border-[6px] transition-all duration-300 ${
                  isCompleted ? 'bg-gradient-to-b from-yellow-300 to-yellow-500 border-white' :
                  isInProgress ? 'bg-gradient-to-b from-blue-400 to-blue-600 border-white shadow-[0_0_30px_rgba(96,165,250,0.6)]' :
                  'bg-slate-700 border-slate-600'
                }`}
                disabled={isLocked}
                aria-label={node.title}
              >
                {isLocked ? (
                  <Lock className="w-8 h-8 text-slate-500" fill="currentColor" />
                ) : isCompleted ? (
                   <div className="absolute inset-0 flex flex-col items-center justify-center">
                     <Star className="w-8 h-8 text-white mt-1" fill="currentColor" />
                     {node.score && <span className="text-xs font-black text-white">{node.score}%</span>}
                   </div>
                ) : (
                  <Play className="w-10 h-10 text-white ml-2" fill="currentColor" />
                )}

                {/* Progress Ring for In Progress (Mondly style) */}
                {isInProgress && (
                  <svg className="absolute inset-[-6px] w-[calc(100%+12px)] h-[calc(100%+12px)] -rotate-90 pointer-events-none" viewBox="0 0 100 100">
                    <circle cx="50" cy="50" r="46" fill="none" stroke="rgba(255,255,255,0.2)" strokeWidth="8" />
                    <circle 
                      cx="50" cy="50" r="46" 
                      fill="none" 
                      stroke="#fbbf24" 
                      strokeWidth="8" 
                      strokeDasharray={ringCircumference} 
                      strokeDashoffset={ringOffset} 
                      strokeLinecap="round" 
                    />
                  </svg>
                )}
                
                {/* New badge bubble for unlocked lessons */}
                {node.status === 'unlocked' && (
                  <div className="absolute -top-1 -right-1 w-6 h-6 bg-red-500 rounded-full border-2 border-white flex items-center justify-center shadow-lg animate-bounce">
                    <div className="w-2 h-2 rounded-full bg-white" />
                  </div>
                )}
              </button>
            </motion.div>
          );
        })}
      </motion.div>
    </div>
  );
}
