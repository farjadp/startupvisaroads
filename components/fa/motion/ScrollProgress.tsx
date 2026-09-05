'use client';

// A hairline that fills as the reader moves through the article — the one
// place the acid accent lives in the chrome of a guide.
import React from 'react';
import { motion, useScroll, useSpring } from 'motion/react';

export default function ScrollProgress() {
  const { scrollYProgress } = useScroll();
  const x = useSpring(scrollYProgress, { stiffness: 120, damping: 24, mass: 0.3 });
  return <motion.div aria-hidden className="fixed top-0 inset-x-0 h-[3px] bg-[#CCFF00] origin-right z-[60]" style={{ scaleX: x }} />;
}
