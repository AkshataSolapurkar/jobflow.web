import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils"
import StoreProvider from "./StoreProvider";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { Toaster } from "react-hot-toast";
import { getUser } from "@/actions/user_actions";

 
const fontSans = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
})


export const metadata: Metadata = {
  title: "Find Your Job",
  description: "Single Platform to get job from all platform",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const user = await getUser()
  return (
    <html lang="en">
       <StoreProvider
          user={user?.user}
        >
          <GoogleOAuthProvider
            clientId={process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID!}
          >
      <body className={cn(
          "min-h-screen bg-background font-sans antialiased",
          fontSans.variable
        )}>
          <Toaster />
          {children}
          </body>
        </GoogleOAuthProvider>
       </StoreProvider> 
    </html>
  );
}
