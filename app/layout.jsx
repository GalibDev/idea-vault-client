import "../styles/globals.css";
import Navbar from "../components/Navbar.jsx";
import Footer from "../components/Footer.jsx";
import RouteTitle from "../components/RouteTitle.jsx";
import { ToastProvider } from "../components/Toast.jsx";
import { AuthProvider } from "../context/AuthContext.jsx";
import { ThemeProvider } from "../context/ThemeContext.jsx";

export const metadata = {
  title: "IdeaVault",
  description: "Startup idea sharing platform",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <ThemeProvider>
          <AuthProvider>
            <ToastProvider>
              <RouteTitle />
              <Navbar />
              <main>{children}</main>
              <Footer />
            </ToastProvider>
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
