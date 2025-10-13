import type { ISession } from "../entities";

export interface IAuthAdapter {
    getSession: () => Promise<ISession>;
}
