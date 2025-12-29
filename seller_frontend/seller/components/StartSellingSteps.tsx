import React from "react";

type Step = {
  title: string;
};

const steps: Step[] = [
  { title: "Submit your application" },
  { title: "Add your products and personalize your store" },
  { title: "Sell your products and get paid" },
];

export default function StartSellingSteps() {
  return (
    <section className="w-full rounded-lg bg-white p-6 md:p-8">
      <h2 className="text-2xl md:text-3xl font-extrabold text-slate-900">
        Start selling easily in{" "}
        <span className="text-orange-500">3 steps</span>!
      </h2>

      <div className="mt-5 grid grid-cols-1 gap-4 md:grid-cols-3">
        {steps.map((s, idx) => (
          <div
            key={s.title}
            className="flex items-center gap-5 rounded-lg bg-slate-100/70 px-5 py-6"
          >
            <div className="text-4xl md:text-5xl font-extrabold text-slate-900">
              {idx + 1}.
            </div>
            <div className="text-sm md:text-base font-semibold text-slate-900">
              {s.title}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
