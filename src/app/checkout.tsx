"use client";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import AdyenCheckout from "@adyen/adyen-web";
import getSymbolFromCurrency from "currency-symbol-map";
import cn from "classnames";

import { FormState } from "@adyen/adyen-web/dist/types/utils/useForm/types";
import { PaymentData } from "@adyen/adyen-web/dist/types/components/types";
import { CreateCheckoutSessionResponse } from "@adyen/api-library/lib/src/typings/checkout/createCheckoutSessionResponse";
import { PaymentMethod } from "@adyen/api-library/lib/src/typings/checkout/paymentMethod";

import Loading from "./loading";
import clientConfig from "./clientConfig";
import { makePayment } from "./serverActions";
import Brands from "./brands";

const Checkout = ({
  session,
  method,
}: {
  session: CreateCheckoutSessionResponse;
  method: PaymentMethod;
}) => {
  const router = useRouter();
  const paymentContainer = useRef(null);
  const [loading, setLoading] = useState(true);
  const [inputState, setInputState] = useState<FormState<PaymentData> | null>(
    null
  );

  useEffect(() => {
    let ignore = false;

    if (!session || !paymentContainer.current) {
      return;
    }

    const createCheckout = async () => {
      const checkout = await AdyenCheckout({
        ...clientConfig,
        session,
      });

      if (paymentContainer.current && !ignore) {
        checkout
          .create("securedfields", {
            type: "card",
            brands: method.brands,
            styles: {
              error: {
                color: "red",
              },
              validated: {
                color: "green",
              },
            },
            onChange: setInputState,
            onConfigSuccess: function () {
              setLoading(false);
            },
          })
          .mount(paymentContainer.current);
      }
    };

    createCheckout();

    return () => {
      ignore = true;
    };
  }, [session, method.brands]);

  const handlePaymentSubmit = useCallback(async () => {
    if (inputState?.isValid) {
      setLoading(true);
      let response = await makePayment(
        inputState.data.paymentMethod,
        session.amount.value
      );
      if (response.action?.url) {
        window.location.href = response.action.url;
      } else if (response.resultCode === "Authorised") {
        router.push("/success");
      } else {
        router.push("/error");
      }
    } else {
      alert("Invalid input state");
    }
  }, [
    inputState?.isValid,
    inputState?.data.paymentMethod,
    session.amount.value,
    router,
  ]);

  return (
    <div
      className={cn(
        loading && "loading",
        "relative w-1/2 max-w-xl overflow-hidden flex flex-col bg-gray-800 px-8 py-4 rounded-md shadow-lg"
      )}
    >
      {loading ? (
        <Loading />
      ) : (
        <div className="absolute top-0 right-0 flex gap-1 p-2">
          <Brands brands={method.brands || []} />
        </div>
      )}
      <div
        id="customCard-container"
        ref={paymentContainer}
        className="flex gap-2 flex-col"
      >
        <section>
          <label>
            <span>Card number:</span>
            <span data-cse="encryptedCardNumber"></span>
          </label>
        </section>
        <section>
          <label>
            <span>Expiry date:</span>
            <span data-cse="encryptedExpiryDate"></span>
          </label>
          <label>
            <span>CVV/CVC:</span>
            <span data-cse="encryptedSecurityCode"></span>
          </label>
        </section>
        <button
          onClick={handlePaymentSubmit}
          type="button"
          className="text-white bg-[#1da1f2] hover:bg-[#1da1f2]/90 focus:ring-4 focus:outline-none focus:ring-[#1da1f2]/50 font-medium rounded-lg text-sm px-5 py-2.5 text-center inline-flex items-center dark:focus:ring-[#1da1f2]/55 mt-2 w-full"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            height="24"
            width="16"
            fill="white"
            className="mr-2"
          >
            <g id="lock">
              <path d="M17,10.25h-.25V8a4.75,4.75,0,0,0-9.5,0v2.25H7A2.75,2.75,0,0,0,4.25,13v5A2.75,2.75,0,0,0,7,20.75H17A2.75,2.75,0,0,0,19.75,18V13A2.75,2.75,0,0,0,17,10.25ZM8.75,8a3.25,3.25,0,0,1,6.5,0v2.25H8.75Zm9.5,10A1.25,1.25,0,0,1,17,19.25H7A1.25,1.25,0,0,1,5.75,18V13A1.25,1.25,0,0,1,7,11.75H17A1.25,1.25,0,0,1,18.25,13Z" />
            </g>
          </svg>
          {`Pay ${getSymbolFromCurrency(session.amount.currency)}${
            session.amount.value
          }`}
        </button>
      </div>
    </div>
  );
};

export default Checkout;
