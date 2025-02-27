import React from "react";

function Button({text,url="#"}) {
  return (
    <>
      <a
        href={url}
        className="inline-flex items-center px-4 py-3 text-md font-medium text-center text-white bg-black rounded-lg focus:ring-4 focus:outline-none focus:ring-blue-300 "
      >
        {text}
        <svg
          className="rtl:rotate-180 w-3.5 h-3.5 ms-2"
          aria-hidden="true"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 14 10"
        >
          <path
            stroke="currentColor"
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M1 5h12m0 0L9 1m4 4L9 9"
          />
        </svg>
      </a>
    </>
  );
}

export default Button;
