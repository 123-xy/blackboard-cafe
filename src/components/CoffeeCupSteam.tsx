export default function CoffeeCupSteam({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 120 120" width="120" height="120" fill="none" className={`pointer-events-none ${className}`}>
      <g stroke="#F2A93B" strokeWidth={4} strokeLinecap="round">
        <path d="M32 54 h44 a6 6 0 0 1 6 6 v10 a20 20 0 0 1 -20 20 h-16 a20 20 0 0 1 -20 -20 v-10 a6 6 0 0 1 6 -6 Z" />
        <path d="M82 58 h10 a10 10 0 0 1 0 20 h-8" />
      </g>
      <g stroke="#F2A93B" strokeWidth={3.5} strokeLinecap="round" opacity={0.8}>
        <path d="M40 40 q-6 -8 0 -16">
          <animate attributeName="opacity" values="0.2;0.8;0.2" dur="2.4s" repeatCount="indefinite" />
        </path>
        <path d="M54 40 q-6 -8 0 -16">
          <animate attributeName="opacity" values="0.8;0.2;0.8" dur="2.4s" repeatCount="indefinite" />
        </path>
        <path d="M68 40 q-6 -8 0 -16">
          <animate attributeName="opacity" values="0.4;0.9;0.4" dur="2.4s" repeatCount="indefinite" />
        </path>
      </g>
    </svg>
  );
}
