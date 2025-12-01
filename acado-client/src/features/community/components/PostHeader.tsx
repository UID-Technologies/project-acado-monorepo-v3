import { memo, useState } from "react";
import { Link } from "react-router-dom";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/shadcnAvatar";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/shadcn/dropdown-menu";
import { EllipsisVertical } from "lucide-react";
import { toast } from "sonner";
import { formatDate } from "@/utils/commonDateFormat";
import RePost from "./repost";
import { Post } from "../@types/community";




interface PostHeaderProps {
    post: Post;
    isRepost?: boolean;
    userId: number | null;
    onDelete: (postId: number) => void;
}

const PostHeader: React.FC<PostHeaderProps> = ({ post, isRepost, userId, onDelete }) => {

    const categoryId = isRepost ? post.repost_category_id : post.category_id;
    const categoryName = isRepost ? post.repost_category_name : post.category_name;
    const userName = isRepost ? post.repost_user_name : post.name;
    const profileImage = isRepost ? post.repost_user_profile_image : post.user_profile_image;
    const createdBy = isRepost ? post.repost_user_id : post.created_by;
    const createdAt = isRepost ? post.repost_created_at : post.created_at;
    const [editRepostOpen, setEditRepostOpen] = useState(false);

    return (
        <>
            <div className="flex justify-between items-start mb-2">
                <div>
                    {categoryName && <Link to={`/community/mycommunities/${categoryId}`}>
                        <div className="flex gap-2 mb-2 rounded-lg overflow-hidden cursor-pointer">
                            <img src="/img/icons/people.png" className="w-5 h-5" alt="Community Icon" />
                            <span>{categoryName}</span>
                        </div>
                    </Link>
                    }
                    <Link to={`/portfolio/${createdBy}`}>
                        <div className="flex items-center gap-2">
                            <Avatar className="h-6 w-6">
                                <AvatarImage src={profileImage ?? `https://ui-avatars.com/api/?name=${userName}`} alt={userName ?? "User"} className="object-cover" />
                                <AvatarFallback>{userName?.charAt(0) ?? "U"}</AvatarFallback>
                            </Avatar>
                            <div className="flex items-center text-xs text-cblack">
                                <span className="capitalize">{userName ?? "Anonymous"}</span>
                                <span className="mx-1">•</span>
                                <span>{createdAt && formatDate(createdAt)}</span>
                            </div>
                        </div>
                    </Link>
                </div>
                <DropdownMenu>
                    <DropdownMenuTrigger>
                        <EllipsisVertical className="h-4 w-4 text-cblack" />
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="w-40" side="left" align="start">
                        {userId !== Number(createdBy) ? (
                            <>
                                {/* <DropdownMenuItem>Follow @{userName}</DropdownMenuItem> */}
                                <DropdownMenuItem>
                                    <Link to={`/portfolio/${createdBy}`}>View Profile</Link>
                                </DropdownMenuItem>
                                {/* <DropdownMenuItem>Copy Profile link</DropdownMenuItem> */}

                                <DropdownMenuItem
                                    onClick={() => {
                                        navigator.clipboard.writeText(`${window.location.origin}/portfolio/${createdBy}`);
                                        toast.success("Profile link copied successfully!", {
                                            position: "bottom-right",
                                        });
                                    }}
                                >
                                    Copy Profile link
                                </DropdownMenuItem>
                                <DropdownMenuSeparator />
                                {/* <DropdownMenuItem>
                                <span className="text-[#FF0000]">Report</span>
                            </DropdownMenuItem> */}
                            </>
                        ) : (
                            <>
                                {/* <DropdownMenuItem>Share Post</DropdownMenuItem> */}
                                {/* <DropdownMenuItem>Edit Post</DropdownMenuItem> */}
                                {!isRepost && (
                                    <Link to={`/community/myposts/createpost?id=${post.id}`} className="w-full">
                                        <DropdownMenuItem className="cursor-pointer">
                                            Edit Post
                                        </DropdownMenuItem>
                                    </Link>
                                )}
                                {isRepost && (
                                    <DropdownMenuItem
                                        className="cursor-pointer"
                                        onClick={() => setEditRepostOpen(true)}
                                    >
                                        Edit Repost
                                    </DropdownMenuItem>


                                )}

                                <DropdownMenuItem className="cursor-pointer" onClick={() => onDelete(post.id)}>
                                    <span className="text-[#FF0000]">{isRepost ? "Delete Repost" : "Delete Post"}</span>
                                </DropdownMenuItem>
                            </>
                        )}
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>
            {isRepost && (
                <RePost
                    post={post}
                    open={editRepostOpen}
                    isEdit={true}
                    onOpenChange={setEditRepostOpen}
                />
            )}
        </>
    );
};

export default memo(PostHeader);