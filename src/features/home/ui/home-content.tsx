import {
	AspectRatio,
	Badge,
	Box,
	Card,
	Flex,
	Grid,
	Heading,
	Separator,
	Text,
} from "@radix-ui/themes";
import { Callout, PolymorphicButton } from "@/shared/components";
import type { IAction } from "@/shared/types";

export interface HomeContentProps {
	mainCta: IAction;
}

const IMAGES = [
	"my-playlists.jpeg",
	"add-track.jpeg",
	"browse.jpeg",
	"create.jpeg",
	"import-playlist.jpeg",
	"match.jpeg",
	"playlist.jpeg",
	"unfollow.jpeg",
];

export function HomeContent({ mainCta }: HomeContentProps) {
	return (
		<Flex direction="column" gap="4">
			<Callout color="yellow">
				Right now, only pre-approved accounts can sign in. If you&apos;re seeing
				this message, access isn&apos;t available yet — but it will be soon.
			</Callout>
			<Flex
				direction="column"
				align="center"
				style={{ maxWidth: 720, margin: "3rem auto" }}
				data-testid="home-screen-content"
			>
				<Heading align="center" size="9">
					Smart playlists, your personal soundtrack.
				</Heading>
				<Text align="center" mt="4" size="4">
					Sonarah helps you rebuild playlists track-by-track — matching flow,
					mood, and intent without auto-generation.
				</Text>
				<PolymorphicButton
					action={mainCta}
					mt="6"
					size="4"
					style={{ width: "fit-content" }}
				/>
			</Flex>
			<Separator style={{ width: "100%" }} />
			<Box py="4">
				<Heading size="6" mb="4" align="center">
					How it Works?
				</Heading>

				<Grid columns={{ xs: "1", sm: "2", md: "3" }} gap="4" justify="between">
					<Card>
						<Flex direction="column" gap="2">
							<Flex direction="row" align="center" gap="2">
								<Badge size="3" radius="full" variant="solid">
									1
								</Badge>
								<Heading size="4">Choose a reference playlist:</Heading>
							</Flex>
							<img
								alt="ScreenShot of reference playlist screen"
								src="playlist.jpeg"
								width="100%"
							/>
							<Text>
								Pick a playlist you trust — yours or someone else&apos;s.
							</Text>
						</Flex>
					</Card>
					<Card>
						<Flex direction="column" gap="2">
							<Flex direction="row" align="center" gap="2">
								<Badge size="3" radius="full" variant="solid">
									2
								</Badge>
								<Heading size="4">Match tracks one-to-one:</Heading>
							</Flex>
							<img
								alt="ScreenShot of match playlist screen"
								src="match.jpeg"
								width="100%"
							/>
							<Text>
								For each song, choose a single track that fits the same
								position.
							</Text>
						</Flex>
					</Card>
					<Card>
						<Flex direction="column" gap="2">
							<Flex direction="row" align="center" gap="2">
								<Badge size="3" radius="full" variant="solid">
									3
								</Badge>
								<Heading size="4">
									Build a new playlist with the same energy:
								</Heading>
							</Flex>
							<img
								alt="ScreenShot of create playlist screen"
								src="create.jpeg"
								width="100%"
							/>
							<Text>
								Each original track maps to exactly one new track in the same
								position.
							</Text>
						</Flex>
					</Card>
				</Grid>
			</Box>
			<Separator style={{ width: "100%" }} />
			<Heading size="6" mb="4" align="center">
				Demo
			</Heading>
			<AspectRatio ratio={16 / 9}>
				<iframe
					src={`https://www.youtube.com/embed/_vvhEZMpJiY`}
					title="YouTube video player"
					allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
					allowFullScreen
					style={{
						width: "100%",
						height: "100%",
						border: 0,
					}}
				/>
			</AspectRatio>
			<Separator style={{ width: "100%" }} />
			<Box py="4" mx="auto" maxWidth="720px">
				<Heading size="6" mb="4" align="center">
					Why Sonarah?
				</Heading>
				<ul style={{ margin: 0 }}>
					<li>You choose every track</li>
					<li>No playlists generated for you</li>
					<li>Order matters more than similarity</li>
					<li>Playlists are treated as intentional works</li>
				</ul>
			</Box>
			<Separator style={{ width: "100%" }} />
			<Box py="4">
				<Heading size="6" mb="4" align="center">
					ScreenShots
				</Heading>
				<Grid columns={{ xs: "1", sm: "2" }} gap="4">
					{IMAGES.map((src, index) => (
						<Box key={+index}>
							<img alt={src} src={src} style={{ width: "100%" }} />
						</Box>
					))}
				</Grid>
			</Box>
		</Flex>
	);
}
