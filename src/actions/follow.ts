"use server";

// import { auth } from "@clerk/nextjs";
import prisma from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";

export async function toggleFollowAction(targetUserId: string) {
  try {
    const { userId: clerkId } =await auth();
    if (!clerkId) throw new Error("Not authenticated");

    const user = await prisma.user.findUnique({
      where: { clerkId },
    });

    if (!user) throw new Error("User not found");
    if (user.id === targetUserId) throw new Error("You cannot follow yourself");

    const existingFollow = await prisma.follows.findUnique({
      where: {
        followerId_followingId: {
          followerId: user.id,
          followingId: targetUserId,
        },
      },
    });

    if (existingFollow) {
      await prisma.follows.delete({
        where: {
          followerId_followingId: {
            followerId: user.id,
            followingId: targetUserId,
          },
        },
      });
    } else {
      await prisma.$transaction([
        prisma.follows.create({
          data: {
            followerId: user.id,
            followingId: targetUserId,
          },
        }),
        prisma.notification.create({
          data: {
            type: "FOLLOW",
            userId: targetUserId,
            creatorId: user.id,
          },
        }),
      ]);
    }

    revalidatePath("/");
    revalidatePath(`/profile/${targetUserId}`);
    
    return { success: true, isFollowing: !existingFollow };
  } catch (error) {
    console.error("Error in toggleFollow:", error);
    throw new Error(error instanceof Error ? error.message : "Failed to toggle follow");
  }
}