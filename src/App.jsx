import { useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion, useInView } from 'framer-motion'

const BISMILLAH = 'بِسْمِ اللَّهِ الرَّحْمَنِ الرَّحِيمِ'
const DUA = 'رَبَّنَا هَبْ لَنَا مِنْ أَزْوَاجِنَا وَذُرِّيَّاتِنَا قُرَّةَ أَعْيُنٍ'
const RECEPTION_DATE = '2026-08-23T00:00:00+05:30'

const receptionCalLink =
  'https://calendar.google.com/calendar/render?action=TEMPLATE&text=Asjad%27s+Reception&dates=20260823T000000/20260823T235900&details=Reception+Ceremony&location=Function+Palace+Berhampur+Odisha'

const events = [
  {
    label: 'R E C E P T I O N',
    title: 'Reception',
    day: 'Sunday, August 23, 2026',
    venue: 'Sagar Mandap, Cuttack',
    map: 'https://maps.app.goo.gl/7FdcjgT5ZPxxwBLv7',
  },
]

const PETAL_COLORS = [
  'var(--color-petal-a)',
  'var(--color-petal-b)',
  'var(--color-petal-c)',
  'var(--color-petal-d)',
]
const PETAL_SIZES  = [8, 10, 12, 14, 16, 18, 10, 12, 8, 14, 16, 10, 12, 18, 8, 14]

const petalData = Array.from({ length: 16 }, (_, i) => ({
  id:      i,
  left:    `${(i * 31 + 7) % 100}%`,
  delay:   `${(i * 1.3) % 12}s`,
  duration:`${12 + (i % 9)}s`,
  drift:   `${i % 2 === 0 ? 40 + i * 2 : -32 - i * 1.5}px`,
  color:   PETAL_COLORS[i % 4],
  rotate:  `${(i * 47) % 360}deg`,
  size:    PETAL_SIZES[i],
  opacity: 0.5 + (i % 3) * 0.1,
}))

// ─── Countdown hook ───────────────────────────────────────────────────────────

function useCountdown(targetDate) {
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 })

  useEffect(() => {
    function calc() {
      const diff = Math.max(new Date(targetDate).getTime() - Date.now(), 0)
      setTimeLeft({
        days:    Math.floor(diff / 86400000),
        hours:   Math.floor((diff % 86400000) / 3600000),
        minutes: Math.floor((diff % 3600000) / 60000),
        seconds: Math.floor((diff % 60000) / 1000),
      })
    }
    calc()
    const id = setInterval(calc, 1000)
    return () => clearInterval(id)
  }, [targetDate])

  return timeLeft
}

// ─── Paper rustle sound ───────────────────────────────────────────────────────

function playPaperRustle() {
  try {
    const AudioContext = window.AudioContext || window.webkitAudioContext
    if (!AudioContext) return
    const ctx = new AudioContext()
    const buffer = ctx.createBuffer(1, ctx.sampleRate * 0.08, ctx.sampleRate)
    const data = buffer.getChannelData(0)
    for (let i = 0; i < data.length; i++) data[i] = (Math.random() * 2 - 1) * (1 - i / data.length)
    const source = ctx.createBufferSource()
    const filter = ctx.createBiquadFilter()
    const gain   = ctx.createGain()
    filter.type = 'highpass'
    filter.frequency.value = 900
    gain.gain.value = 0.15
    source.buffer = buffer
    source.connect(filter)
    filter.connect(gain)
    gain.connect(ctx.destination)
    source.start()
    source.stop(ctx.currentTime + 0.08)
  } catch {
    // decorative — silently skip
  }
}

// ─── SVG Components ───────────────────────────────────────────────────────────

