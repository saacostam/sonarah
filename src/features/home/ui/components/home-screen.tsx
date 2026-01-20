import { useHomeScreen } from "../../app";
import { HomeScreenContent } from "./home-screen-content";
import { HomeScreenSkeleton } from "./home-screen-skeleton";

export function HomeScreen() {
	const { status, mainCta } = useHomeScreen();

	if (status === "loading") return <HomeScreenSkeleton />;

	return <HomeScreenContent mainCta={mainCta} />;
}
