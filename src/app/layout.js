import "./globals.css"; // Ensure this contains @import "@heroui/styles";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Toaster } from 'react-hot-toast';

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <Navbar />
        <main>{children}
                  <Toaster position="top-right" />

        </main>
        <Footer />
      </body>
    </html>
  );
}