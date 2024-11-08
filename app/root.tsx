import { useEffect, useState } from "react";
import {
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
} from "@remix-run/react";
import { StytchProvider } from "@stytch/react";
import { StytchUIClient } from "@stytch/vanilla-js";
import type { LinksFunction } from "@remix-run/node";
import { StytchHeadlessClient } from "@stytch/vanilla-js/dist/StytchHeadlessClient";

import "./tailwind.css";

export const links: LinksFunction = () => [
  { rel: "preconnect", href: "https://fonts.googleapis.com" },
  {
    rel: "preconnect",
    href: "https://fonts.gstatic.com",
    crossOrigin: "anonymous",
  },
  {
    rel: "stylesheet",
    href: "https://fonts.googleapis.com/css2?family=Inter:ital,opsz,wght@0,14..32,100..900;1,14..32,100..900&display=swap",
  },
];

export function Layout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <Meta />
        <Links />
      </head>
      <body>
        {children}
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}

export default function App() {
  const [stytchClient, setStytchClient] = useState<StytchUIClient | null>(null);

  useEffect(() => {
    // Initialize Stytch UI Client on the client side
    const token = import.meta.env.VITE_STYTCH_PUBLIC_TOKEN; //have to add 'VITE_' for client-side env variables in Vite
    if (!token) {
      console.error("VITE_STYTCH_PUBLIC_TOKEN is missing.");
      return;
    }

    // Create a Stytch client instance
    const client = new StytchUIClient(token);
    setStytchClient(client);
  }, []);

  // Return a loading screen until the Stytch client is initialized
  if (!stytchClient) {
    return <div>Loading...</div>;
  }

  return (
    <StytchProvider stytch={stytchClient}>
      <Outlet /> {/* Render the routes */}
    </StytchProvider>
  );
}