function FloralCorner({ position, size = 70 }) {
  const posMap = {
    tl: { top: '-4px',   left:  '-4px',  transform: 'rotate(0deg)' },
    tr: { top: '-4px',   right: '-4px',  transform: 'rotate(90deg)' },
    br: { bottom: '-4px',right: '-4px',  transform: 'rotate(180deg)' },
    bl: { bottom: '-4px',left:  '-4px',  transform: 'rotate(270deg)' },
  }
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 70 70"
      aria-hidden="true"
      style={{ position: 'absolute', pointerEvents: 'none', zIndex: 3, ...posMap[position] }}
    >
      <circle cx="12" cy="12" r="5"   fill="var(--color-border)" opacity="0.8" />
      <circle cx="22" cy="8"  r="3.5" fill="var(--color-primary)" opacity="0.6" />
      <circle cx="8"  cy="22" r="3"   fill="var(--color-blush-soft)" opacity="0.7" />
      <line x1="12" y1="12" x2="35" y2="35" stroke="var(--color-primary)" strokeWidth="1"   opacity="0.3" />
      <line x1="22" y1="8"  x2="35" y2="35" stroke="var(--color-primary)" strokeWidth="0.8" opacity="0.25" />
      <line x1="8"  y1="22" x2="35" y2="35" stroke="var(--color-primary)" strokeWidth="0.8" opacity="0.25" />
      <circle cx="18" cy="6"  r="2" fill="var(--color-accent)" opacity="0.5" />
      <circle cx="6"  cy="18" r="2" fill="var(--color-accent)" opacity="0.5" />
    </svg>
  )
}

function FloralHeart() {
  return (
    <div className="floral-heart-container">
      <svg
        className="floral-heart-svg"
        width="110"
        height="100"
        viewBox="0 0 110 100"
        fill="none"
        aria-hidden="true"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Main heart shape */}
        <path d="M55 85 C55 85 15 58 15 33 C15 20 25 12 35 12 C43 12 50 17 55 24 C60 17 67 12 75 12 C85 12 95 20 95 33 C95 58 55 85 55 85Z"
          fill="var(--color-blush-soft)" opacity="0.5" stroke="var(--color-primary)" strokeWidth="1.5" />

        {/* Rose center */}
        <circle cx="55" cy="46" r="7"   fill="var(--color-primary)" opacity="0.8" />
        <circle cx="55" cy="46" r="4.5" fill="var(--color-primary-deep)" opacity="0.7" />
        <circle cx="53" cy="44" r="1.5" fill="var(--color-on-primary)" opacity="0.4" />

        {/* Rose petals */}
        <ellipse cx="55" cy="37" rx="4" ry="5.5" fill="var(--color-primary)" opacity="0.5" transform="rotate(0 55 46)" />
        <ellipse cx="55" cy="37" rx="4" ry="5.5" fill="var(--color-primary)" opacity="0.5" transform="rotate(45 55 46)" />
        <ellipse cx="55" cy="37" rx="4" ry="5.5" fill="var(--color-primary)" opacity="0.5" transform="rotate(90 55 46)" />
        <ellipse cx="55" cy="37" rx="4" ry="5.5" fill="var(--color-primary)" opacity="0.5" transform="rotate(135 55 46)" />
        <ellipse cx="55" cy="37" rx="4" ry="5.5" fill="var(--color-primary)" opacity="0.5" transform="rotate(180 55 46)" />
        <ellipse cx="55" cy="37" rx="4" ry="5.5" fill="var(--color-primary)" opacity="0.5" transform="rotate(225 55 46)" />
        <ellipse cx="55" cy="37" rx="4" ry="5.5" fill="var(--color-primary)" opacity="0.5" transform="rotate(270 55 46)" />
        <ellipse cx="55" cy="37" rx="4" ry="5.5" fill="var(--color-primary)" opacity="0.5" transform="rotate(315 55 46)" />

        {/* Small roses — left side */}
        <circle cx="25" cy="30" r="4.5" fill="var(--color-border)" opacity="0.8" />
        <circle cx="25" cy="30" r="2.5" fill="var(--color-primary)" opacity="0.7" />
        <circle cx="20" cy="42" r="3.5" fill="var(--color-border)" opacity="0.7" />
        <circle cx="20" cy="42" r="2"   fill="var(--color-primary)" opacity="0.6" />
        <circle cx="27" cy="55" r="3"   fill="var(--color-border)" opacity="0.7" />
        <circle cx="27" cy="55" r="1.8" fill="var(--color-primary)" opacity="0.6" />

        {/* Small roses — right side */}
        <circle cx="85" cy="30" r="4.5" fill="var(--color-border)" opacity="0.8" />
        <circle cx="85" cy="30" r="2.5" fill="var(--color-primary)" opacity="0.7" />
        <circle cx="90" cy="42" r="3.5" fill="var(--color-border)" opacity="0.7" />
        <circle cx="90" cy="42" r="2"   fill="var(--color-primary)" opacity="0.6" />
        <circle cx="83" cy="55" r="3"   fill="var(--color-border)" opacity="0.7" />
        <circle cx="83" cy="55" r="1.8" fill="var(--color-primary)" opacity="0.6" />

        {/* Top humps */}
        <circle cx="36" cy="14" r="4"   fill="var(--color-border)" opacity="0.8" />
        <circle cx="36" cy="14" r="2.2" fill="var(--color-primary)" opacity="0.7" />
        <circle cx="74" cy="14" r="4"   fill="var(--color-border)" opacity="0.8" />
        <circle cx="74" cy="14" r="2.2" fill="var(--color-primary)" opacity="0.7" />

        {/* Bottom tip */}
        <circle cx="55" cy="83" r="4"   fill="var(--color-border)" opacity="0.8" />
        <circle cx="55" cy="83" r="2.2" fill="var(--color-primary)" opacity="0.7" />

        {/* Leaf accents */}
        <ellipse cx="18" cy="35" rx="4" ry="2" fill="var(--color-leaf)" opacity="0.4" transform="rotate(-30 18 35)" />
        <ellipse cx="92" cy="35" rx="4" ry="2" fill="var(--color-leaf)" opacity="0.4" transform="rotate(30 92 35)" />
        <ellipse cx="40" cy="75" rx="4" ry="2" fill="var(--color-leaf)" opacity="0.4" transform="rotate(-45 40 75)" />
        <ellipse cx="70" cy="75" rx="4" ry="2" fill="var(--color-leaf)" opacity="0.4" transform="rotate(45 70 75)" />

        {/* Sparkle dots */}
        <circle className="heart-sparkle" style={{ animationDelay: '0s' }}
          cx="10" cy="20" r="2"   fill="var(--color-primary)" opacity="0.4" />
        <circle className="heart-sparkle" style={{ animationDelay: '0.4s' }}
          cx="100" cy="20" r="2"  fill="var(--color-primary)" opacity="0.4" />
        <circle className="heart-sparkle" style={{ animationDelay: '0.8s' }}
          cx="55" cy="8" r="2.5"  fill="var(--color-border)" opacity="0.6" />
        <circle className="heart-sparkle" style={{ animationDelay: '1.2s' }}
          cx="15" cy="60" r="1.8" fill="var(--color-primary)" opacity="0.35" />
        <circle className="heart-sparkle" style={{ animationDelay: '1.6s' }}
          cx="95" cy="60" r="1.8" fill="var(--color-primary)" opacity="0.35" />
      </svg>
    </div>
  )
}

