import { LazyLoadedSkeleton } from "@/shared/adapters/navigation/ui";
import { useHome } from "../app";
import { HomeContent } from "./home-content";

export function Home() {
	const { status, mainCta } = useHome();

	if (status === "loading")
		return <LazyLoadedSkeleton style={{ margin: "8rem 0" }} />;

	return <HomeContent mainCta={mainCta} />;
}
