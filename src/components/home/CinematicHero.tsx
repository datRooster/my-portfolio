import { useEffect, useRef, type ReactNode } from 'react';
import { ArrowDown, ArrowUpRight } from 'lucide-react';
import Link from '@/components/runtime/Link';
import { assetUrl } from '@/lib/http';

const FRAME_COUNT = 8;
// Align the subject across the original atlas cells, keeping the source untouched.
const FRAME_OFFSET_X = [0, 0, -2.5, -2, -2, -11, -10, -1];
const clamp = (value: number) => Math.max(0, Math.min(1, value));

const scenes = {
  home: { eyebrow: 'Web developer & creative mind', lines: ['Dietro', 'il codice,', 'ci sono io.'], description: <>Sono Amedeo, <strong>theWebRooster.</strong><br />Sviluppo siti, temi WordPress e strumenti<br className="noir-desktop-break" /> che danno forma alle tue idee.</>, target: 'selected-work', action: 'Esplora i progetti', secondary: { href: '/about', label: 'Chi sono' }, footer: 'WordPress / WooCommerce / Web apps', cue: 'Scorri. Mi presento.' },
  projects: { eyebrow: '01 / Portfolio selezionato', lines: ['Dalle idee', 'ai progetti.'], description: 'Temi WordPress, plugin WooCommerce e applicazioni web. Dentro ogni lavoro: obiettivi, funzionalità e scelte di sviluppo.', target: 'projects-content', action: 'Esplora i lavori', secondary: { href: '/contact', label: 'Parliamone' }, footer: 'Progettare / Sviluppare / Pubblicare', cue: 'Scorri. Apri il portfolio.' },
  services: { eyebrow: '02 / Sviluppo & consulenza', lines: ['Ogni pezzo,', 'al suo posto.'], description: 'Siti, e-commerce, plugin e applicazioni. Costruisco le funzionalità che servono al tuo progetto, curando anche quello che non si vede.', target: 'services-content', action: 'Scopri i servizi', secondary: { href: '/contact', label: 'Raccontami la tua idea' }, footer: 'Interfaccia / Logica / Contenuti', cue: 'Scorri. Guarda come funziona.' },
  about: { eyebrow: '03 / Amedeo Galletta', lines: ['Una storia.', 'Ancora da', 'scrivere.'], description: 'Sono theWebRooster. Sviluppo per il web, creo strumenti per WordPress e condivido il mio codice. Qui trovi il percorso dietro ai progetti.', target: 'about-content', action: 'Il mio percorso', secondary: { href: '/projects', label: 'Guarda i progetti' }, footer: 'Curiosità / Metodo / Codice aperto', cue: 'Scorri. Conosciamoci.' },
  contact: { eyebrow: '04 / Iniziamo una conversazione', lines: ['La tua idea.', 'Il prossimo', 'passo.'], description: 'Un sito da costruire, un negozio da migliorare o una funzionalità da sviluppare. Raccontami da dove vuoi partire.', target: 'contact-content', action: 'Scrivimi', secondary: { href: 'mailto:contact@webrooster.it', label: 'Preferisci una email?' }, footer: 'Obiettivi / Funzionalità / Tempi', cue: 'Scorri. Restiamo in contatto.' },
  security: { eyebrow: '05 / Cybersecurity', lines: ['Guardare', 'oltre la', 'superficie.'], description: 'Ricerca, analisi delle vulnerabilità e responsible disclosure. Uno spazio dedicato al mio percorso nella sicurezza informatica.', target: 'security-content', action: 'Esplora la sezione', secondary: { href: '/bug-bounty/methodology', label: 'Metodologia' }, footer: 'Ricerca / Analisi / Responsible disclosure', cue: 'Scorri. Esplora i dettagli.' },
};
export type SceneKey = keyof typeof scenes;
interface CinematicHeroProps {
  sceneKey?: SceneKey;
  title?: ReactNode;
  description?: ReactNode;
  eyebrow?: string;
  targetId?: string;
  compact?: boolean;
  secondary?: { href: string; label: string };
}

