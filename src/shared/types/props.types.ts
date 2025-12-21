import type { ReactNode } from "react";

export interface IAction {
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
