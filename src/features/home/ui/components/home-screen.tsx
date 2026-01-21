import { LazyLoadedSkeleton } from "@/shared/adapters/navigation/ui";
import { useHomeScreen } from "../../app";
import { HomeScreenContent } from "./home-screen-content";

export function HomeScreen() {
	const { status, mainCta } = useHomeScreen();

	if (status === "loading")
		return <LazyLoadedSkeleton style={{ margin: "8rem 0" }} />;

	return <HomeScreenContent mainCta={mainCta} />;
}
