import { type PropsWithChildren, useMemo, useState } from "react";
import { LimitedUsersAccessAlertManagerContext } from "../app";
import type { ILimitedUsersAccessAlertManager } from "../domain";
import { LimitedUsersAccessAlert } from "./limited-users-access-alert";

export function LimitedUsersAccessAlertManagerProvider({
	children,
}: PropsWithChildren) {
	const [status, setStatus] = useState<
		ILimitedUsersAccessAlertManager["status"]
	>({
		type: "closed",
	});

	const manager: ILimitedUsersAccessAlertManager = useMemo(
		() => ({
			status,
			setStatus,
		}),
		[status],
	);

	return (
		<LimitedUsersAccessAlertManagerContext.Provider value={manager}>
			{children}
			<LimitedUsersAccessAlert />
		</LimitedUsersAccessAlertManagerContext.Provider>
	);
}
