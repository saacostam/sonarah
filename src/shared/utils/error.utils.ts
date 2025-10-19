import { DomainError } from "@/features/errors/domain";

export function getErrorMessage(e: unknown, defaultMessage: string): string {
	return e instanceof DomainError ? e.message : defaultMessage;
}