function CoverDivider() {
  return (
    <svg
      width="120"
      height="24"
      viewBox="0 0 120 24"
      aria-hidden="true"
      style={{ display: 'block', margin: '14px auto' }}
    >
      <line x1="2"  y1="12" x2="50"  y2="12" stroke="var(--color-primary)" strokeWidth="0.8" opacity="0.5" />
      <line x1="70" y1="12" x2="118" y2="12" stroke="var(--color-primary)" strokeWidth="0.8" opacity="0.5" />
      <circle cx="60" cy="12" r="3" fill="var(--color-primary)" opacity="0.7" />
      <path d="M60 7 C62 9 62 15 60 17 C58 15 58 9 60 7Z"    fill="var(--color-border)" opacity="0.9" />
      <path d="M55 12 C57 9 63 9 65 12 C63 15 57 15 55 12Z"  fill="var(--color-border)" opacity="0.9" />
    </svg>
  )
}

function FloralArch() {
  return (
    <svg
      className="floral-arch"
      viewBox="0 0 420 80"
      width="100%"
      height="80"
      aria-hidden="true"
      style={{ display: 'block', overflow: 'visible' }}
    >
      {/* Left branch */}
      <path d="M10 78 Q80 40 210 18" fill="none" stroke="var(--color-primary)" strokeWidth="1.5" opacity="0.5" strokeLinecap="round" />
      {/* Right branch */}
      <path d="M410 78 Q340 40 210 18" fill="none" stroke="var(--color-primary)" strokeWidth="1.5" opacity="0.5" strokeLinecap="round" />

      {/* Left branch: 5 blush-mid circles sizes 6,5,4,5,6 */}
      {[[52,64,6],[100,50,5],[148,38,4],[178,29,5],[204,21,6]].map(([x,y,r],i) => (
        <circle key={`lb${i}`} cx={x} cy={y} r={r} fill="var(--color-border)" />
      ))}
      {/* Right branch: 5 blush-mid circles */}
      {[[368,64,6],[320,50,5],[272,38,4],[242,29,5],[216,21,6]].map(([x,y,r],i) => (
        <circle key={`rb${i}`} cx={x} cy={y} r={r} fill="var(--color-border)" />
      ))}

      {/* Left: 3 rose accent circles above */}
      {[[82,42],[132,30],[170,22]].map(([x,y],i) => (
        <circle key={`la${i}`} cx={x} cy={y} r="4" fill="var(--color-primary)" opacity="0.6" />
      ))}
      {/* Right: 3 rose accent circles above */}
      {[[338,42],[288,30],[250,22]].map(([x,y],i) => (
        <circle key={`ra${i}`} cx={x} cy={y} r="4" fill="var(--color-primary)" opacity="0.6" />
      ))}

      {/* Center rose where branches meet */}
      <circle cx="210" cy="16" r="7" fill="var(--color-primary)" opacity="0.75" />
      <path d="M210 8C213 11 213 21 210 23C207 21 207 11 210 8Z" fill="var(--color-border)" opacity="0.95" />
      <path d="M202 16C205 12 215 12 218 16C215 20 205 20 202 16Z" fill="var(--color-border)" opacity="0.95" />
    </svg>
  )
}

