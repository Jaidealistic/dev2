'use client';

/**
 * TALKBACK OVERLAY
 *
 * Provides Android TalkBack-like behavior for the web:
 * - Single click/tap on any element → reads it aloud via Web Speech API
 * - Double click/tap → actually activates (navigates, submits, etc.)
 * - Visual focus ring on the currently "read" element
 * - Works with all interactive and text elements
 *
 * WCAG 2.1 compliant — this is an enhancement layer, not a replacement
 * for native screen readers.
 */

import { useEffect, useRef, useCallback, useState } from 'react';

interface TalkBackOverlayProps {
  enabled: boolean;
}

/**
 * Recursively extracts visible text from an element,
 * skipping aria-hidden elements and sr-only elements.
 */
function getVisibleText(el: Node): string {
  if (el.nodeType === Node.TEXT_NODE) {
    return el.textContent?.trim() || '';
  }

  if (el.nodeType !== Node.ELEMENT_NODE) return '';

  const htmlEl = el as HTMLElement;

  // Skip hidden elements
  if (htmlEl.getAttribute('aria-hidden') === 'true') return '';
  if (htmlEl.classList?.contains('sr-only')) return '';
  if (htmlEl.tagName === 'SVG' || htmlEl.tagName === 'svg') return '';

  // Recursively collect text from all children
  const parts: string[] = [];
  for (const child of htmlEl.childNodes) {
    const childText = getVisibleText(child);
    if (childText) parts.push(childText);
  }
  return parts.join(' ').replace(/\s+/g, ' ').trim();
}

/**
 * Gets the element type label for TalkBack-style announcement.
 */
function getElementType(el: HTMLElement): string {
  const role = el.getAttribute('role');
  const tag = el.tagName.toLowerCase();

  if (role === 'button' || tag === 'button') return 'Button';
  if (role === 'link' || tag === 'a') return 'Link';
  if (role === 'checkbox' || (tag === 'input' && (el as HTMLInputElement).type === 'checkbox')) return 'Checkbox';
  if (role === 'radio' || (tag === 'input' && (el as HTMLInputElement).type === 'radio')) return 'Radio button';
  if (role === 'tab') return 'Tab';
  if (role === 'menuitem') return 'Menu item';
  if (tag === 'select' || role === 'listbox') return 'Dropdown';
  if (tag === 'textarea') return 'Text area';
  if (tag === 'input') return 'Edit text';
  if (tag === 'h1') return 'Heading level 1';
  if (tag === 'h2') return 'Heading level 2';
  if (tag === 'h3') return 'Heading level 3';
  if (tag === 'h4') return 'Heading level 4';
  if (tag === 'h5') return 'Heading level 5';
  if (tag === 'h6') return 'Heading level 6';
  if (tag === 'img') return 'Image';
  if (tag === 'p') return 'Text';
  if (tag === 'li' || role === 'listitem') return 'List item';
  if (tag === 'nav' || role === 'navigation') return 'Navigation';
  return '';
}

/**
 * Checks if an element is interactive (clickable/activatable).
 */
function isInteractiveElement(el: HTMLElement): boolean {
  const tag = el.tagName.toLowerCase();
  const role = el.getAttribute('role');
  return tag === 'a' || tag === 'button' || tag === 'input' ||
    tag === 'select' || tag === 'textarea' ||
    role === 'button' || role === 'link' || role === 'menuitem' ||
    role === 'tab' || role === 'checkbox' || role === 'radio';
}

/**
 * Extracts the accessible text from an element and formats it
 * like real TalkBack: "Start learning free. Button. Double tap to activate."
 *
 * Hierarchy:
 * 1. aria-label
 * 2. aria-labelledby (resolved)
 * 3. Associated <label>
 * 4. alt text (images)
 * 5. Deep visible text content
 */
