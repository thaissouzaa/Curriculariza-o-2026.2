import "./globals.css";

export const metadata = {
  title: "Trilha Mágica — aprender brincando",
  description: "Um jogo educativo infantil, acessível e interativo em português.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="pt-BR">
      <body>{children}</body>
    </html>
  );
}