function FloralDivider({ className = '' }) {
  return (
    <svg
      className={className}
      viewBox="0 0 140 28"
      width="140"
      height="28"
      aria-hidden="true"
      style={{ display: 'block', margin: '28px auto', overflow: 'visible' }}
    >
      <line x1="2"   y1="14" x2="52"  y2="14" stroke="var(--color-primary)" strokeWidth="1" opacity="0.5" strokeLinecap="round" />
      <line x1="88"  y1="14" x2="138" y2="14" stroke="var(--color-primary)" strokeWidth="1" opacity="0.5" strokeLinecap="round" />
      {/* leaves */}
      <ellipse cx="36"  cy="11" rx="4" ry="8"   transform="rotate(-45 36 11)"  fill="var(--color-primary)" opacity="0.3" />
      <ellipse cx="26"  cy="17" rx="3" ry="6.5" transform="rotate(45 26 17)"   fill="var(--color-primary)" opacity="0.3" />
      <ellipse cx="104" cy="11" rx="4" ry="8"   transform="rotate(45 104 11)"  fill="var(--color-primary)" opacity="0.3" />
      <ellipse cx="114" cy="17" rx="3" ry="6.5" transform="rotate(-45 114 17)" fill="var(--color-primary)" opacity="0.3" />
      <ellipse cx="60"  cy="12" rx="3" ry="5.5" transform="rotate(-38 60 12)"  fill="var(--color-primary)" opacity="0.3" />
      <ellipse cx="80"  cy="12" rx="3" ry="5.5" transform="rotate(38 80 12)"   fill="var(--color-primary)" opacity="0.3" />
      {/* center rose */}
      <circle cx="70" cy="14" r="5" fill="var(--color-primary)" opacity="0.75" />
      <path d="M70 8C72.5 10 72.5 18 70 20C67.5 18 67.5 10 70 8Z"    fill="var(--color-border)" opacity="0.95" />
      <path d="M64 14C66.5 10 73.5 10 76 14C73.5 18 66.5 18 64 14Z"  fill="var(--color-border)" opacity="0.95" />
    </svg>
  )
}

// ─── Inline UI icons (replace functional emoji) ───────────────────────────────

function IconCalendar({ size = 18 }) {
  return (
    <svg
      className="icon"
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.7"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <rect x="3" y="5" width="18" height="16" rx="2" />
      <line x1="3" y1="9.5" x2="21" y2="9.5" />
      <line x1="8" y1="3" x2="8" y2="6" />
      <line x1="16" y1="3" x2="16" y2="6" />
    </svg>
  )
}

