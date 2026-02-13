import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function generateStudentId() {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'; // No I, O, 1, 0 to avoid confusion
  let result = 'LXF-';
  for (let i = 0; i < 4; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}