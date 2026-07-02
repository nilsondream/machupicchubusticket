"use client";

import { PayPalScriptProvider } from "@paypal/react-paypal-js";

export function PayPalProvider({
  children,
  clientId,
}: {
  children: React.ReactNode;
  clientId: string;
}) {
  return (
    <PayPalScriptProvider
      options={{
        clientId,
        currency: "USD",
        intent: "capture",
      }}
    >
      {children}
    </PayPalScriptProvider>
  );
}
