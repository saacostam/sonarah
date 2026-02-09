import { AnimatePresence, type MotionStyle, motion } from "framer-motion";
import type { PropsWithChildren } from "react";

export interface AutoHeightPresenceProps {
	isOpen: boolean;
	style?: MotionStyle;
}

export function AutoHeightPresence({
	children,
	isOpen,
	style,
}: PropsWithChildren<AutoHeightPresenceProps>) {
	return (
		<AnimatePresence>
			{isOpen && (
				<motion.div
					key="auto-height"
					initial={{ opacity: 0, height: 0 }}
					animate={{ opacity: 1, height: "auto" }}
					exit={{ opacity: 0, height: 0 }}
					transition={{ duration: 0.25, ease: "easeInOut" }}
					style={{
						...style,
						overflow: "hidden",
					}}
				>
					{children}
				</motion.div>
			)}
		</AnimatePresence>
	);
}
