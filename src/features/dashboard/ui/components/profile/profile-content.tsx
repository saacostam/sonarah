import { Avatar, Flex, Text } from "@radix-ui/themes";
import type { IUser } from "@/features/user/domain";

export interface ProfileContentProps {
	user: IUser;
}

export function ProfileContent({ user }: ProfileContentProps) {
	return (
		<Flex gap="4" align="center">
			<Avatar
				fallback={user.name.charAt(0)}
				src={user.profilePicture}
				radius="full"
				size="4"
			/>
			<Flex direction="column">
				<Text size="3">{user.name}</Text>
				<Text size="2" style={{ color: "var(--gray-10)" }}>
					{user.email}
				</Text>
			</Flex>
		</Flex>
	);
}