function IconMapPin({ size = 18 }) {
  return (
    <svg
      className="icon"
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.7"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M12 21s-7-6.4-7-11a7 7 0 0 1 14 0c0 4.6-7 11-7 11Z" />
      <circle cx="12" cy="10" r="2.5" />
    </svg>
  )
}

function IconSparkle({ size = 16 }) {
  return (
    <svg
      className="icon"
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M12 3c.4 3.4 2.2 5.2 5.6 5.6C14.2 9 12.4 10.8 12 14.2c-.4-3.4-2.2-5.2-5.6-5.6C9.8 8.2 11.6 6.4 12 3Z" />
    </svg>
  )
}

function IconFlower({ size = 18 }) {
  return (
    <svg
      className="icon"
      width={size}
      height={size}
      viewBox="0 0 24 24"
      aria-hidden="true"
    >
      <circle cx="12" cy="12" r="5" fill="var(--color-primary)" opacity="0.75" />
      <path d="M12 5C13.2 6.4 13.2 11.6 12 13C10.8 11.6 10.8 6.4 12 5Z" fill="var(--color-border)" opacity="0.95" />
      <path d="M5 12C6.4 10 11.6 10 13 12C11.6 14 6.4 14 5 12Z" fill="var(--color-border)" opacity="0.95" />
      <circle cx="12" cy="12" r="1.8" fill="var(--color-primary-deep)" opacity="0.8" />
    </svg>
  )
}

// ─── Motion wrapper ───────────────────────────────────────────────────────────

function RevealSection({ children, className = '', style }) {
  return (
    <motion.div
      className={className}
      style={style}
      initial={{ opacity: 0, y: 25 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.15 }}
      transition={{ duration: 0.55, ease: 'easeOut' }}
    >
      {children}
    </motion.div>
  )
}

// ─── Countdown box ────────────────────────────────────────────────────────────

function CountdownBox({ label, value }) {
  const prev = useRef(value)
  const [changed, setChanged] = useState(false)

  useEffect(() => {
    if (prev.current !== value) {
      setChanged(true)
      const id = setTimeout(() => setChanged(false), 360)
      prev.current = value
      return () => clearTimeout(id)
    }
  }, [value])

  return (
    <div className="countdown-box">
      <span className="count-number-wrap">
        <AnimatePresence mode="popLayout">
          <motion.span
            key={value}
            className="count-number"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.2, ease: 'easeOut' }}
          >
            {String(value ?? 0).padStart(2, '0')}
          </motion.span>
        </AnimatePresence>
      </span>
      <span className="count-label">{label}</span>
    </div>
  )
}

// ─── Personal message with animated underline ─────────────────────────────────

function PersonalMessage() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, amount: 0.5 })

  return (
    <div className="message-box" ref={ref}>
      <p className="message-text">
        JazakAllah Khair for being part of this beautiful journey. it would mean
        everything to have you there 💚
      </p>
      <motion.div
        className="message-underline"
        initial={{ width: '0%' }}
        animate={isInView ? { width: '100%' } : {}}
        transition={{ duration: 0.5, ease: 'easeInOut', delay: 0.3 }}
      />
    </div>
  )
}

// ─── Event card ───────────────────────────────────────────────────────────────

function EventCard({ event }) {
  return (
    <article className="event-card">
      <div className="event-header">
        <span className="event-flower-icon"><IconFlower size={18} /></span>
        <span className="event-label">{event.label}</span>
      </div>
      <h3 className="event-title">{event.title}</h3>
      <div className="event-info-row">
        <span className="event-row-icon"><IconCalendar size={18} /></span>
        <span className="event-row-text">{event.day}</span>
      </div>
      <div className="event-info-row">
        <span className="event-row-icon"><IconMapPin size={18} /></span>
        <span className="event-row-text">{event.venue}</span>
      </div>
      <div className="event-card-sep" />
      <a className="maps-btn" href={event.map} target="_blank" rel="noopener noreferrer">
        <IconMapPin size={18} />
        View on Google Maps
      </a>
    </article>
  )
}

// ─── Calendar button with confetti ───────────────────────────────────────────

