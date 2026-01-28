import { Grid, Skeleton } from "@radix-ui/themes";

export function SearchTrackSkeleton() {
	return (
		<Grid
			columns={{ xs: "1", md: "2" }}
			data-testid="search-track-skeleton"
			gap="2"
		>
			{new Array(12).fill(null).map((_, index) => (
				<Skeleton key={+index} height="64px" width="100%" />
			))}
		</Grid>
	);
}
