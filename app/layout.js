

import "./globals.css";

//const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Spinx AI",
  description: "The next generation of career guidance",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      
        <body>{children}</body>

     
    </html>
  );
}
