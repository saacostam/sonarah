import { Flex, Heading } from "@radix-ui/themes";
import { useMutationStartAuthFlow } from "@/features/auth/app";
import { PolymorphicButton } from "@/shared/components";

export function LoginScreen() {
	const startAuthFlow = useMutationStartAuthFlow();

	return (
		<Flex
			direction="column"
			align="center"
			style={{ maxWidth: 720, margin: "3rem auto" }}
		>
			<Heading align="center" size="8">
				Login (Spotify OAuth)
			</Heading>
			<PolymorphicButton
				action={{
					action: {
						type: "button",
						onClick: () => startAuthFlow.mutate(),
					},
					label: "Login with Spotify",
				}}
				mt="5"
				size="4"
				style={{ width: "fit-content" }}
				loading={startAuthFlow.isPending}
			/>
		</Flex>
	);
}