function CalendarButton({ href, children }) {
  const [burst, setBurst] = useState(false)
  function handleClick() {
    setBurst(true)
    setTimeout(() => setBurst(false), 520)
  }
  return (
    <a href={href} target="_blank" rel="noopener noreferrer" className="calendar-btn" onClick={handleClick}>
      <IconCalendar size={18} />
      {children}
      {burst && (
        <span className="confetti-burst" aria-hidden="true">
          {Array.from({ length: 6 }).map((_, i) => <i key={i} />)}
        </span>
      )}
    </a>
  )
}

// ─── Cover card front ─────────────────────────────────────────────────────────

function CardFront({ onOpen }) {
  const touchStartY = useRef(null)

  function handleCardTouchStart(e) {
    touchStartY.current = e.touches[0]?.clientY ?? null
  }

  function handleCardTouchEnd(e) {
    if (touchStartY.current == null) return
    const endY = e.changedTouches[0]?.clientY ?? touchStartY.current
    if (Math.abs(endY - touchStartY.current) >= 12) {
      e.preventDefault()
    }
    touchStartY.current = null
  }

  return (
    <button
      className="closed-card"
      type="button"
      onClick={onOpen}
      onTouchStart={handleCardTouchStart}
      onTouchEnd={handleCardTouchEnd}
      aria-label="Open wedding invitation"
    >
      <FloralCorner position="tl" />
      <FloralCorner position="tr" />
      <FloralCorner position="br" />
      <FloralCorner position="bl" />
      <div className="closed-inner-border" />
      <div className="closed-card-content">
        <p className="closed-bismillah" dir="rtl" lang="ar">{BISMILLAH}</p>
        <FloralHeart />
        <CoverDivider />
        <p className="closed-subtitle">a wedding invitation</p>
        <p className="closed-monogram">Asjad · 2026</p>
      </div>
    </button>
  )
}

// ─── Inner invitation content ─────────────────────────────────────────────────

