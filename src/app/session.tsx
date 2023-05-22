import Checkout from "./checkout";
import { getPaymentMethods, getSession } from "./serverActions";

export default async function Session(props: { amount: number }) {
  const session = await getSession(props.amount);
  if (!session) {
    throw new Error("Could not create session");
  }
  const paymentMethods = await getPaymentMethods(props.amount);
  const cardPaymentMethod = paymentMethods.paymentMethods?.find(
    (pm) => pm.type === "scheme"
  );
  if (!cardPaymentMethod) {
    throw new Error("No card payment method available");
  }
  return (
    <section className="flex h-full w-full items-center justify-center">
      <Checkout session={session} method={cardPaymentMethod} />
    </section>
  );
}
