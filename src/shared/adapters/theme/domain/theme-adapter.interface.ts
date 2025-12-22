export enum IThemeVariant {
	DARK = "dark",
	LIGHT = "light",
}

export interface IThemeAdapter {
	theme: IThemeVariant;
	setTheme: (them: IThemeVariant) => void;
}
