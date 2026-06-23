export const fadeIn = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.4 } },
}

export const slideUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: 'easeOut' } },
}

export const staggerContainer = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.07,
      delayChildren: 0.1,
    },
  },
}

export const cardHover = {
  rest: { scale: 1, y: 0, boxShadow: '0 1px 3px rgba(0,0,0,0.05)' },
  hover: {
    scale: 1.02,
    y: -4,
    boxShadow: '0 10px 40px rgba(139,92,246,0.15)',
    transition: { duration: 0.2, ease: 'easeOut' },
  },
}

export const sidebarItem = {
  rest: { x: 0, backgroundColor: 'transparent' },
  hover: {
    x: 4,
    backgroundColor: 'rgba(139,92,246,0.08)',
    transition: { duration: 0.15 },
  },
}

export const pageTransition = {
  initial: { opacity: 0, y: 12 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -8 },
  transition: { duration: 0.3, ease: 'easeInOut' },
}

export const numberCounter = {
  hidden: { opacity: 0, scale: 0.8 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { duration: 0.5, ease: 'backOut' },
  },
}
