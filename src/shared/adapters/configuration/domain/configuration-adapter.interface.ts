export enum IConfigurationAdapterStringKey {
	BASE_URL = "Base Url",
}

export interface IConfigurationAdapter {
	getString(key: IConfigurationAdapterStringKey): string | null;
}
