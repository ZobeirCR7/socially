"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import toast from "react-hot-toast";
import { toggleFollowAction } from "@/actions/follow";


interface FollowButtonProps {
  userId: string;
  isFollowing?: boolean;
}

function FollowButton({ userId, isFollowing = false }: FollowButtonProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [following, setFollowing] = useState(isFollowing);

  const handleFollow = async () => {
    if (!userId) {
      toast.error("User ID is missing");
      return;
    }

    setIsLoading(true);

    try {
      const result = await toggleFollowAction(userId);
      setFollowing(result.isFollowing);
      toast.success(result.isFollowing ? "Followed successfully" : "Unfollowed successfully");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Error updating follow status");
      console.error("Follow error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Button
      size="sm"
      variant={following ? "outline" : "secondary"}
      onClick={handleFollow}
      disabled={isLoading}
      aria-busy={isLoading}
      className="w-24"
    >
      {isLoading ? (
        <Loader2 className="w-4 h-4 animate-spin" />
      ) : (
        following ? "Following" : "Follow"
      )}
    </Button>
  );
}
export default FollowButton