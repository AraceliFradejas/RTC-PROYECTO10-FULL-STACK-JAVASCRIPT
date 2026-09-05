import { useState } from 'react';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import { heroSlides } from '../data/visualContent.js';

export const HeroCarousel = () => {
  const [current, setCurrent] = useState(0);

  const show = (index) => setCurrent((index + heroSlides.length) % heroSlides.length);
  const slide = heroSlides[current];

  return <div className="hero-carousel" aria-roledescription="carrusel" aria-label="Historias KelseTS">
    <img key={slide.src} className="hero-carousel__image" src={slide.src} alt={slide.alt} />
    <div className="hero-carousel__shade" />
    <div className="hero-carousel__caption" aria-live="polite">
      <small>{slide.eyebrow}</small>
      <strong>{slide.title}</strong>
    </div>
    <div className="hero-carousel__controls">
      <button type="button" onClick={() => show(current - 1)} aria-label="Imagen anterior"><ArrowLeft /></button>
      <span>{String(current + 1).padStart(2, '0')} / {String(heroSlides.length).padStart(2, '0')}</span>
      <button type="button" onClick={() => show(current + 1)} aria-label="Imagen siguiente"><ArrowRight /></button>
    </div>
    <div className="hero-carousel__dots" aria-label="Seleccionar imagen">
      {heroSlides.map((item, index) => <button key={item.src} type="button" className={index === current ? 'active' : ''} onClick={() => show(index)} aria-label={`Mostrar imagen ${index + 1}`} aria-current={index === current ? 'true' : undefined} />)}
    </div>
  </div>;
};
