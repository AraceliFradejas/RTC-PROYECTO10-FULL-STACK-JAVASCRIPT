import { useLanguage } from "../context/LanguageContext.jsx";
import { Heart, Lightbulb, MoveRight } from 'lucide-react';
import { Ecosystem } from '../components/Ecosystem.jsx';
export const AboutPage = () => {
  const {
    t
  } = useLanguage();
  return <section className="page shell about">
  <p className="kicker">{t("This is KelseTS")}</p>
  <h1>{t("Las grandes remontadas empiezan con un paso")} <em>{t("pequeño.")}</em></h1>
  <p className="about__lead">{t("KelseTS crea experiencias de aprendizaje para profesionales y empresas. Traducimos las lecciones del deporte —disciplina, resiliencia, estrategia y equipo— en ideas que se pueden aplicar al día siguiente.")}</p>
  <p className="about__project">{t("Proyecto académico de Araceli Fradejas Muñoz. KelseTS, sus ponentes y sus eventos son ficticios; las biografías y transcripciones forman parte de una recreación educativa.")}</p>
  <div className="about__story"><img src="/images/brand/brand-origin-clean.jpg" alt={t("Objetos deportivos y creativos que representan el origen de KelseTS")} /><div><p className="kicker">The Next Inch</p><h2>{t("Del vestuario a la empresa")}</h2><p>{t("The Next Inch nace del espíritu del discurso de Al Pacino como el entrenador Tony D’Amato en Un domingo cualquiera (Any Given Sunday, 1999): el valor de cada pequeño avance y el compromiso con quien tienes al lado. Llevamos esa idea del vestuario a la empresa con historias de resiliencia, confianza y esfuerzo compartido. Cada charla invita a convertir esa inspiración en una acción concreta para tu equipo.")}</p></div></div>
  <div className="about__grid"><article><MoveRight /><h2>{t("Acción")}</h2><p>{t("Cada experiencia termina con un próximo paso concreto.")}</p></article><article><Lightbulb /><h2>{t("Perspectiva")}</h2><p>{t("Historias del deporte para mirar retos profesionales de otra manera.")}</p></article><article><Heart /><h2>{t("Equipo")}</h2><p>{t("El rendimiento sostenible siempre se construye con otras personas.")}</p></article></div>
  <Ecosystem compact />
</section>;
};
