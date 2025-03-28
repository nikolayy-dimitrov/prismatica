import { ReactNode, useState } from "react";
import { motion } from "framer-motion";

interface FlipCardProps {
    front: ReactNode;
    back: ReactNode;
};

const fadeInLeft = {
    hidden: { opacity: 0, x: -20 },
    visible: { opacity: 1, x: 0, transition: { duration: 1.2, ease: "easeOut" } }
};

export const FlipCard = ({ front, back }: FlipCardProps) => {
    const [flipped, setFlipped] = useState(false);

    return (
        <motion.div
            className="relative h-[50vh] cursor-pointer"
            onClick={() => setFlipped((prev) => !prev)}
            style={{ perspective: 1000 }}
            variants={fadeInLeft}
        >
            <motion.div
                className="absolute inset-0 rounded-lg shadow-lg"
                animate={{ rotateY: flipped ? 180 : 0 }}
                transition={{ duration: 0.8, ease: "easeOut" }}
                style={{ transformStyle: "preserve-3d" }}
            >
                {/* Front Side */}
                <motion.div
                    className="absolute inset-0"
                    style={{ backfaceVisibility: "hidden" }}
                >
                    {front}
                </motion.div>
                {/* Back Side */}
                <motion.div
                    className="absolute inset-0"
                    style={{ backfaceVisibility: "hidden", rotateY: 180 }}
                >
                    {back}
                </motion.div>
            </motion.div>
        </motion.div>
    );
};
