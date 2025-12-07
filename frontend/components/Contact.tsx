"use client";

import { FormEvent, useState } from "react";

const Contact = () => {
  const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">(
    "idle"
  );

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setStatus("submitting");

    // Burada API isteği veya e-posta servisini çağırabilirsin.
    // Şimdilik demo için direkt success gösterelim:
    setTimeout(() => {
      setStatus("success");
    }, 400);
  };

  return (
    <div className="min-h-screen bg-white flex justify-center">
      <div className="w-full max-w-5xl px-6 md:px-10 pt-20">
        {/* Başlık */}
        <h1 className="text-3xl md:text-4xl font-semibold text-[#111827]">
          Contact Us
        </h1>
        <p className="mt-4 text-base text-[#4B5563] max-w-2xl leading-relaxed">
          We&apos;d love to hear from you. Please fill out the form below and
          we&apos;ll get back to you as soon as possible.
        </p>

        {/* Form */}
        <form onSubmit={handleSubmit} className="mt-10 space-y-6 max-w-4xl">
          {/* Name */}
          <div className="space-y-2">
            <label
              htmlFor="name"
              className="block text-sm font-medium text-[#111827]"
            >
              Name
            </label>
            <input
              id="name"
              name="name"
              required
              placeholder="Enter your name"
              className="w-full rounded-md border border-[#E5E7EB] px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-emerald-600 focus:border-emerald-600 transition"
            />
          </div>

          {/* Email */}
          <div className="space-y-2">
            <label
              htmlFor="email"
              className="block text-sm font-medium text-[#111827]"
            >
              Email
            </label>
            <input
              id="email"
              name="email"
              type="email"
              required
              placeholder="Your email"
              className="w-full rounded-md border border-[#E5E7EB] px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-emerald-600 focus:border-emerald-600 transition"
            />
          </div>

          {/* Message */}
          <div className="space-y-2">
            <label
              htmlFor="message"
              className="block text-sm font-medium text-[#111827]"
            >
              Message
            </label>
            <textarea
              id="message"
              name="message"
              rows={7}
              required
              placeholder=""
              className="w-full rounded-md border border-[#E5E7EB] px-4 py-3 text-sm outline-none resize-none focus:ring-2 focus:ring-emerald-600 focus:border-emerald-600 transition"
            />
          </div>

          {/* Button + Status */}
          <div className="pt-2 flex items-center gap-4">
            <button
              type="submit"
              disabled={status === "submitting"}
              className="px-8 py-3 rounded-md bg-emerald-700 text-white text-sm font-semibold shadow-sm hover:bg-emerald-800 disabled:opacity-70 disabled:cursor-not-allowed transition"
            >
              {status === "submitting" ? "Sending..." : "Send Message"}
            </button>

            {status === "success" && (
              <span className="text-sm text-emerald-600">
                Your message has been sent.
              </span>
            )}
            {status === "error" && (
              <span className="text-sm text-red-500">
                Something went wrong. Please try again.
              </span>
            )}
          </div>
        </form>
      </div>
    </div>
  );
};

export default Contact;
