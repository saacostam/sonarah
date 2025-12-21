import { DomainError } from "@/shared/adapters/errors/domain";

export function getErrorMessage(e: unknown, defaultMessage: string): string {
	return e instanceof DomainError ? e.message : defaultMessage;
}
