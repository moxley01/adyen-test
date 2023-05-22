"use server";
import { CheckoutAPI, Client, Config } from "@adyen/api-library";
import { PaymentMethodsRequest } from "@adyen/api-library/lib/src/typings/checkout/paymentMethodsRequest";
import { CardDetails } from "@adyen/api-library/lib/src/typings/checkout/cardDetails";
import { v4 as randomUUID } from "uuid";
import { PaymentRequest } from "@adyen/api-library/lib/src/typings/checkout/paymentRequest";
import { IdealDetails } from "@adyen/api-library/lib/src/typings/checkout/idealDetails";
import { Amount } from "@adyen/api-library/lib/src/typings/amount";

const config = new Config({
  apiKey: process.env.ADYEN_API_KEY,
  environment: process.env.NEXT_PUBLIC_ADYEN_ENVIRONMENT as Environment,
});

const currency = process.env.ADYEN_CURRENCY as Amount["currency"];

const client = new Client({ config });
const checkout = new CheckoutAPI(client);

const merchantAccount = process.env.ADYEN_MERCHANT_ACCOUNT ?? "";

export const makePayment = (
  paymentMethod: CardDetails | IdealDetails,
  value: number
) => {
  return checkout.payments({
    merchantAccount,
    paymentMethod,
    channel: PaymentRequest.ChannelEnum.Web,
    amount: { currency, value },
    reference: "XYZ",
    returnUrl: "https://localhost.com",
  });
};

export const getSession = async (value: number) =>
  await checkout.sessions({
    amount: { currency, value },
    merchantAccount,
    reference: randomUUID(),
    returnUrl: `http://localhost.com`,
  });

export const getPaymentMethods = async (value: number) =>
  await checkout.paymentMethods({
    amount: { currency, value },
    merchantAccount,
    channel: PaymentMethodsRequest.ChannelEnum.Web,
  });
