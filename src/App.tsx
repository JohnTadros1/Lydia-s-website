import { useEffect, useId, useRef, useState } from 'react';
import {
  ArrowUpRight,
  ArrowRight,
  ArrowDown,
  ChevronLeft,
  ChevronRight,
  Menu,
  X,
  Plus,
  Minus,
  Check,
  Pause,
  Play,
  Heart,
  Download,
} from 'lucide-react';
import { faqs, portfolioPhotos, tiers } from './content';
import PortfolioViewer from './PortfolioViewer';
import { consultationNotes, googleFormLinks } from './form-utils.mjs';

function Botanical({ className = '' }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 140 200" fill="none" aria-hidden="true">
      <path
        d="M69 188C82 140 49 102 82 21M68 158C42 154 23 137 20 113C45 112 67 131 68 158ZM69 136C95 130 114 111 114 88C89 89 70 113 69 136ZM65 106C39 99 28 78 32 56C54 61 68 83 65 106ZM73 73C96 67 106 50 105 31C86 34 76 50 73 73ZM81 30C73 17 77 7 85 2C94 13 91 25 81 30Z"
        stroke="currentColor"
        strokeWidth="1.3"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function useMotionPreference() {
  const [reduced, setReduced] = useState(
    () => window.matchMedia('(prefers-reduced-motion: reduce)').matches,
  );
  useEffect(() => {
    const media = window.matchMedia('(prefers-reduced-motion: reduce)');
    const update = () => setReduced(media.matches);
    media.addEventListener('change', update);
    return () => media.removeEventListener('change', update);
  }, []);
  return reduced;
}

function Header() {
  const [open, setOpen] = useState(false);
  const menuTrigger = useRef<HTMLButtonElement>(null);
  useEffect(() => {
    function onEscape(event: KeyboardEvent) {
      if (event.key === 'Escape' && open) {
        setOpen(false);
        menuTrigger.current?.focus();
      }
    }
    window.addEventListener('keydown', onEscape);
    return () => window.removeEventListener('keydown', onEscape);
  }, [open]);
  return (
    <header className="site-header">
      <div className="header-inner">
        <a
          className="wordmark"
          href="#home"
          aria-label="LydsEvents home"
          onClick={() => setOpen(false)}
        >
          <span>Lyds</span>
          <span className="wordmark-events">EVENTS</span>
          <span className="logo-flower">✳︎</span>
        </a>
        <button
          ref={menuTrigger}
          className="mobile-menu"
          onClick={() => setOpen(!open)}
          aria-label={open ? 'Close menu' : 'Open menu'}
          aria-expanded={open}
          aria-controls="main-navigation"
        >
          {open ? <X /> : <Menu />}
        </button>
        <nav
          id="main-navigation"
          className={open ? 'navigation is-open' : 'navigation'}
          aria-label="Main navigation"
        >
          <a href="#approach" onClick={() => setOpen(false)}>
            The approach
          </a>
          <a href="#portfolio" onClick={() => setOpen(false)}>
            Portfolio
          </a>
          <a href="#services" onClick={() => setOpen(false)}>
            Ways to work together
          </a>
          <a href="#faq" onClick={() => setOpen(false)}>
            FAQs
          </a>
          <a className="button button-small" href="#consultation" onClick={() => setOpen(false)}>
            Let’s plan your day <ArrowUpRight size={16} />
          </a>
        </nav>
      </div>
    </header>
  );
}

function Hero() {
  return (
    <section className="hero section-wrap" id="home">
      <div className="hero-copy">
        <p className="eyebrow">
          <span className="tiny-star">✳︎</span> A LITTLE CALM FOR YOUR BIGGEST DAYS
        </p>
        <h1>
          Your moment.
          <br />
          <em>My heart.</em>
          <br />
          Every detail.
        </h1>
        <p className="hero-description">
          Thoughtful wedding & event coordination,
          <br className="desktop-break" /> so you can be fully present for the good stuff.
        </p>
        <div className="hero-actions">
          <a className="button" href="#consultation">
            Let’s make it yours <ArrowUpRight size={18} />
          </a>
          <a className="text-link" href="#portfolio">
            A glimpse of the magic <ArrowDown size={15} />
          </a>
        </div>
        <div className="hero-note">
          <span className="handwritten">You make the memories.</span>
          <span>I’ll take care of the details.</span>
          <svg aria-hidden="true" viewBox="0 0 73 34">
            <path
              d="M2 3C20 28 40 31 67 15M55 13L68 14L63 26"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.2"
            />
          </svg>
        </div>
      </div>
      <div className="hero-visual">
        <div className="hero-image-wrap">
          <img
            className="hero-image"
            src={`${import.meta.env.BASE_URL}images/portfolio/engagement-arch.jpg`}
            alt="White draping and greenery at Lydia’s outdoor engagement celebration"
            fetchPriority="high"
          />
          <span className="image-credit">LYDIA’S ENGAGEMENT CELEBRATION</span>
        </div>
        <div className="hero-stamp">
          <Heart size={21} strokeWidth={1.2} />
          <span>
            all the love.
            <br />
            <em>none of the worry.</em>
          </span>
        </div>
        <div className="hero-image-caption">
          <span>FOR THE MOMENTS THAT MATTER</span>
          <span>01 — ∞</span>
        </div>
      </div>
      <a className="scroll-note" href="#approach">
        <span>A BEAUTIFUL DAY STARTS HERE</span>
        <ArrowDown size={14} />
      </a>
    </section>
  );
}

function Approach() {
  return (
    <>
      <div className="promise-strip">
        <span>Thoughtfully planned</span>
        <span aria-hidden="true">✳︎</span>
        <span>Lovingly coordinated</span>
        <span aria-hidden="true">✳︎</span>
        <span>Wholeheartedly celebrated</span>
      </div>
      <section className="approach section-wrap reveal" id="approach">
        <div className="approach-heading">
          <p className="eyebrow">THE HEART BEHIND LYDSEVENTS</p>
          <h2>
            A little less logistics.
            <br />
            <em>A lot more living.</em>
          </h2>
          <Botanical className="approach-botanical" />
        </div>
        <div className="approach-copy">
          <p className="intro">
            Hi, I’m Lydia. Your calm in the excitement,
            <br className="desktop-break" /> your extra pair of hands, your person.
          </p>
          <p>
            You’ve spent so much time imagining this day. You deserve to enjoy it — not spend it
            answering vendor calls, watching the clock, or wondering what comes next.
          </p>
          <p>
            That’s where I come in. From bringing your plans together to quietly handling the
            unexpected, I’m here to make the day feel as good as it looks.
          </p>
          <a className="text-link" href="#services">
            Find your kind of support <ArrowRight size={17} />
          </a>
        </div>
      </section>
    </>
  );
}

function Portfolio() {
  const hasPortfolio = portfolioPhotos.length > 0;
  const photos = portfolioPhotos;
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);
  const [hovered, setHovered] = useState(false);
  const [focused, setFocused] = useState(false);
  const [visible, setVisible] = useState(true);
  const [announcement, setAnnouncement] = useState('');
  const swipeStart = useRef<number | null>(null);
  const reduced = useMotionPreference();
  const regionId = useId();
  useEffect(() => {
    const update = () => setVisible(!document.hidden);
    document.addEventListener('visibilitychange', update);
    return () => document.removeEventListener('visibilitychange', update);
  }, []);
  useEffect(() => {
    if (paused || hovered || focused || reduced || !visible || photos.length < 2) return;
    const timer = window.setInterval(() => setActive((index) => (index + 1) % photos.length), 6500);
    return () => window.clearInterval(timer);
  }, [paused, hovered, focused, reduced, visible, photos.length]);
  function goTo(index: number) {
    const next = (index + photos.length) % photos.length;
    setActive(next);
    setAnnouncement(`Image ${next + 1} of ${photos.length}: ${photos[next].title}`);
  }
  return (
    <section className="portfolio-section" id="portfolio">
      <div className="section-wrap">
        <div className="section-heading reveal">
          <div>
            <p className="eyebrow">THE FEELING WE’RE HERE FOR</p>
            <h2>
              Beautiful details.
              <br />
              <em>Even better memories.</em>
            </h2>
          </div>
          <div className="section-heading-aside">
            <p>
              A day filled with your favorite people.
              <br />A thousand little details that feel like you.
            </p>
            <PortfolioViewer />
          </div>
        </div>
        <div
          className="gallery reveal"
          role="region"
          aria-roledescription="carousel"
          aria-label={hasPortfolio ? 'LydsEvents portfolio' : 'Wedding inspiration gallery'}
          onMouseEnter={() => setHovered(true)}
          onMouseLeave={() => setHovered(false)}
          onFocusCapture={() => setFocused(true)}
          onBlurCapture={(event) => {
            if (!event.currentTarget.contains(event.relatedTarget)) setFocused(false);
          }}
          onKeyDown={(event) => {
            if (event.key === 'ArrowLeft' || event.key === 'ArrowRight') {
              event.preventDefault();
              goTo(active + (event.key === 'ArrowRight' ? 1 : -1));
            }
          }}
        >
          <div
            className="gallery-viewport"
            id={regionId}
            onTouchStart={(event) => {
              swipeStart.current = event.changedTouches[0].clientX;
            }}
            onTouchEnd={(event) => {
              if (swipeStart.current !== null) {
                const delta = event.changedTouches[0].clientX - swipeStart.current;
                if (Math.abs(delta) > 45) goTo(active + (delta < 0 ? 1 : -1));
                swipeStart.current = null;
              }
            }}
          >
            {photos.map((photo, index) => (
              <div
                key={photo.src}
                className={`gallery-slide ${index === active ? 'is-active' : ''}`}
                aria-hidden={index !== active}
                role="group"
                aria-roledescription="slide"
                aria-label={`${index + 1} of ${photos.length}`}
              >
                <img
                  src={photo.src}
                  alt={photo.alt}
                  loading="lazy"
                  style={{ objectPosition: photo.position }}
                />
                <div className="gallery-shade" />
                <div className="gallery-caption">
                  <p className="eyebrow">{photo.category}</p>
                  <h3>{photo.title}</h3>
                </div>
              </div>
            ))}
            <div className="gallery-topline">
              <span>
                {hasPortfolio ? 'A FEW FAVORITE MOMENTS' : 'A LITTLE WEDDING INSPIRATION'}
              </span>
              <span className="gallery-count">
                {String(active + 1).padStart(2, '0')}
                <span> / {String(photos.length).padStart(2, '0')}</span>
              </span>
            </div>
            <div className="gallery-arrows">
              <button
                className="circle-button"
                onClick={() => goTo(active - 1)}
                aria-label="Previous photo"
                aria-controls={regionId}
              >
                <ChevronLeft size={20} />
              </button>
              <button
                className="circle-button"
                onClick={() => goTo(active + 1)}
                aria-label="Next photo"
                aria-controls={regionId}
              >
                <ChevronRight size={20} />
              </button>
            </div>
          </div>
          <div className="gallery-bottom">
            <p>
              {hasPortfolio
                ? 'Real celebrations. Thoughtfully brought together.'
                : 'Illustrative inspiration imagery. See Lydia’s work in the portfolio above.'}
            </p>
            <div className="gallery-playback">
              <div className="gallery-dots" role="group" aria-label="Choose a photo">
                {photos.map((photo, index) => (
                  <button
                    key={photo.src}
                    aria-label={`Show photo ${index + 1}`}
                    aria-pressed={index === active}
                    onClick={() => goTo(index)}
                    className={index === active ? 'active' : ''}
                  >
                    <span />
                  </button>
                ))}
              </div>
              {!reduced && (
                <button
                  className="pause-button"
                  aria-label={paused ? 'Play photo slideshow' : 'Pause photo slideshow'}
                  aria-pressed={paused}
                  onClick={() => setPaused(!paused)}
                >
                  {paused ? <Play size={14} /> : <Pause size={14} />}
                </button>
              )}
            </div>
          </div>
          <p className="sr-only" role="status" aria-live="polite">
            {announcement}
          </p>
        </div>
      </div>
    </section>
  );
}

