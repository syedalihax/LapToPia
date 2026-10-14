import React from 'react';

export default function AboutPage() {
  return (
    <section className="min-h-[65vh] bg-[#FAFAFA] px-4 py-16 text-black dark:bg-[#09090B] dark:text-white">
      <div className="mx-auto max-w-4xl">
        <p className="text-xs font-bold uppercase tracking-widest text-[#71717A]">About Us</p>
        <h1 className="mt-2 text-4xl font-bold">Systems for every day and every ambition.</h1>
        <p className="mt-6 max-w-2xl text-base leading-7 text-[#71717A]">LAPTOPIA brings laptops and complete computer systems together in one place. Explore gaming, student, office, and everyday options, along with servers and mining machines.</p>
        <div className="mt-10 grid gap-4 sm:grid-cols-2">
          {['Laptops', 'PC', 'Servers', 'Miner Machines'].map(item => <div key={item} className="rounded-xl border border-[#E4E4E7] bg-white p-5 text-lg font-semibold dark:border-[#27272A] dark:bg-[#121215]">{item}</div>)}
        </div>
      </div>
    </section>
  );
}