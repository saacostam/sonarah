import type { DomainError, IErrorLoggerAdapter } from "../../domain";

export class MockErrorLoggerAdapter implements IErrorLoggerAdapter {
	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	async log(_error: DomainError): Promise<void> {
		/* do nothing */
	}

	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	async logAny(_error: unknown): Promise<void> {
		/* do nothing */
	}
}
