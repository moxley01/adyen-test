import React from "react";
import Image from "next/image";

export default function Brands(props: { brands: string[] }) {
  return (
    <React.Fragment>
      {props.brands?.map((brand) => {
        return (
          <Image
            key={brand}
            src={`https://checkoutshopper-live.adyen.com/checkoutshopper/images/logos/${brand}.svg`}
            width={30}
            height={30}
            alt={`${brand} logo`}
            className="rounded-sm object-cover"
          />
        );
      })}
    </React.Fragment>
  );
}
