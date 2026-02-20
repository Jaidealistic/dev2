import React from 'react';
import { CheckCircle, Circle, ArrowRight } from 'lucide-react';

interface VisualScheduleProps {
    sections: { id: string; title: string; type: string; content?: any }[];
    currentIndex: number;
}

export function VisualSchedule({ sections, currentIndex }: VisualScheduleProps) {
    return (
        <div className="bg-blue-50 border-2 border-blue-200 rounded-2xl p-6 mb-8 shadow-sm">
            <h3 className="text-xl font-bold text-blue-900 mb-4 flex items-center gap-2">
                <span className="text-2xl">📋</span>
                <span>Lesson Schedule</span>
            </h3>
            <div className="space-y-3">
                {sections.map((section, idx) => {
                    const isCompleted = idx < currentIndex;
                    const isCurrent = idx === currentIndex;

                    return (
                        <div
                            key={section.id || idx}
                            className={`flex items-center gap-3 p-3 rounded-xl transition-all duration-300 ${isCurrent
                                    ? 'bg-white shadow-md border-2 border-blue-400 scale-[1.02]'
                                    : isCompleted
                                        ? 'bg-blue-100/50 opacity-70'
                                        : 'bg-white/50 opacity-60'
                                }`}
                        >
                            <div className="flex-shrink-0 w-8 flex justify-center">
                                {isCompleted ? (
                                    <CheckCircle className="w-6 h-6 text-green-600" />
                                ) : isCurrent ? (
                                    <ArrowRight className="w-6 h-6 text-blue-600 animate-pulse" />
                                ) : (
                                    <Circle className="w-6 h-6 text-gray-400" />
                                )}
                            </div>

                            <div className="flex-grow min-w-0">
                                <p className={`font-semibold truncate ${isCurrent ? 'text-blue-900' : 'text-gray-600'
                                    }`}>
                                    {section.title}
                                </p>
                                <div className="flex items-center gap-2">
                                    <span className="text-xs font-medium text-gray-500 uppercase tracking-wider bg-gray-100 px-2 py-0.5 rounded-full">
                                        {section.type}
                                    </span>
                                </div>
                            </div>

                            {isCurrent && (
                                <div className="flex-shrink-0">
                                    <span className="text-xs font-bold bg-blue-600 text-white px-3 py-1 rounded-full animate-pulse">
                                        NOW
                                    </span>
                                </div>
                            )}
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
