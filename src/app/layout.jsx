// app/layout.tsx
import Header from "@/components/Header"; // Note: You had import Header from "@/components/Header"; but code shows "@/components/shared/header"
import "./globals.css";
import Sidebar from "@/components/Sidebar";
import { Toaster } from "sonner";
import { SMSFilesProvider } from "@/context/SMSFileContext";
import { store } from "@/store/store";
import ReduxProvider from "@/components/ReduxProvider";

export const metadata = {
  title: "SMS Dashboard",
  description: "Dashboard System",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <ReduxProvider store={store}>
          <SMSFilesProvider> 
            <Toaster position="top-right" richColors closeButton />
            <main>{children}</main>
          </SMSFilesProvider>
        </ReduxProvider>
      </body>
    </html>
  );
}