import { Inter } from "next/font/google";
import Providers from "./Providers";
import "./globals.css";
import { Toaster } from "sonner";

const inter = Inter({ subsets: ["latin"] });

export default function RootLayout({ children }: { children: React.ReactNode }) {
    return (
        <html lang="en">
            <body className={inter.className}>
                <Providers>
                    {children} <Toaster position="bottom-right" richColors closeButton />
                </Providers>
            </body>
        </html>
    );
}
