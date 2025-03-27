import { notFound } from "next/navigation";
import { getProfileByUsername, getUserLikedPosts, getUserPosts, isFollowing } from "@/actions/profile.action";
import ProfilePageClient from "./ProfilePageClient";
import type { Metadata } from "next";

export async function generateMetadata({
  params,
}: {
  params: { username: string };
}): Promise<Metadata> {
  try {
    const { username } = params;
    return {
      title: `${username} | Profile`,
      description: `View ${username}'s profile`,
    };
  } catch (error) {
    console.error('Metadata generation failed:', error);
    return {
      title: 'Profile | Error',
      description: 'Failed to load profile metadata',
    };
  }
}

type PageProps = {
  params: { username: string };
  searchParams?: { [key: string]: string | string[] | undefined };
};

const ProfilePage = async ({ params }: PageProps) => {
  try {
    const { username } = params;
    const user = await getProfileByUsername(username);

    if (!user) {
      notFound();
    }

    const [posts, likedPosts, isCurrentUserFollowing] = await Promise.all([
      getUserPosts(user.id),
      getUserLikedPosts(user.id),
      isFollowing(user.id),
    ]);

    return (
      <ProfilePageClient
        user={user}
        posts={posts}
        likedPosts={likedPosts}
        isFollowing={isCurrentUserFollowing}
      />
    );
  } catch (error) {
    console.error('Profile page error:', error);
    notFound();
  }
};

export default ProfilePage;