import { Heart, Lightbulb, MoveRight } from 'lucide-react';

export const AboutPage = () => <section className="page shell about">
  <p className="kicker">This is KelseTS</p>
  <h1>Las grandes remontadas empiezan con un paso <em>pequeño.</em></h1>
  <p className="about__lead">KelseTS crea experiencias de aprendizaje para profesionales y empresas. Traducimos las lecciones del deporte —disciplina, resiliencia, estrategia y equipo— en ideas que se pueden aplicar al día siguiente.</p>
  <div className="about__story"><span>01</span><div><p className="kicker">The Next Inch</p><h2>Del vestuario a la empresa</h2><p>Nos inspira ese instante previo a volver al campo: el marcador pesa, el tiempo corre y un equipo decide avanzar unido. No prometemos fórmulas mágicas. Creamos conversaciones que mueven la siguiente decisión.</p></div></div>
  <div className="about__grid"><article><MoveRight /><h2>Acción</h2><p>Cada experiencia termina con un próximo paso concreto.</p></article><article><Lightbulb /><h2>Perspectiva</h2><p>Historias del deporte para mirar retos profesionales de otra manera.</p></article><article><Heart /><h2>Equipo</h2><p>El rendimiento sostenible siempre se construye con otras personas.</p></article></div>
</section>;
