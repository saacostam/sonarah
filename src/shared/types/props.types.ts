export interface IButtonAction {
	label: string;
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