function getAccessibleText(el: HTMLElement): string {
  const elementType = getElementType(el);
  const interactive = isInteractiveElement(el);
  let text = '';

  // 1. aria-label
  const ariaLabel = el.getAttribute('aria-label');
  if (ariaLabel) {
    text = ariaLabel;
  }

  // 2. aria-labelledby
  if (!text) {
    const labelledBy = el.getAttribute('aria-labelledby');
    if (labelledBy) {
      const parts = labelledBy.split(/\s+/).map(id => {
        const ref = document.getElementById(id);
        return ref ? getVisibleText(ref) : '';
      }).filter(Boolean);
      if (parts.length) text = parts.join(' ');
    }
  }

  // 3. Associated <label> (for form inputs)
  if (!text && (el instanceof HTMLInputElement || el instanceof HTMLSelectElement || el instanceof HTMLTextAreaElement)) {
    const id = el.id;
    if (id) {
      const label = document.querySelector(`label[for="${id}"]`);
      if (label) {
        text = getVisibleText(label);
      }
    }
    // Add input state info
    if (el instanceof HTMLInputElement && el.type === 'checkbox') {
      const state = el.checked ? 'checked' : 'not checked';
      return `${text || 'Checkbox'}. ${state}. Double tap to toggle.`;
    }
    if (el instanceof HTMLInputElement && el.type === 'radio') {
      const state = el.checked ? 'selected' : 'not selected';
      return `${text || 'Radio button'}. ${state}. Double tap to select.`;
    }
    // Text input
    const value = el.value;
    if (value) {
      text = text ? `${text}. Current value: ${value}` : value;
    } else {
      const placeholder = (el instanceof HTMLInputElement || el instanceof HTMLTextAreaElement) ? el.placeholder : '';
      text = text || placeholder || '';
      text = text ? `${text}. Empty` : 'Empty';
    }
    return `${text}. ${elementType}. Double tap to edit.`;
  }

  // 4. alt text for images
  if (!text && el instanceof HTMLImageElement) {
    text = el.alt || 'Unlabeled image';
  }

  // 5. Deep visible text content
  if (!text) {
    text = getVisibleText(el);
  }

  // Build the final TalkBack-style announcement
  // Format: "Text content. Element type. Double tap to activate."
  if (!text && !elementType) return '';

  let announcement = text || 'Unlabeled';
  if (elementType) {
    announcement += `. ${elementType}`;
  }
  if (interactive) {
    announcement += '. Double tap to activate';
  }

  return announcement;
}

/**
 * Find the most meaningful element to read from a click target.
 * Walks up the DOM to find a semantic element (button, link, heading, etc.)
 */
function findReadableElement(target: HTMLElement): HTMLElement | null {
  let el: HTMLElement | null = target;

  // If we clicked on something aria-hidden, walk up
  while (el && el.getAttribute('aria-hidden') === 'true') {
    el = el.parentElement;
  }

  if (!el) return null;

  // If it's a text node or inline element, try to find a meaningful parent
  const meaningfulTags = ['BUTTON', 'A', 'INPUT', 'SELECT', 'TEXTAREA', 'H1', 'H2', 'H3', 'H4', 'H5', 'H6', 'P', 'LI', 'TD', 'TH', 'LABEL'];
  const meaningfulRoles = ['button', 'link', 'menuitem', 'tab', 'checkbox', 'radio', 'option', 'heading', 'listitem'];

  // Walk up to find a meaningful element (max 5 levels)
  let current: HTMLElement | null = el;
  for (let i = 0; i < 5 && current; i++) {
    if (meaningfulTags.includes(current.tagName) ||
        meaningfulRoles.includes(current.getAttribute('role') || '') ||
        current.getAttribute('aria-label')) {
      return current;
    }
    current = current.parentElement;
  }

  // Fallback: return the original element if it has text
  if (el.textContent?.trim()) return el;
  return null;
}

