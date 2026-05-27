import { useEffect, useMemo, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'

const BISMILLAH = 'بِسْمِ اللَّهِ الرَّحْمَنِ الرَّحِيمِ'
const DUA = 'رَبَّنَا هَبْ لَنَا مِنْ أَزْوَاجِنَا وَذُرِّيَّاتِنَا قُرَّةَ أَعْيُنٍ'
const NIKAH_DATE = '2026-08-20T10:00:00+05:30'

const nikahCalLink =
  'https://calendar.google.com/calendar/render?action=TEMPLATE&text=Asjad%27s+Nikah&dates=20260820T043000Z/20260820T073000Z&details=Come+celebrate+the+Nikah+of+Asjad+with+us&location=Berhampur+Indoor+Hall%2C+Berhampur%2C+Odisha'
const receptionCalLink =
  'https://calendar.google.com/calendar/render?action=TEMPLATE&text=Asjad%27s+Reception&dates=20260823T133000Z/20260823T163000Z&details=Come+celebrate+the+Reception+of+Asjad+with+us&location=Function+Palace%2C+Berhampur%2C+Odisha'

const events = [
  {
    icon: '🌸',
    title: 'Nikah',
    day: 'Wednesday',
    date: 'August 20, 2026',
    venue: 'at Berhampur Indoor Hall',
    city: 'Berhampur, Odisha',
    map: 'https://www.google.com/maps/search/Berhampur+Indoor+Hall+Berhampur+Odisha',
    lean: 'left',
  },
  {
    icon: '🌸',
    title: 'Reception',
    day: 'Saturday',
    date: 'August 23, 2026',
    venue: 'at Function Palace',
    city: 'Berhampur, Odisha',
    map: 'https://www.google.com/maps/search/Function+Palace+Berhampur+Odisha',
    lean: 'right',
  },
]

const petals = Array.from({ length: 18 }, (_, index) => ({
  id: index,
  left: `${(index * 31 + 7) % 100}%`,
  delay: `${(index * 1.1) % 11}s`,
  duration: `${10 + (index % 10)}s`,
  drift: `${index % 2 === 0 ? 42 + index * 2 : -34 - index}px`,
  color: ['#FFCDD2', '#F8BBD0', '#E8A0B0'][index % 3],
  rotate: `${(index * 47) % 360}deg`,
}))

function useCountdown(targetDate) {
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 })

  useEffect(() => {
    function calc() {
      const diff = Math.max(new Date(targetDate).getTime() - Date.now(), 0)
      setTimeLeft({
        days: Math.floor(diff / 86400000),
        hours: Math.floor((diff % 86400000) / 3600000),
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

function playPaperRustle() {
  try {
    const AudioContext = window.AudioContext || window.webkitAudioContext
    if (!AudioContext) return
    const ctx = new AudioContext()
    const buffer = ctx.createBuffer(1, ctx.sampleRate * 0.08, ctx.sampleRate)
    const data = buffer.getChannelData(0)
    for (let i = 0; i < data.length; i += 1) {
      data[i] = (Math.random() * 2 - 1) * (1 - i / data.length)
    }
    const source = ctx.createBufferSource()
    const filter = ctx.createBiquadFilter()
    const gain = ctx.createGain()
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
    // Audio feedback is decorative; silently skip when blocked.
  }
}

function FloralCorner({ position }) {
  return (
    <svg className={`floral-corner ${position}`} viewBox="0 0 90 90" aria-hidden="true">
      <path className="stem" d="M12 76C24 58 38 42 75 17" />
      <path className="stem" d="M20 72C27 61 30 52 29 39" />
      <path className="stem" d="M41 48C52 49 61 45 70 35" />
      <ellipse className="leaf" cx="29" cy="39" rx="5" ry="12" transform="rotate(-30 29 39)" />
      <ellipse className="leaf" cx="56" cy="42" rx="5" ry="12" transform="rotate(55 56 42)" />
      <g className="flower" transform="translate(69 20)">
        <circle r="4" />
        <ellipse rx="5" ry="9" transform="rotate(0)" />
        <ellipse rx="5" ry="9" transform="rotate(72)" />
        <ellipse rx="5" ry="9" transform="rotate(144)" />
        <ellipse rx="5" ry="9" transform="rotate(216)" />
        <ellipse rx="5" ry="9" transform="rotate(288)" />
      </g>
      <g className="flower small" transform="translate(28 61)">
        <circle r="3" />
        <ellipse rx="4" ry="7" transform="rotate(0)" />
        <ellipse rx="4" ry="7" transform="rotate(90)" />
        <ellipse rx="4" ry="7" transform="rotate(180)" />
        <ellipse rx="4" ry="7" transform="rotate(270)" />
      </g>
      <circle className="bud" cx="46" cy="42" r="3" />
      <circle className="bud" cx="38" cy="55" r="2.4" />
    </svg>
  )
}

function FloralArch() {
  return (
    <svg className="floral-arch" viewBox="0 0 420 120" aria-hidden="true">
      <path className="arch-stem" d="M34 94C92 32 160 18 210 36C260 18 328 32 386 94" />
      <path className="arch-stem" d="M94 54C104 76 122 88 148 91" />
      <path className="arch-stem" d="M326 54C316 76 298 88 272 91" />
      {[78, 126, 294, 342].map((x, i) => (
        <g className="arch-rose" transform={`translate(${x} ${i % 2 ? 45 : 67})`} key={x}>
          <circle r="5" />
          <path d="M0-13C8-10 12-4 10 3C3 12-7 11-11 2C-13-6-8-11 0-13Z" />
          <path d="M-10 1C-5-7 5-7 10 1" />
        </g>
      ))}
      {[108, 156, 190, 230, 264, 312].map((x, i) => (
        <ellipse
          className="arch-leaf"
          key={x}
          cx={x}
          cy={i % 2 ? 43 : 57}
          rx="6"
          ry="15"
          transform={`rotate(${i % 2 ? -48 : 48} ${x} ${i % 2 ? 43 : 57})`}
        />
      ))}
      <circle className="arch-bud" cx="210" cy="34" r="4" />
      <circle className="arch-bud" cx="176" cy="37" r="2.6" />
      <circle className="arch-bud" cx="244" cy="37" r="2.6" />
    </svg>
  )
}

function FloralDivider({ className = '' }) {
  return (
    <svg className={`floral-divider ${className}`} viewBox="0 0 260 34" aria-hidden="true">
      <path d="M10 17H102M158 17H250" />
      <path d="M104 17C116 8 126 8 130 17C134 8 144 8 156 17C144 26 134 26 130 17C126 26 116 26 104 17Z" />
      <ellipse cx="84" cy="13" rx="4" ry="10" transform="rotate(62 84 13)" />
      <ellipse cx="176" cy="13" rx="4" ry="10" transform="rotate(-62 176 13)" />
      <ellipse cx="98" cy="22" rx="4" ry="9" transform="rotate(-58 98 22)" />
      <ellipse cx="162" cy="22" rx="4" ry="9" transform="rotate(58 162 22)" />
      <circle cx="130" cy="17" r="3" />
    </svg>
  )
}

function CrescentMark() {
  return (
    <svg className="crescent-mark" width="80" height="80" viewBox="0 0 80 80" fill="none" aria-hidden="true">
      <path d="M46 12C32 12 22 23 22 38C22 53 33 64 48 64C55 64 61 61 65 56C60 59 54 60 48 58C36 54 29 43 32 31C34 22 40 16 46 12Z" fill="#A0687A"/>
      <path d="M56 16L58 22L64 23L59 27L61 33L56 30L51 33L53 27L48 23L54 22Z" fill="#A0687A"/>
    </svg>
  )
}

function GroomSilhouette() {
  return (
    <svg className="silhouette groom" viewBox="0 0 160 320" aria-hidden="true">
      <path d="M80 20c19 0 32 14 32 34s-13 35-32 35-32-15-32-35 13-34 32-34Z" />
      <path d="M43 94c19-12 55-12 74 0 12 32 16 92 11 190H32c-5-98-1-158 11-190Z" />
      <path d="M49 104h62v176H49z" fill="none" stroke="currentColor" strokeWidth="4" />
      <path d="M80 104v176M63 122h34M61 150h38M64 178h32" fill="none" stroke="#A0687A" strokeWidth="3" />
      <path d="M31 124c-14 39-14 87-3 139M129 124c14 39 14 87 3 139" fill="none" stroke="currentColor" strokeWidth="16" strokeLinecap="round" />
    </svg>
  )
}

function BrideSilhouette() {
  return (
    <svg className="silhouette bride" viewBox="0 0 170 320" aria-hidden="true">
      <path d="M86 26c30 6 47 36 41 73-4 25-18 43-41 55-23-12-37-30-41-55-6-37 11-67 41-73Z" />
      <path d="M57 121c19 17 39 17 58 0 24 42 37 96 43 167H14c6-71 19-125 43-167Z" />
      <path d="M45 146c-15 36-22 80-22 132M126 146c15 36 22 80 22 132" fill="none" stroke="currentColor" strokeWidth="18" strokeLinecap="round" />
      <path d="M54 278c28-20 61-20 88 0" fill="none" stroke="#A0687A" strokeWidth="4" />
    </svg>
  )
}

function BismillahReveal() {
  const chars = useMemo(() => {
    const letters = Array.from(BISMILLAH)
    const center = (letters.length - 1) / 2
    return letters.map((char, index) => ({ char, delay: Math.abs(index - center) * 0.025 }))
  }, [])

  return (
    <p className="bismillah-text" dir="rtl" aria-label={BISMILLAH}>
      {chars.map(({ char, delay }, index) => (
        <motion.span
          key={`${char}-${index}`}
          initial={{ opacity: 0, y: 12, scale: 0.94 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ delay: 0.3 + delay, duration: 0.45, ease: 'easeOut' }}
        >
          {char === ' ' ? '\u00A0' : char}
        </motion.span>
      ))}
    </p>
  )
}

function RevealSection({ children, className = '', delay = 0 }) {
  return (
    <motion.section
      className={className}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.18 }}
      transition={{ duration: 0.6, ease: 'easeOut', delay }}
    >
      {children}
    </motion.section>
  )
}

function CountdownBox({ label, value }) {
  const [changed, setChanged] = useState(false)
  const prev = useRef(value)

  useEffect(() => {
    if (prev.current !== value) {
      setChanged(true)
      const id = setTimeout(() => setChanged(false), 360)
      prev.current = value
      return () => clearTimeout(id)
    }
    return undefined
  }, [value])

  return (
    <div className="countdown-box">
      <span className="count-number-wrap">
        <AnimatePresence mode="popLayout">
          <motion.span
            key={value}
            className={`count-number ${changed ? 'is-rolling' : ''}`}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.26, ease: 'easeOut' }}
          >
            {String(value ?? 0).padStart(2, '0')}
          </motion.span>
        </AnimatePresence>
      </span>
      <span className="count-label">{label}</span>
    </div>
  )
}

function ConfettiButton({ href, children }) {
  const [burst, setBurst] = useState(false)

  function handleClick() {
    setBurst(true)
    setTimeout(() => setBurst(false), 650)
  }

  return (
    <a href={href} target="_blank" rel="noopener noreferrer" className="calendar-btn" onClick={handleClick}>
      {children}
      {burst && (
        <span className="confetti-burst" aria-hidden="true">
          {Array.from({ length: 6 }).map((_, index) => (
            <i key={index} />
          ))}
        </span>
      )}
    </a>
  )
}

function EventCard({ event }) {
  return (
    <article className={`event-card ${event.lean}`}>
      <div className="event-icon">{event.icon}</div>
      <h3>{event.title}</h3>
      <FloralDivider className="event-divider" />
      <p className="event-day">{event.day}</p>
      <p className="event-date">{event.date}</p>
      <p className="event-venue">{event.venue}</p>
      <p className="event-city">{event.city}</p>
      <div className="venue-separator" />
      <a className="maps-btn" href={event.map} target="_blank" rel="noopener noreferrer">
        <span className="map-pin">📍</span>
        <span>Open in Google Maps</span>
      </a>
    </article>
  )
}

function CardFront({ onOpen, opened }) {
  const [tilt, setTilt] = useState({ x: 0, y: 0 })
  const touchStartY = useRef(null)

  function handleMouseMove(event) {
    if (opened) return
    const rect = event.currentTarget.getBoundingClientRect()
    const x = ((event.clientY - rect.top) / rect.height - 0.5) * -12
    const y = ((event.clientX - rect.left) / rect.width - 0.5) * 12
    setTilt({ x: Math.max(-6, Math.min(6, x)), y: Math.max(-6, Math.min(6, y)) })
  }

  function handleCardTouchStart(event) {
    touchStartY.current = event.touches[0]?.clientY ?? null
  }

  function handleCardTouchEnd(event) {
    if (touchStartY.current == null) return
    const endY = event.changedTouches[0]?.clientY ?? touchStartY.current
    if (Math.abs(endY - touchStartY.current) >= 10) {
      // Finger moved — this was a scroll, not a tap. Suppress the ghost click.
      event.preventDefault()
    }
    touchStartY.current = null
  }

  return (
    <button
      className="closed-card"
      type="button"
      onClick={onOpen}
      onMouseMove={handleMouseMove}
      onMouseLeave={() => setTilt({ x: 0, y: 0 })}
      onTouchStart={handleCardTouchStart}
      onTouchEnd={handleCardTouchEnd}
      style={{ '--tilt-x': `${tilt.x}deg`, '--tilt-y': `${tilt.y}deg` }}
      aria-label="Open wedding invitation"
    >
      <FloralCorner position="tl" />
      <FloralCorner position="tr" />
      <FloralCorner position="br" />
      <FloralCorner position="bl" />
      <div className="closed-card-content">
        <p className="closed-bismillah" dir="rtl">{BISMILLAH}</p>
        <CrescentMark />
        <p className="closed-subtitle">a wedding invitation</p>
        <p className="closed-monogram">Asjad · 2026</p>
      </div>
      <span className="card-shimmer" />
    </button>
  )
}

function CardInside({ countdown }) {
  return (
    <div className="open-card">
      <FloralCorner position="tl" />
      <FloralCorner position="tr" />
      <FloralCorner position="br" />
      <FloralCorner position="bl" />
      <GroomSilhouette />
      <BrideSilhouette />

      <div className="open-card-content">
        <RevealSection className="bismillah-section" delay={0.3}>
          <FloralArch />
          <BismillahReveal />
        </RevealSection>

        <RevealSection className="intro-section" delay={0.8}>
          <p className="intro-copy">
            With the grace of <span className="word-allah">Allah ﷻ</span>
            <br />
            and the joy of <i>two families coming together</i>,
          </p>
          <p className="invite-line">
            we joyfully invite you to <i>witness and celebrate</i>
          </p>
          <p className="nikah-of">
            the <span className="word-nikah">Nikah</span> of
          </p>
          <h1 className="name-shimmer">Asjad</h1>
          <p className="bride-connector">with the daughter of</p>
          <p className="bride-father">Mohammed Nishat (Gopalpur)</p>
        </RevealSection>

        <FloralDivider className="section-divider after-name" />

        <RevealSection className="events-grid" delay={1.4}>
          {events.map((event) => (
            <EventCard event={event} key={event.title} />
          ))}
        </RevealSection>

        <FloralDivider className="section-divider" />

        <RevealSection className="countdown-section" delay={1.9}>
          <p>until we say qubool hai</p>
          <div className="countdown-grid">
            <CountdownBox label="Days" value={countdown.days} />
            <CountdownBox label="Hours" value={countdown.hours} />
            <CountdownBox label="Minutes" value={countdown.minutes} />
            <CountdownBox label="Seconds" value={countdown.seconds} />
          </div>
        </RevealSection>

        <div className="message-box-wrapper">
          <RevealSection className="message-box" delay={2.3}>
            <p>
              <span style={{ fontWeight: 600, color: '#7D4F5E' }}>JazakAllah Khair</span> for being part
              of this beautiful journey. it would mean{' '}
              <span style={{ fontStyle: 'italic', fontWeight: 600 }}>everything</span> to have you there 💚
            </p>
          </RevealSection>
        </div>

        <RevealSection className="calendar-actions" delay={2.7}>
          <ConfettiButton href={nikahCalLink}>✨ 📅 Save Nikah to Calendar</ConfettiButton>
          <ConfettiButton href={receptionCalLink}>✨ 📅 Save Reception to Calendar</ConfettiButton>
        </RevealSection>

        <RevealSection className="footer-section" delay={3}>
          <p className="made-with-love">August 2026 · with so much love</p>
          <p className="dua-text" dir="rtl">{DUA}</p>
          <p className="dua-translation">"Our Lord, grant us from among our spouses and offspring comfort to our eyes"</p>
          <p className="surah">Surah Al-Furqan 25:74</p>
        </RevealSection>
      </div>
    </div>
  )
}

export default function App() {
  const [loading, setLoading] = useState(true)
  const [opened, setOpened] = useState(false)
  const [animDone, setAnimDone] = useState(false)
  const [cursor, setCursor] = useState({ x: 0, y: 0, active: false })
  const touchStartY = useRef(null)
  const cursorTimer = useRef(null)
  const countdown = useCountdown(NIKAH_DATE)

  useEffect(() => {
    const id = setTimeout(() => setLoading(false), 1200)
    return () => clearTimeout(id)
  }, [])

  useEffect(() => {
    function handleScroll() {
      const max = Math.max(document.documentElement.scrollHeight - window.innerHeight, 1)
      document.documentElement.style.setProperty('--scroll-depth', Math.min(window.scrollY / max, 1).toFixed(3))
    }

    handleScroll()
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  useEffect(() => {
    function handleKeyDown(event) {
      if (event.key === 'Escape' && animDone) {
        closeCard()
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [animDone])

  useEffect(() => {
    function handleMouseMove(event) {
      if (window.matchMedia('(pointer: coarse)').matches) return
      setCursor({ x: event.clientX, y: event.clientY, active: true })
      window.clearTimeout(cursorTimer.current)
      cursorTimer.current = window.setTimeout(() => {
        setCursor((current) => ({ ...current, active: false }))
      }, 400)
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
    setTimeout(() => setAnimDone(true), 1120)
  }

  function closeCard() {
    setAnimDone(false)
    window.setTimeout(() => setOpened(false), 40)
  }

  function handleTouchStart(event) {
    touchStartY.current = event.touches[0]?.clientY ?? null
  }

  function handleTouchEnd(event) {
    if (!animDone || touchStartY.current == null) return
    const endY = event.changedTouches[0]?.clientY ?? touchStartY.current
    if (touchStartY.current - endY > 60) {
      closeCard()
    }
    touchStartY.current = null
  }

  return (
    <main className="app-shell" onTouchStart={handleTouchStart} onTouchEnd={handleTouchEnd}>
      <div className="floral-page-pattern" />
      <div className="cursor-trail" aria-hidden="true">
        {[0, 1, 2, 3].map((dot) => (
          <span
            key={dot}
            className={cursor.active ? 'active' : ''}
            style={{
              '--x': `${cursor.x}px`,
              '--y': `${cursor.y}px`,
              '--delay': `${dot * 50}ms`,
            }}
          />
        ))}
      </div>
      <div className="petal-field" aria-hidden="true">
        {petals.map((petal) => (
          <span
            className="petal"
            key={petal.id}
            style={{
              '--left': petal.left,
              '--delay': petal.delay,
              '--duration': petal.duration,
              '--drift': petal.drift,
              '--petal-color': petal.color,
              '--rotate': petal.rotate,
            }}
          />
        ))}
      </div>

      <AnimatePresence mode="wait">
        {loading ? (
          <motion.div
            key="loader"
            className="loader"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, scale: 0.98 }}
            transition={{ duration: 0.45 }}
          >
            <p dir="rtl">{BISMILLAH}</p>
          </motion.div>
        ) : !animDone ? (
          <motion.div
            key="closed-view"
            className={`closed-view ${opened ? 'is-opening' : ''}`}
            exit={{ opacity: 0, transition: { duration: 0.35, delay: 0.5 } }}
          >
            <div className="card-scene">
              <div className="opening-card">
                <div className={`card-cover ${opened ? 'opened' : ''}`}>
                  <CardFront onOpen={handleOpen} opened={opened} />
                </div>
                <div className={`card-preview ${opened ? 'shadow-sweep' : ''}`}>
                  <FloralArch />
                  <p dir="rtl">{BISMILLAH}</p>
                </div>
              </div>
            </div>
            {!opened && (
              <motion.button
                type="button"
                className="tap-prompt"
                onClick={handleOpen}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.5, duration: 0.8 }}
              >
                touch to open
              </motion.button>
            )}
          </motion.div>
        ) : (
          <motion.div
            key="open-content"
            className="content-view"
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 12 }}
            transition={{ duration: 0.55, ease: 'easeOut' }}
            onClick={(e) => e.stopPropagation()}
            onTouchStart={(e) => e.stopPropagation()}
            onTouchEnd={(e) => e.stopPropagation()}
          >
            <CardInside countdown={countdown} />
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  )
}
