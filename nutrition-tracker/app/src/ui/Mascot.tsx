// نخودچی — the chickpea mascot. Pure SVG, decorative (aria-hidden); meaning always
// lives in the adjacent text.

export type Mood = 'happy' | 'wink' | 'wow' | 'sleepy' | 'yay' | 'chew' | 'calm';

interface Props {
  mood?: Mood;
  size?: number;
  bob?: boolean;
  popKey?: string | number; // change to replay the pop animation
  className?: string;
}

const INK = '#2a1f33';

function Eyes({ mood }: { mood: Mood }) {
  if (mood === 'sleepy') {
    return (
      <g stroke={INK} strokeWidth="3.2" strokeLinecap="round" fill="none">
        <path d="M42 63 q6 5 12 0" />
        <path d="M68 63 q6 5 12 0" />
      </g>
    );
  }
  if (mood === 'yay') {
    return (
      <g stroke={INK} strokeWidth="3.4" strokeLinecap="round" strokeLinejoin="round" fill="none">
        <path d="M42 64 l6 -6 l6 6" />
        <path d="M68 64 l6 -6 l6 6" />
      </g>
    );
  }
  const open = (cx: number) => (
    <g key={cx}>
      <ellipse cx={cx} cy="61" rx={mood === 'wow' ? 5 : 4.6} ry={mood === 'wow' ? 7 : 6.2} fill={INK} />
      <circle cx={cx + 1.6} cy="58.4" r="1.8" fill="#fff" />
    </g>
  );
  if (mood === 'wink') {
    return (
      <g>
        <path d="M42 62 q6 -5 12 0" stroke={INK} strokeWidth="3.2" strokeLinecap="round" fill="none" />
        {open(74)}
      </g>
    );
  }
  return (
    <g>
      {open(48)}
      {open(74)}
      {mood === 'wow' && (
        <g stroke={INK} strokeWidth="2.6" strokeLinecap="round" fill="none">
          <path d="M42 48 q6 -4 11 -1" />
          <path d="M69 47 q6 -3 11 1" />
        </g>
      )}
    </g>
  );
}

function Mouth({ mood }: { mood: Mood }) {
  switch (mood) {
    case 'wow':
      return <ellipse cx="61" cy="80" rx="4.5" ry="5.5" fill={INK} />;
    case 'sleepy':
      return <path d="M56 79 q5 3 10 0" stroke={INK} strokeWidth="3" strokeLinecap="round" fill="none" />;
    case 'chew':
      return <path d="M52 78 q3 -3 6 0 q3 3 6 0 q3 -3 6 0" stroke={INK} strokeWidth="3" strokeLinecap="round" fill="none" />;
    case 'calm':
      return <path d="M54 76 q7 6 14 0" stroke={INK} strokeWidth="3.2" strokeLinecap="round" fill="none" />;
    case 'yay':
      return (
        <g>
          <path d="M50 73 q11 16 22 0 z" fill={INK} stroke={INK} strokeWidth="2.4" strokeLinejoin="round" />
          <path d="M55 80 q6 5 12 0 q-6 -3 -12 0z" fill="#ff8f86" />
        </g>
      );
    default:
      return (
        <g>
          <path d="M52 74 q9 12 18 0 z" fill={INK} stroke={INK} strokeWidth="2.4" strokeLinejoin="round" />
          <path d="M56 79 q5 3.5 10 0 q-5 -2 -10 0z" fill="#ff8f86" />
        </g>
      );
  }
}

export function Mascot({ mood = 'happy', size = 96, bob = false, popKey, className = '' }: Props) {
  return (
    <svg
      key={popKey}
      className={`mascot ${bob ? 'bob' : ''} ${popKey !== undefined ? 'pop' : ''} ${className}`}
      width={size}
      height={size}
      viewBox="0 0 122 122"
      aria-hidden="true"
      focusable="false"
    >
      {mood === 'yay' && (
        <g stroke={INK} strokeWidth="3.4" strokeLinecap="round" fill="none">
          <path d="M16 66 L5 50" />
          <path d="M106 66 L117 50" />
        </g>
      )}
      {/* feet */}
      <ellipse cx="47" cy="112" rx="9" ry="5" fill={INK} />
      <ellipse cx="75" cy="112" rx="9" ry="5" fill={INK} />
      {/* body: a round chickpea with its little beak */}
      <path
        d="M61 18 C87 18 107 38 107 64 C107 91 87 110 61 110 C35 110 15 91 15 64 C15 47 21 35 29 28 L25 15 Q25 11 29 12.5 L41 20.5 C47 18.8 54 18 61 18 Z"
        fill="#f4c064"
        stroke={INK}
        strokeWidth="3.6"
        strokeLinejoin="round"
      />
      <ellipse cx="80" cy="38" rx="11" ry="6.5" fill="#fbe0a6" transform="rotate(28 80 38)" />
      <path d="M33 27 Q39 40 35 54" stroke="#d99d3c" strokeWidth="3" strokeLinecap="round" fill="none" />
      {/* cheeks */}
      <ellipse cx="38" cy="73" rx="7.5" ry="4.6" fill="#ff9d8a" opacity="0.75" />
      <ellipse cx="84" cy="73" rx="7.5" ry="4.6" fill="#ff9d8a" opacity="0.75" />
      <Eyes mood={mood} />
      <Mouth mood={mood} />
      {mood === 'sleepy' && (
        <g fill={INK} fontFamily="Lalezar, sans-serif" fontSize="16">
          <text x="96" y="26">z</text>
          <text x="106" y="14" fontSize="12">z</text>
        </g>
      )}
    </svg>
  );
}

export function Bubble({ children }: { children: React.ReactNode }) {
  return <div className="bubble">{children}</div>;
}

export function MascotSays({ mood, children, size = 72 }: { mood?: Mood; children: React.ReactNode; size?: number }) {
  return (
    <div className="row" style={{ alignItems: 'flex-start', gap: 14 }}>
      <Mascot mood={mood} size={size} bob />
      <div style={{ flex: 1, paddingTop: 6 }}>
        <Bubble>{children}</Bubble>
      </div>
    </div>
  );
}
