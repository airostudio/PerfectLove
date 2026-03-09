"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import type { Reading } from "@/lib/readings";

interface ReadingCardProps {
  reading: Reading;
  index: number;
}

export default function ReadingCard({ reading, index }: ReadingCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.4, delay: index * 0.05 }}
    >
      <Link href={reading.href} className="block h-full">
        <div className="glass-card-hover p-6 h-full flex flex-col cursor-pointer group">
          <span className="text-xl mb-3 block">{reading.icon}</span>
          <h3 className="font-serif text-lg text-bone mb-2 group-hover:text-orchid transition-colors">
            {reading.title}
          </h3>
          <p className="text-sm text-mist/60 leading-relaxed flex-1">
            {reading.description}
          </p>
          <span className="text-xs text-orchid/50 mt-4 group-hover:text-orchid transition-colors">
            Start reading &rarr;
          </span>
        </div>
      </Link>
    </motion.div>
  );
}
