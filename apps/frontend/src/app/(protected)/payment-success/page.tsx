import type { Metadata } from "next";

import { PaymentSuccess } from "@/components/misc/payment-success";
import { siteConfig } from "@/config/site";

export const metadata: Metadata = {
  title: siteConfig.pages.paymentSuccess.title,
  description: siteConfig.pages.paymentSuccess.description,
};

export default function PaymentSuccessPage() {
  return <PaymentSuccess />;
}