/** A single local atlas, scrubbed with native scrolling. */
export default function CinematicHero({ sceneKey = 'home', title, description, eyebrow, targetId, compact = false, secondary }: CinematicHeroProps) {
  const scene = useRef<HTMLElement>(null);
  const config = scenes[sceneKey];
  const destination = targetId || config.target;
  const secondaryAction = secondary || config.secondary;
  const imagePath = sceneKey === 'home' ? '/images/hero/noir-sequence-v1.png' : `/images/hero/noir-${sceneKey}-v1.png`;

  useEffect(() => {
    const element = scene.current;
    if (!element) return;
    const stage = element.querySelector<HTMLElement>('.noir-stage')!;
    const frames = [...element.querySelectorAll<HTMLElement>('.noir-frame')];
    const motion = window.matchMedia('(prefers-reduced-motion: reduce)');
    let raf = 0;
    let previousTime = 0;
    let current = 0;
    let target = 0;
    let top = 0;
    let distance = 1;

    const paint = (progress: number) => {
      const position = progress * (FRAME_COUNT - 1);
      const index = Math.floor(position);
      const fraction = position - index;
      // Keep the lower frame opaque: fading both layers darkens the image.
      frames.forEach((frame, i) => {
        frame.style.opacity = String(i === index ? 1 : i === index + 1 ? fraction : 0);
      });
      element.style.setProperty('--scene-progress', String(progress));
      element.style.setProperty('--reveal', String(clamp((progress - 0.18) / 0.48)));
    };
    const tick = (time: number) => {
      const elapsed = previousTime ? Math.min(time - previousTime, 64) : 16;
      previousTime = time;
      current += (target - current) * (1 - Math.exp(-elapsed / 85));
      if (Math.abs(target - current) < 0.0005) current = target;
      paint(current);
      raf = current !== target ? requestAnimationFrame(tick) : 0;
      if (!raf) previousTime = 0;
    };
    const update = () => {
      target = motion.matches ? 1 : clamp((window.scrollY - top) / distance);
      if (document.hidden) return;
      if (!raf) raf = requestAnimationFrame(tick);
    };
    const measure = () => {
      top = element.getBoundingClientRect().top + window.scrollY;
      distance = Math.max(1, element.offsetHeight - stage.offsetHeight);
      cancelAnimationFrame(raf);
      raf = 0;
      previousTime = 0;
      current = motion.matches ? 1 : clamp((window.scrollY - top) / distance);
      paint(current);
      update();
    };
    const visibility = () => {
      if (document.hidden) { cancelAnimationFrame(raf); raf = 0; previousTime = 0; }
      else update();
    };
    const resize = new ResizeObserver(measure);
    resize.observe(element);
    resize.observe(stage);
    window.addEventListener('scroll', update, { passive: true });
    motion.addEventListener('change', measure);
    document.addEventListener('visibilitychange', visibility);
    measure();
    return () => {
      cancelAnimationFrame(raf);
      resize.disconnect();
      window.removeEventListener('scroll', update);
      motion.removeEventListener('change', measure);
      document.removeEventListener('visibilitychange', visibility);
    };
  }, [sceneKey]);

  const skipIntro = () => {
    const projects = document.getElementById(destination);
    projects?.scrollIntoView({ behavior: 'instant', block: 'start' });
    projects?.focus({ preventScroll: true });
  };

  return (
    <section className={`noir-home noir-scene ${sceneKey !== 'home' ? 'noir-scene--object' : ''} ${compact ? 'noir-scene--compact' : ''}`} data-scene={sceneKey} ref={scene} aria-labelledby="noir-title">
      <div className="noir-stage">
        <div className="noir-portrait" aria-hidden="true">
          {Array.from({ length: FRAME_COUNT }, (_, i) => (
            <div key={i} className="noir-frame" style={{
              backgroundImage: `url("${assetUrl(imagePath)}")`,
              backgroundPosition: `${(i % 4) * 100 / 3}% ${Math.floor(i / 4) * 100}%`,
              transform: `translateX(${sceneKey === 'home' ? FRAME_OFFSET_X[i] : 0}%)`,
              opacity: i === 0 ? 1 : 0,
            }} />
          ))}
        </div>
        <div className="noir-shade" aria-hidden="true" />
        <div className="noir-hero-content noir-container">
          <p className="noir-eyebrow"><span className="noir-status" /> {eyebrow || config.eyebrow}</p>
          <h1 id="noir-title">{title || config.lines.map((line, i) => i === config.lines.length - 1 ? <span key={line}>{line}</span> : <span className="noir-title-line" key={line}>{line}<br /></span>)}</h1>
          <div className="noir-introduction">
            <p>{description || config.description}</p>
            <div className="noir-actions">
              <button className="noir-button" onClick={skipIntro}>{compact ? 'Esplora i dettagli' : config.action} <ArrowDown size={17} /></button>
              <Link href={secondaryAction.href} className="noir-text-link">{secondaryAction.label} <ArrowUpRight size={17} /></Link>
            </div>
          </div>
        </div>
        <div className="noir-scene-index" aria-hidden="true"><span>01</span><i /><span>08</span></div>
        <div className="noir-hero-bottom noir-container">
          <span className="noir-scroll-cue"><ArrowDown size={14} /> {config.cue}</span>
          <span className="noir-disciplines">{config.footer}</span>
          <span className="noir-location">Based in Italy · Working everywhere</span>
        </div>
        <div className="noir-progress" aria-hidden="true" />
      </div>
    </section>
  );
}
