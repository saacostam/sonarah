import type { ReactNode } from "react";

export interface IButtonAction {
	label: ReactNode;
	action:
		| {
				type: "href";
				href: string;
		  }
		| {
				type: "button";
				onClick: () => void;
		  };
}
