// app/(dashboard)/dashboard/_components/utils/animations.ts
import { Variants } from "framer-motion";

export const fadeUp: Variants = {
  hidden: {
    opacity: 0,
    y: 20,
  },
  show: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.4,
      ease: [0.22, 1, 0.36, 1],
    },
  },
};

export const fadeIn: Variants = {
  hidden: {
    opacity: 0,
    scale: 0.95,
  },
  show: {
    opacity: 1,
    scale: 1,
    transition: {
      duration: 0.3,
      ease: "easeOut",
    },
  },
};

export const slideIn: Variants = {
  hidden: {
    opacity: 0,
    x: -20,
  },
  show: {
    opacity: 1,
    x: 0,
    transition: {
      duration: 0.3,
      ease: "easeOut",
    },
  },
};

export const scaleIn: Variants = {
  hidden: {
    opacity: 0,
    scale: 0.8,
  },
  show: {
    opacity: 1,
    scale: 1,
    transition: {
      duration: 0.3,
      ease: "easeOut",
    },
  },
};

export const staggerContainer: Variants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};