function Services({ onSelect }: { onSelect: (tier: string) => void }) {
  return (
    <section className="services section-wrap" id="services">
      <div className="center-heading reveal">
        <p className="eyebrow">A LITTLE HELP. A WHOLE LOT OF HEART.</p>
        <h2>
          Your plans. <em>My helping hands.</em>
        </h2>
        <p>The earlier I come in, the more I take off your plate.</p>
        <div className="price-pill">
          <span>$500</span> / week <span className="price-dot">·</span> Thoughtful support, at every
          stage
        </div>
      </div>
      <div className="tier-grid">
        {tiers.map((tier, index) => (
          <article
            key={tier.number}
            className={`tier-card reveal ${index === 1 ? 'tier-featured' : ''}`}
          >
            <div className="tier-number">
              <span>TIER {tier.number}</span>
              {index === 1 ? (
                <Heart size={17} strokeWidth={1.4} />
              ) : (
                <span className="tier-star" aria-hidden="true">
                  ✳︎
                </span>
              )}
            </div>
            <p className="tier-timing">{tier.timing}</p>
            <h3>{tier.name}</h3>
            <p className="tier-description">{tier.label}</p>
            <div className="tier-list">
              <h4>YOU PLAN</h4>
              <ul>
                {tier.you.map((item) => (
                  <li key={item}>
                    <span className="list-dot" aria-hidden="true" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
            <div className="tier-list execution-list">
              <h4>{tier.meTitle}</h4>
              <ul>
                {tier.me.map((item) => (
                  <li key={item}>
                    <Check size={14} aria-hidden="true" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
              {tier.vendors && (
                <ul className="vendor-list">
                  {tier.vendors.map((vendor) => (
                    <li key={vendor}>{vendor}</li>
                  ))}
                </ul>
              )}
            </div>
            <a
              href="#consultation"
              className={`button tier-button ${index === 1 ? '' : 'button-outline'}`}
              onClick={() => onSelect(tier.timing)}
            >
              This sounds like me <ArrowUpRight size={17} />
              <span className="sr-only"> — {tier.timing}</span>
            </a>
          </article>
        ))}
      </div>
      <p className="services-note">
        Not sure where you fit? We’ll figure it out together.{' '}
        <a href="#consultation">
          Let’s have a conversation <ArrowUpRight size={14} />
        </a>
      </p>
    </section>
  );
}

function Process() {
  return (
    <section className="process-section">
      <div className="section-wrap process-inner">
        <div className="process-heading">
          <p className="eyebrow">
            FROM “WHERE DO I START?”
            <br />
            TO “THAT WAS EVERYTHING.”
          </p>
          <h2>
            Simple steps.
            <br />
            <em>Something wonderful.</em>
          </h2>
          <Botanical className="process-botanical" />
        </div>
        <div className="process-steps">
          {[
            {
              title: 'Tell me your story',
              text: 'Share a little about your day, your plans so far, and where you’d love a helping hand.',
            },
            {
              title: 'Find your kind of support',
              text: 'We’ll talk through the details and choose the right amount of support for you.',
            },
            {
              title: 'Be here for all of it',
              text: 'I’ll bring the plans together. You soak in every hug, happy tear, and last dance.',
            },
          ].map((step, i) => (
            <div className="process-step reveal" key={step.title}>
              <span className="step-number">0{i + 1}</span>
              <div>
                <h3>{step.title}</h3>
                <p>{step.text}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function FAQ() {
  const [open, setOpen] = useState<number | null>(0);
  return (
    <section className="faq-section section-wrap" id="faq">
      <div className="faq-heading reveal">
        <p className="eyebrow">A FEW THINGS YOU MIGHT BE WONDERING</p>
        <h2>
          Good questions.
          <br />
          <em>Thoughtful answers.</em>
        </h2>
        <p>
          There’s no such thing as too many questions.
          <br />
          Let’s make the next step feel easy.
        </p>
      </div>
      <div className="faq-list reveal">
        {faqs.map((faq, i) => (
          <div className={`faq-item ${open === i ? 'is-open' : ''}`} key={faq.question}>
            <h3>
              <button
                onClick={() => setOpen(open === i ? null : i)}
                aria-expanded={open === i}
                aria-controls={`faq-answer-${i}`}
                id={`faq-question-${i}`}
              >
                {faq.question}
                {open === i ? <Minus size={18} /> : <Plus size={18} />}
              </button>
            </h3>
            <div
              className="faq-answer"
              id={`faq-answer-${i}`}
              role="region"
              aria-labelledby={`faq-question-${i}`}
              hidden={open !== i}
            >
              <p>{faq.answer}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

function Consultation({ selectedTier }: { selectedTier: string | null }) {
  const formLinks = googleFormLinks(import.meta.env.VITE_GOOGLE_FORM_URL);
  const [saved, setSaved] = useState(false);
  function saveNotes(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const notes = consultationNotes(new FormData(event.currentTarget), selectedTier);
    const blob = new Blob([notes], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement('a');
    anchor.href = url;
    anchor.download = 'LydsEvents-consultation-notes.txt';
    document.body.appendChild(anchor);
    anchor.click();
    anchor.remove();
    window.setTimeout(() => URL.revokeObjectURL(url), 1000);
    setSaved(true);
  }
  return (
    <section className="consultation-section" id="consultation">
      <div className="section-wrap consultation-inner">
        <div className="consultation-copy reveal">
          <p className="eyebrow">YOUR DAY STARTS WITH A HELLO</p>
          <h2>
            Let’s make room
            <br />
            for <em>the magic.</em>
          </h2>
          <p>
            Tell me what you’re dreaming of, what’s already in motion, and what feels a little
            overwhelming. We’ll take it from there.
          </p>
          <div className="consultation-love">
            <Heart size={22} strokeWidth={1.2} />
            <span>
              Big plans or just a little idea.
              <br />
              You’re in the right place.
            </span>
          </div>
          <Botanical className="consultation-botanical" />
        </div>
        <div className="consultation-card reveal">
          {selectedTier && (
            <div className="selected-tier">
              <Check size={15} />
              <span>
                Let’s talk about: <strong>{selectedTier}</strong>
                {formLinks && (
                  <span className="tier-reminder">
                    Please mention this in your support answer below.
                  </span>
                )}
              </span>
            </div>
          )}
          {formLinks ? (
            <>
              <h3>A little about your day</h3>
              <p className="form-intro">Your next beautiful chapter starts here.</p>
              <iframe
                src={formLinks.embedUrl}
                title="LydsEvents consultation request form"
                className="google-form"
                loading="lazy"
                referrerPolicy="strict-origin-when-cross-origin"
              />
              <a
                className="text-link form-external"
                href={formLinks.publicUrl}
                target="_blank"
                rel="noreferrer"
              >
                Open the consultation form in a new tab <ArrowUpRight size={15} />
              </a>
              <p className="privacy-note">
                Your request is submitted securely through Google Forms.
              </p>
            </>
          ) : (
            <>
              <h3>A little about your day</h3>
              <p className="form-intro">
                Consultation requests are opening soon. For now, save your details so you’re ready
                for our first conversation.
              </p>
              <form onSubmit={saveNotes} onChange={() => setSaved(false)}>
                <div className="form-grid">
                  <label>
                    Your name <span>*</span>
                    <input
                      name="name"
                      autoComplete="name"
                      placeholder="First & last name"
                      required
                      maxLength={160}
                    />
                  </label>
                  <label>
                    Email address <span>*</span>
                    <input
                      name="email"
                      type="email"
                      autoComplete="email"
                      placeholder="you@example.com"
                      required
                      maxLength={254}
                    />
                  </label>
                  <label>
                    Phone number <span>*</span>
                    <input
                      name="phone"
                      type="tel"
                      autoComplete="tel"
                      placeholder="Your phone number"
                      required
                      maxLength={50}
                    />
                  </label>
                  <label>
                    Wedding or event date <span>*</span>
                    <input name="date" type="date" required />
                  </label>
                </div>
                <label>
                  What have you done so far? <span>*</span>
                  <textarea
                    name="progress"
                    placeholder="A venue you love? Vendors booked? Tell me where you’re at."
                    required
                    rows={3}
                    maxLength={5000}
                  />
                </label>
                <label>
                  What support are you hoping for? <span>*</span>
                  <textarea
                    name="support"
                    placeholder="What would you love to take off your plate?"
                    required
                    rows={3}
                    maxLength={5000}
                  />
                </label>
                <label>
                  What’s your budget? <span>*</span>
                  <input
                    name="budget"
                    placeholder="An estimate is perfect — include your currency"
                    required
                    maxLength={200}
                  />
                </label>
                <button type="submit" className="button form-submit">
                  Save my consultation notes <Download size={17} />
                </button>
                <p className="privacy-note">
                  Your notes download to your device. They are not sent to LydsEvents.
                </p>
                {saved && (
                  <p className="form-success" role="status">
                    <Check size={17} />
                    Your notes are ready to download. Keep them for our first conversation; no
                    request has been sent.
                  </p>
                )}
              </form>
            </>
          )}
        </div>
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer className="site-footer section-wrap">
      <div className="footer-main">
        <a className="wordmark" href="#home" aria-label="LydsEvents home">
          <span>Lyds</span>
          <span className="wordmark-events">EVENTS</span>
          <span className="logo-flower">✳︎</span>
        </a>
        <p>
          Thoughtfully planned.
          <br />
          <em>Wholeheartedly celebrated.</em>
        </p>
        <a className="text-link" href="#home">
          Back to the beginning <ArrowUpRight size={16} />
        </a>
      </div>
      <div className="footer-bottom">
        <span>© {new Date().getFullYear()} LydsEvents</span>
        <span>Weddings, events & all the little things.</span>
        <span>
          Made with a whole lot of heart <Heart size={12} />
        </span>
      </div>
    </footer>
  );
}

export default function App() {
  const [selectedTier, setSelectedTier] = useState<string | null>(null);
  useEffect(() => {
    const initialHash = window.location.hash;
    let active = true;
    if (initialHash) {
      void document.fonts.ready.then(() => {
        if (active && window.location.hash === initialHash) {
          document.getElementById(initialHash.slice(1))?.scrollIntoView({ behavior: 'instant' });
        }
      });
    }
    return () => {
      active = false;
    };
  }, []);
  useEffect(() => {
    const elements = document.querySelectorAll('.reveal');
    if (
      !('IntersectionObserver' in window) ||
      window.matchMedia('(prefers-reduced-motion: reduce)').matches
    )
      return;
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.remove('awaiting-reveal');
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.08 },
    );
    elements.forEach((element) => {
      element.classList.add('awaiting-reveal');
      observer.observe(element);
    });
    return () => {
      observer.disconnect();
      elements.forEach((element) => element.classList.remove('awaiting-reveal'));
    };
  }, []);
  return (
    <>
      <a className="skip-link" href="#main">
        Skip to content
      </a>
      <Header />
      <main id="main">
        <Hero />
        <Approach />
        <Portfolio />
        <Services onSelect={setSelectedTier} />
        <Process />
        <FAQ />
        <Consultation selectedTier={selectedTier} />
      </main>
      <Footer />
    </>
  );
}
