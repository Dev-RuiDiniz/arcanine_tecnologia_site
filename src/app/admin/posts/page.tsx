import { redirect } from "next/navigation";

import { PostsManager } from "@/components/admin/posts/posts-manager";
import { requirePermission } from "@/lib/auth/guards";
import { listAdminPosts } from "@/services/post.service";

export default async function AdminPostsPage() {
  const permissionCheck = await requirePermission("pages:view");
  if (!permissionCheck.ok) {
    redirect("/admin");
  }

  const posts = await listAdminPosts();
  return <PostsManager initialPosts={posts} />;
}
