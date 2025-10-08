import type { KnobSkin } from 'react-rotary-knob';

const glassKnobSkin: KnobSkin = {
  knobX: 110,
  knobY: 110,
  updateAttributes: [],
  svg: `
  <svg width="220" height="220" viewBox="0 0 220 220" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="outerGradient" x1="20%" y1="0%" x2="80%" y2="100%">
        <stop offset="0%" stop-color="#FFFFFF" stop-opacity="0.85" />
        <stop offset="45%" stop-color="#ECFDF5" stop-opacity="0.7" />
        <stop offset="100%" stop-color="#FEF3C7" stop-opacity="0.6" />
      </linearGradient>
      <linearGradient id="innerGradient" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="#A7F3D0" stop-opacity="0.85" />
        <stop offset="45%" stop-color="#6EE7B7" stop-opacity="0.9" />
        <stop offset="100%" stop-color="#FDE68A" stop-opacity="0.85" />
      </linearGradient>
      <linearGradient id="pointerGradient" x1="50%" y1="0%" x2="50%" y2="100%">
        <stop offset="0%" stop-color="#047857" />
        <stop offset="100%" stop-color="#22C55E" />
      </linearGradient>
      <filter id="surfaceBlur" x="-10%" y="-10%" width="120%" height="120%">
        <feGaussianBlur in="SourceGraphic" stdDeviation="3" result="blur" />
        <feBlend in="SourceGraphic" in2="blur" mode="screen" />
      </filter>
    </defs>
    <g id="container">
      <circle cx="110" cy="110" r="102" fill="url(#outerGradient)" stroke="rgba(255,255,255,0.7)" stroke-width="2" />
      <circle cx="110" cy="110" r="84" fill="rgba(255,255,255,0.55)" filter="url(#surfaceBlur)" />
      <circle cx="110" cy="110" r="60" fill="rgba(255,255,255,0.35)" />
      <g id="knob" transform="translate(110,110)">
        <circle cx="0" cy="0" r="70" fill="url(#innerGradient)" stroke="rgba(255,255,255,0.55)" stroke-width="2" />
        <rect x="-4" y="-60" width="8" height="40" rx="4" fill="url(#pointerGradient)" />
        <circle cx="0" cy="0" r="10" fill="rgba(255,255,255,0.65)" />
      </g>
    </g>
  </svg>
  `,
};

export default glassKnobSkin;