function InnerContent({ countdown }) {
  return (
    <div className="inner-content">

      {/* 1 — Floral arch */}
      <RevealSection className="arch-section">
        <FloralArch />
      </RevealSection>

      {/* 2 — Bismillah */}
      <RevealSection className="bismillah-section">
        <div className="bismillah-glow" />
        <p className="bismillah-text" dir="rtl" lang="ar">{BISMILLAH}</p>
      </RevealSection>

      {/* 3 — Invitation text */}
      <RevealSection className="invitation-section">
        <p className="intro-line-grace">With the grace of Allah</p>
        <p className="intro-line-grace">and the joy of two families coming together,</p>
        <p className="intro-line-invite">we joyfully invite you to celebrate</p>
        <p className="reception-of-line">the Reception of</p>
      </RevealSection>

      {/* 4 — Name */}
      <RevealSection className="name-section" style={{ overflow: 'visible', paddingBottom: '12px' }}>
        <span className="name-asjad">Asjad</span>
        <p className="groom-lineage groom-lineage-last">son of the late Mirza Afzal Baig</p>
        <p className="bride-connector">with the daughter of</p>
        <p className="bride-father">Mohammed Nishat (Gopalpur)</p>
      </RevealSection>

      {/* 5 — Floral divider */}
      <FloralDivider />

      {/* 6 — Event cards */}
      <RevealSection className="events-section">
        {events.map((ev) => (
          <EventCard key={ev.title} event={ev} />
        ))}
      </RevealSection>

      {/* 7 — Countdown */}
      <RevealSection className="countdown-section" style={{ marginTop: '2rem' }}>
        <p className="countdown-label">
          until the daawat begins
          <IconSparkle size={16} />
        </p>
        <div className="countdown-grid">
          <CountdownBox label="Days"    value={countdown.days} />
          <CountdownBox label="Hours"   value={countdown.hours} />
          <CountdownBox label="Minutes" value={countdown.minutes} />
          <CountdownBox label="Seconds" value={countdown.seconds} />
        </div>
      </RevealSection>

      {/* 8 — Personal message */}
      <RevealSection style={{ marginTop: '2rem' }}>
        <PersonalMessage />
      </RevealSection>

      {/* 9 — Calendar buttons */}
      <RevealSection className="calendar-section" style={{ marginTop: '2rem' }}>
        <CalendarButton href={receptionCalLink}>Save Reception to Calendar</CalendarButton>
      </RevealSection>

      {/* 10 — Footer */}
      <RevealSection className="footer-section">
        <p className="made-with-love">August 2026 · with so much love</p>
        <p className="dua-text" dir="rtl" lang="ar">{DUA}</p>
        <p className="dua-translation">
          "Our Lord, grant us from among our spouses and offspring comfort to our eyes"
        </p>
        <p className="surah-ref">Surah Al-Furqan 25:74</p>
        <div className="footer-flowers">
          <svg width="50" height="50" viewBox="0 0 70 70" aria-hidden="true">
            <circle cx="12" cy="12" r="5"   fill="var(--color-border)" opacity="0.8" />
            <circle cx="22" cy="8"  r="3.5" fill="var(--color-primary)" opacity="0.6" />
            <circle cx="8"  cy="22" r="3"   fill="var(--color-blush-soft)" opacity="0.7" />
            <line x1="12" y1="12" x2="35" y2="35" stroke="var(--color-primary)" strokeWidth="1"   opacity="0.3" />
            <line x1="22" y1="8"  x2="35" y2="35" stroke="var(--color-primary)" strokeWidth="0.8" opacity="0.25" />
            <line x1="8"  y1="22" x2="35" y2="35" stroke="var(--color-primary)" strokeWidth="0.8" opacity="0.25" />
            <circle cx="18" cy="6"  r="2" fill="var(--color-accent)" opacity="0.5" />
            <circle cx="6"  cy="18" r="2" fill="var(--color-accent)" opacity="0.5" />
          </svg>
          <svg width="50" height="50" viewBox="0 0 70 70" aria-hidden="true" style={{ transform: 'rotate(90deg)' }}>
            <circle cx="12" cy="12" r="5"   fill="var(--color-border)" opacity="0.8" />
            <circle cx="22" cy="8"  r="3.5" fill="var(--color-primary)" opacity="0.6" />
            <circle cx="8"  cy="22" r="3"   fill="var(--color-blush-soft)" opacity="0.7" />
            <line x1="12" y1="12" x2="35" y2="35" stroke="var(--color-primary)" strokeWidth="1"   opacity="0.3" />
            <line x1="22" y1="8"  x2="35" y2="35" stroke="var(--color-primary)" strokeWidth="0.8" opacity="0.25" />
            <line x1="8"  y1="22" x2="35" y2="35" stroke="var(--color-primary)" strokeWidth="0.8" opacity="0.25" />
            <circle cx="18" cy="6"  r="2" fill="var(--color-accent)" opacity="0.5" />
            <circle cx="6"  cy="18" r="2" fill="var(--color-accent)" opacity="0.5" />
          </svg>
        </div>
      </RevealSection>

    </div>
  )
}

// ─── App root ─────────────────────────────────────────────────────────────────

