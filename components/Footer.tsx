
import site from '@/data/site.json';

export default function Footer(){
  return (
    <footer className="mt-16 border-t border-neutral-200 dark:border-neutral-800">
      <div className="container-max flex flex-col gap-6 py-8 md:flex-row md:items-center md:justify-between px-4">
        <p className="text-sm text-neutral-500">© {new Date().getFullYear()} {site.brandName}. Todos los derechos reservados.</p>
        <div className="flex items-center gap-3">
          <a className="btn btn-outline" href={`https://instagram.com/${site.instagram}`} target="_blank">📸 Instagram</a>
          <a className="btn btn-primary" href={`https://wa.me/57${site.whatsapp}`} target="_blank">WhatsApp</a>
        </div>
      </div>
    </footer>
  );
}
