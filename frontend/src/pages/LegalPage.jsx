import { Link } from 'react-router-dom';

export const LegalPage = () => <section className="page shell legal-page">
  <p className="kicker">Legal notice · Aviso legal</p>
  <h1>Un proyecto ficticio con una historia <em>muy real.</em></h1>
  <div className="legal-page__grid">
    <article><h2>Español</h2><p>KelseTS es una marca ficticia creada por Araceli Fradejas Muñoz con fines exclusivamente educativos, académicos y de portfolio.</p><p>El proyecto está inspirado creativamente en la cultura pop, la música y el deporte, pero no está afiliado, patrocinado, autorizado ni respaldado por Taylor Swift, Travis Kelce, los Kansas City Chiefs, la National Football League, sus representantes ni ninguna entidad relacionada.</p><p>Todos los nombres, marcas, logotipos e imágenes de terceros pertenecen a sus respectivos titulares. Los eventos, productos, speakers, testimonios y servicios presentados son ficticios.</p></article>
    <article lang="en"><h2>English</h2><p>KelseTS is a fictional brand created by Araceli Fradejas Muñoz solely for educational, academic and portfolio purposes.</p><p>The project is creatively inspired by pop culture, music and sport, but is not affiliated with, sponsored, authorised or endorsed by Taylor Swift, Travis Kelce, the Kansas City Chiefs, the National Football League, their representatives or any related organisation.</p><p>Third-party names, trademarks, logos and images belong to their respective owners. All events, products, speakers, testimonials and services shown are fictional.</p></article>
  </div>
  <Link className="button button--dark" to="/">Volver a KelseTS Talks</Link>
</section>;