export default function App() {
  const [loading,  setLoading]  = useState(true)
  const [opened,   setOpened]   = useState(false)
  const [animDone, setAnimDone] = useState(false)
  const [cursor,   setCursor]   = useState({ x: 0, y: 0, active: false })

  const touchStartY  = useRef(null)
  const cursorTimer  = useRef(null)
  const countdown    = useCountdown(RECEPTION_DATE)

  // Initial load delay
  useEffect(() => {
    const id = setTimeout(() => setLoading(false), 1200)
    return () => clearTimeout(id)
  }, [])

  // Scroll depth CSS var (drives subtle bg shift)
  useEffect(() => {
    function handleScroll() {
      const max = Math.max(document.documentElement.scrollHeight - window.innerHeight, 1)
      document.documentElement.style.setProperty(
        '--scroll-depth',
        Math.min(window.scrollY / max, 1).toFixed(3),
      )
    }
    handleScroll()
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // Escape to close
  useEffect(() => {
    function handleKeyDown(e) {
      if (e.key === 'Escape' && animDone) closeCard()
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [animDone])

  // Cursor trail (desktop only)
  useEffect(() => {
    function handleMouseMove(e) {
      if (window.matchMedia('(pointer: coarse)').matches) return
      setCursor({ x: e.clientX, y: e.clientY, active: true })
      window.clearTimeout(cursorTimer.current)
      cursorTimer.current = window.setTimeout(
        () => setCursor((c) => ({ ...c, active: false })),
        400,
      )
    }
    window.addEventListener('mousemove', handleMouseMove)
    return () => {
      window.removeEventListener('mousemove', handleMouseMove)
      window.clearTimeout(cursorTimer.current)
    }
  }, [])

  function handleOpen() {
    if (opened) return
    playPaperRustle()
    setOpened(true)
    const delay = window.innerWidth < 768 ? 900 : 1050
    setTimeout(() => setAnimDone(true), delay)
  }

  function closeCard() {
    setAnimDone(false)
    window.setTimeout(() => setOpened(false), 40)
  }

  function handleTouchStart(e) {
    touchStartY.current = e.touches[0]?.clientY ?? null
  }

  function handleTouchEnd(e) {
    if (!animDone || touchStartY.current == null) return
    const endY = e.changedTouches[0]?.clientY ?? touchStartY.current
    if (touchStartY.current - endY > 60) closeCard()
    touchStartY.current = null
  }

  return (
    <main className="app-shell" onTouchStart={handleTouchStart} onTouchEnd={handleTouchEnd}>
      {/* Faint paper texture */}
      <div className="floral-page-pattern" />

      {/* Cursor trail */}
      <div className="cursor-trail" aria-hidden="true">
        {[0, 1, 2, 3].map((dot) => (
          <span
            key={dot}
            className={cursor.active ? 'active' : ''}
            style={{
              '--x':     `${cursor.x}px`,
              '--y':     `${cursor.y}px`,
              '--delay': `${dot * 50}ms`,
            }}
          />
        ))}
      </div>

      {/* Floating petals */}
      <div className="petal-field" aria-hidden="true">
        {petalData.map((p) => (
          <span
            className="petal"
            key={p.id}
            style={{
              '--left':         p.left,
              '--delay':        p.delay,
              '--duration':     p.duration,
              '--drift':        p.drift,
              '--petal-color':  p.color,
              '--rotate':       p.rotate,
              '--size':         `${p.size}px`,
              '--petal-opacity': p.opacity,
            }}
          />
        ))}
      </div>

      <AnimatePresence mode="wait">
        {loading ? (

          /* ── Loading screen ── */
          <motion.div
            key="loader"
            className="loader"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.45 }}
          >
            <p dir="rtl" lang="ar">{BISMILLAH}</p>
          </motion.div>

        ) : !animDone ? (

          /* ── Cover state ── */
          <motion.div
            key="closed-view"
            className={`closed-view ${opened ? 'is-opening' : ''}`}
            exit={{ opacity: 0, transition: { duration: 0.35, delay: 0.4 } }}
          >
            <div className="card-scene">
              <div className="opening-card">
                {/* Front face */}
                <div className={`card-cover ${opened ? 'opened' : ''}`}>
                  <CardFront onOpen={handleOpen} />
                </div>
                {/* Back/preview face revealed during fold */}
                <div className={`card-preview ${opened ? 'shadow-sweep' : ''}`}>
                  <FloralArch />
                  <p dir="rtl" lang="ar">{BISMILLAH}</p>
                </div>
              </div>
            </div>

            {/* "touch to open" prompt */}
            {!opened && (
              <motion.div
                className="tap-prompt-wrap"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.5, duration: 0.6 }}
              >
                <button
                  type="button"
                  className="tap-prompt"
                  onClick={handleOpen}
                  aria-label="Open invitation"
                >
                  <IconSparkle size={14} />
                  <span className="open-prompt-touch">touch to open</span>
                  <span className="open-prompt-click">click to open</span>
                  <IconSparkle size={14} />
                </button>
              </motion.div>
            )}
          </motion.div>

        ) : (

          /* ── Inner invitation state ── */
          <motion.div
            key="open-content"
            className="content-view"
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.6, delay: 0.3, ease: 'easeOut' }}
            onClick={(e) => e.stopPropagation()}
            onTouchStart={(e) => e.stopPropagation()}
            onTouchEnd={(e) => e.stopPropagation()}
          >
            <InnerContent countdown={countdown} />
          </motion.div>

        )}
      </AnimatePresence>
    </main>
  )
}
