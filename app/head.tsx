export default function Head() {
  return (
    <>
      {/* Favicon clásico */}
      <link rel="icon" href="/vibetech_icon.ico?v=2" sizes="any" />
      <link rel="shortcut icon" href="/vibetech_icon.ico?v=2" />

      {/* PNGs por tamaño */}
      <link rel="icon" type="image/png" sizes="16x16" href="/vibetech_icon_16.png?v=2" />
      <link rel="icon" type="image/png" sizes="32x32" href="/vibetech_icon_32.png?v=2" />
      <link rel="icon" type="image/png" sizes="48x48" href="/vibetech_icon_48.png?v=2" />
      <link rel="icon" type="image/png" sizes="192x192" href="/vibetech_icon_192.png?v=2" />
      <link rel="icon" type="image/png" sizes="512x512" href="/vibetech_icon_512.png?v=2" />

      {/* iOS (al fijar a pantalla de inicio) */}
      <link rel="apple-touch-icon" href="/vibetech_icon_180.png?v=2" />
    </>
  );
}
