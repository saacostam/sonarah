import { AnimatePresence, motion } from "framer-motion";
import type { PropsWithChildren } from "react";

type AutoHeightPresenceProps = PropsWithChildren<{
	isOpen: boolean;
}>;

export function AutoHeightPresence({
	isOpen,
	children,
}: AutoHeightPresenceProps) {
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
						overflow: "hidden",
					}}
				>
					{children}
				</motion.div>
			)}
		</AnimatePresence>
	);
}
