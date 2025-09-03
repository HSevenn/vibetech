
import site from '@/data/site.json';

export const metadata = { title: 'Contacto • VibeTech' };

export default function ContactoPage(){
  return (
    <div className="max-w-2xl">
      <h1 className="mb-4 text-2xl font-semibold">Contacto</h1>
      <p className="text-muted-foreground">¿Tienes preguntas? Escríbenos.</p>
      <div className="mt-6 flex gap-3">
        <a className="btn btn-primary" href={`https://wa.me/57${site.whatsapp}`} target="_blank">WhatsApp</a>
        <a className="btn btn-outline" href={`https://instagram.com/${site.instagram}`} target="_blank">Instagram</a>
      </div>
    </div>
  );
}
