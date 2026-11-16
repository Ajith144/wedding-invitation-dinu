import { motion, useReducedMotion } from 'framer-motion';
import couplePortrait from '../photos/de055bc7-f249-4849-9e21-5af6d77b4635.jpeg';
export default function CoupleVideoScene() {
  const reducedMotion = useReducedMotion();

  return (
    <div className="couple-scene-wrap">
      <motion.img
        className="cover-couple-photo"
        src={couplePortrait}
        alt="Diwarkar and Shwetha together in wedding attire"
        initial={false}
        animate={reducedMotion ? undefined : { y: [0, -6, 0], scale: [1, 1.015, 1] }}
        transition={{ duration: 5.5, repeat: Infinity, ease: 'easeInOut' }}
      />
    </div>
  );
}