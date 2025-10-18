import { Flex, Heading, Text } from "@radix-ui/themes";
import { PolymorphicButton } from "@/shared/components";
import type { IButtonAction } from "@/shared/types";

export interface HomeScreenContentProps {
	mainCta: IButtonAction;
}

export function HomeScreenContent({ mainCta }: HomeScreenContentProps) {
	return (
		<Flex
			direction="column"
			align="center"
			style={{ maxWidth: 720, margin: "3rem auto" }}
		>
			<Heading align="center" size="9">
				Smart playlists, your personal soundtrack.
			</Heading>
			<Text align="center" mt="4" size="4">
				Sonarah analyzes the energy of your favorite music and crafts new
				playlists with precision and personality.
			</Text>
			<PolymorphicButton
				action={mainCta}
				mt="6"
				size="4"
				style={{ width: "fit-content" }}
			/>
		</Flex>
	);
}
