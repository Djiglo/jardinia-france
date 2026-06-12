import { Metadata } from "next";

export const metadata: Metadata = { title: "Mentions légales | Jardinia France" };

export default function MentionsLegalesPage() {
  return (
    <div className="container mx-auto px-4 py-12 max-w-3xl">
      <h1 className="text-3xl font-bold text-anthracite-900 mb-8">Mentions légales</h1>
      <div className="space-y-6 text-gray-600 text-sm leading-relaxed">
        <section>
          <h2 className="text-base font-semibold text-anthracite-800 mb-2">Éditeur du site</h2>
          <p>Jardinia France — Auto-entrepreneur<br />
          Siège social : Île-de-France, France<br />
          E-mail : contact@jardinia-france.fr<br />
          Directeur de publication : B. Hedhiri</p>
        </section>
        <section>
          <h2 className="text-base font-semibold text-anthracite-800 mb-2">Hébergement</h2>
          <p>Le site est hébergé par Vercel Inc., 340 Pine Street, Suite 700, San Francisco, CA 94104, États-Unis.<br />
          Site : <a href="https://vercel.com" target="_blank" rel="noopener noreferrer" className="text-primary-600 hover:underline">vercel.com</a></p>
        </section>
        <section>
          <h2 className="text-base font-semibold text-anthracite-800 mb-2">Propriété intellectuelle</h2>
          <p>L'ensemble des contenus de ce site (textes, images, vidéos, logos) est la propriété exclusive de Jardinia France ou de ses partenaires. Toute reproduction, même partielle, est strictement interdite sans autorisation préalable.</p>
        </section>
        <section>
          <h2 className="text-base font-semibold text-anthracite-800 mb-2">Données personnelles</h2>
          <p>Conformément au RGPD et à la loi Informatique et Libertés, vous disposez d'un droit d'accès, de rectification et de suppression de vos données. Pour exercer ces droits, contactez : contact@jardinia-france.fr</p>
        </section>
        <section>
          <h2 className="text-base font-semibold text-anthracite-800 mb-2">Cookies</h2>
          <p>Ce site utilise des cookies à des fins fonctionnelles et analytiques. Pour en savoir plus, consultez notre <a href="/cookies" className="text-primary-600 hover:underline">politique de cookies</a>.</p>
        </section>
      </div>
    </div>
  );
}
