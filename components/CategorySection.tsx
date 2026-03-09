"use client";

import { motion } from "framer-motion";
import type { Reading, ReadingCategory } from "@/lib/readings";
import { categoryLabels } from "@/lib/readings";
import ReadingCard from "./ReadingCard";

interface CategorySectionProps {
  category: ReadingCategory;
  readings: Reading[];
}

export default function CategorySection({
  category,
  readings,
}: CategorySectionProps) {
  const { title, subtitle } = categoryLabels[category];

  return (
    <section className="mb-16">
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
        className="mb-8"
      >
        <h2 className="font-serif text-2xl md:text-3xl text-bone mb-2">
          {title}
        </h2>
        <p className="text-sm text-ash">{subtitle}</p>
      </motion.div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {readings.map((reading, i) => (
          <ReadingCard key={reading.id} reading={reading} index={i} />
        ))}
      </div>
    </section>
  );
}