export default function TalkBackOverlay({ enabled }: TalkBackOverlayProps) {
  const lastClickTime = useRef(0);
  const lastClickTarget = useRef<HTMLElement | null>(null);
  const highlightRef = useRef<HTMLDivElement | null>(null);
  const [highlightStyle, setHighlightStyle] = useState<React.CSSProperties>({});
  const [showHighlight, setShowHighlight] = useState(false);
  const speechRef = useRef<SpeechSynthesisUtterance | null>(null);

  const DOUBLE_CLICK_THRESHOLD = 400; // ms

  // Speak text using Web Speech API
  const speak = useCallback((text: string) => {
    if (!text) return;

    // Cancel any ongoing speech
    window.speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 0.9;
    utterance.pitch = 1;
    utterance.volume = 1;
    utterance.lang = document.documentElement.lang || 'en';
    speechRef.current = utterance;
    window.speechSynthesis.speak(utterance);
  }, []);

  // Highlight an element visually
  const highlightElement = useCallback((el: HTMLElement) => {
    const rect = el.getBoundingClientRect();
    setHighlightStyle({
      position: 'fixed',
      top: rect.top - 3,
      left: rect.left - 3,
      width: rect.width + 6,
      height: rect.height + 6,
      border: '3px solid #5a8c5c',
      borderRadius: '8px',
      backgroundColor: 'rgba(90, 140, 92, 0.1)',
      pointerEvents: 'none' as const,
      zIndex: 99999,
      transition: 'all 0.15s ease',
      boxShadow: '0 0 0 2px rgba(90, 140, 92, 0.3)',
    });
    setShowHighlight(true);
  }, []);

  // Main click handler
  const handleClick = useCallback((e: MouseEvent) => {
    if (!enabled) return;

    const target = e.target as HTMLElement;
    if (!target) return;

    // Don't intercept the TalkBack toggle button itself
    if (target.closest('[data-talkback-toggle]')) return;

    const now = Date.now();
    const timeSinceLast = now - lastClickTime.current;
    const sameTarget = lastClickTarget.current === target ||
      lastClickTarget.current?.contains(target) ||
      target.contains(lastClickTarget.current as Node);

    if (sameTarget && timeSinceLast < DOUBLE_CLICK_THRESHOLD) {
      // DOUBLE CLICK → let the original action happen
      lastClickTime.current = 0;
      lastClickTarget.current = null;
      setShowHighlight(false);
      window.speechSynthesis.cancel();

      // Re-dispatch a trusted-like click to actually navigate
      const readableEl = findReadableElement(target);
      if (readableEl) {
        // For links, programmatically navigate
        const link = readableEl.closest('a');
        if (link?.href) {
          window.location.href = link.href;
          return;
        }
        // For buttons, trigger click
        readableEl.click();
      }
      return;
    }

    // SINGLE CLICK → intercept, read aloud, highlight
    e.preventDefault();
    e.stopPropagation();
    e.stopImmediatePropagation();

    lastClickTime.current = now;
    lastClickTarget.current = target;

    const readableEl = findReadableElement(target);
    if (readableEl) {
      const text = getAccessibleText(readableEl);
      if (text) {
        speak(text);
        highlightElement(readableEl);
      }
    }
  }, [enabled, speak, highlightElement]);

  // Keyboard handler for Tab navigation with speech
  const handleFocus = useCallback((e: FocusEvent) => {
    if (!enabled) return;
    const target = e.target as HTMLElement;
    if (!target) return;

    const readableEl = findReadableElement(target);
    if (readableEl) {
      const text = getAccessibleText(readableEl);
      if (text) {
        speak(text);
        highlightElement(readableEl);
      }
    }
  }, [enabled, speak, highlightElement]);

  useEffect(() => {
    if (!enabled) {
      setShowHighlight(false);
      window.speechSynthesis.cancel();
      return;
    }

    // Announce mode activation
    speak('TalkBack mode enabled. Single tap to hear, double tap to activate.');

    // Use capture phase to intercept before any other handler
    document.addEventListener('click', handleClick, true);
    document.addEventListener('focusin', handleFocus, true);

    return () => {
      document.removeEventListener('click', handleClick, true);
      document.removeEventListener('focusin', handleFocus, true);
      window.speechSynthesis.cancel();
      setShowHighlight(false);
    };
  }, [enabled, handleClick, handleFocus, speak]);

  // Hide highlight on scroll
  useEffect(() => {
    if (!enabled) return;
    const handleScroll = () => setShowHighlight(false);
    window.addEventListener('scroll', handleScroll, true);
    return () => window.removeEventListener('scroll', handleScroll, true);
  }, [enabled]);

  if (!enabled || !showHighlight) return null;

  return (
    <div
      ref={highlightRef}
      style={highlightStyle}
      aria-hidden="true"
      data-talkback-highlight="true"
    />
  );
}
