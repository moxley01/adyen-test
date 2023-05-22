import Session from "./session";

export default async function Home() {
  return (
    /* @ts-expect-error */
    <Session amount={1500} />
  );
}
