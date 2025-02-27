import React from "react";
import Button from "./Button";

function Subcard({plans}) {
  return (
    <div className="max-w-sm  text-black   rounded-lg shadow bg-green">
      <a href="#">
        <img
          className="rounded-t-lg"
          src={plans.image}
          alt=""
        />
      </a>
      <div className="py-5 px-8 flex flex-col items-center">
        <h5 className="mb-2 text-2xl font-bold tracking-tight ">
          {plans.title}
        </h5>
        <h6 className= "mb-2 font-semibold">
            ${plans.price}/month
        </h6>

        <p className="mb-16 font-medium text-black text-center ">
          {plans.description}
        </p>
        <p className="mb-0 font-semibold text-black">
          Offset {plans.offset} kg of CO2
        </p>
        <p className="mb-8 font-normal text-black text-center">
          over the planting schedule of the project.
        </p>
        <Button text="Choose this plan" url="#"/>
      </div>
    </div>
  );
}

export default Subcard;
