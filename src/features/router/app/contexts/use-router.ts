import { useContext } from "react";
import { RouterContext } from "./router.context";

export function useRouter() {
	return useContext(RouterContext);
}
