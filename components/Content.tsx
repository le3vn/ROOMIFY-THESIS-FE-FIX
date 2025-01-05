import React from "react";

export default function Content({ children }) {
  return (
    <section className="container max-w-full mx-auto md:px-14 md:py-8">
      {children}
    </section>
  );
}
