import { useLanguage } from "../context/LanguageContext.jsx";
import { useState } from 'react';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import { heroSlides } from '../data/visualContent.js';
export const HeroCarousel = () => {
  const {
    t
  } = useLanguage();
  const [current, setCurrent] = useState(0);
  const show = index => setCurrent((index + heroSlides.length) % heroSlides.length);
  const slide = heroSlides[current];
  return <div className="hero-carousel" role="region" aria-roledescription={t("carrusel")} aria-label={t("Historias KelseTS")}>
    <img key={slide.src} fetchPriority="high" className="hero-carousel__image" src={slide.src} alt={t(slide.alt)} />
    <div className="hero-carousel__shade" />
    <div className="hero-carousel__caption" aria-live="polite">
      <small>{t(slide.eyebrow)}</small>
      <strong>{t(slide.title)}</strong>
    </div>
    <div className="hero-carousel__controls">
      <button type="button" onClick={() => show(current - 1)} aria-label={t("Imagen anterior")}><ArrowLeft /></button>
      <span>{String(current + 1).padStart(2, '0')} / {String(heroSlides.length).padStart(2, '0')}</span>
      <button type="button" onClick={() => show(current + 1)} aria-label={t("Imagen siguiente")}><ArrowRight /></button>
    </div>
    <div className="hero-carousel__dots" role="group" aria-label={t("Seleccionar imagen")}>
      {heroSlides.map((item, index) => <button key={item.src} type="button" className={index === current ? 'active' : ''} onClick={() => show(index)} aria-label={t("Mostrar imagen {number}", { number: index + 1 })} aria-current={index === current ? 'true' : undefined} />)}
    </div>
  </div>;
};
