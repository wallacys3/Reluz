'use client';

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html>
      <body className="bg-black text-white flex flex-col items-center justify-center min-h-screen">
        <h2 className="text-2xl font-bold mb-4">Algo deu errado globalmente</h2>
        <button
          onClick={() => reset()}
          className="px-6 py-3 bg-[#D4AF62] text-black font-bold uppercase tracking-widest text-xs"
        >
          Tentar novamente
        </button>
      </body>
    </html>
  );
}
