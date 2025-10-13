import type { DomainError } from "../errors";

export interface IErrorLoggerAdapter {
	log(error: DomainError): Promise<void>;
	logAny(error: unknown): Promise<void>;
}
