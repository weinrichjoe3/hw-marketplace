"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";

interface Comment {
  id: string;
  content: string;
  created_at: string;
  user_id: string;
  display_name: string;
}

export function CommentSection({ listingId }: { listingId: string }) {
  const [comments, setComments] = useState<Comment[]>([]);
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const supabase = createClient();

  useEffect(() => {
    loadComments();
    supabase.auth.getUser().then(({ data }) => setIsLoggedIn(!!data.user));
  }, []);

  async function loadComments() {
    const { data } = await supabase
      .from("comments")
      .select("id, content, created_at, user_id")
      .eq("listing_id", listingId)
      .order("created_at", { ascending: true });

    if (!data || data.length === 0) {
      setComments([]);
      return;
    }

    // Fetch display names for comment authors
    const userIds = [...new Set(data.map((c) => c.user_id))];
    const { data: profiles } = await supabase
      .from("profiles")
      .select("id, display_name")
      .in("id", userIds);

    const nameMap = new Map(
      (profiles ?? []).map((p) => [p.id, p.display_name ?? "Anonymous"])
    );

    setComments(
      data.map((c) => ({
        ...c,
        display_name: nameMap.get(c.user_id) ?? "Anonymous",
      }))
    );
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!content.trim()) return;
    setLoading(true);

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      setLoading(false);
      return;
    }

    await supabase.from("comments").insert({
      listing_id: listingId,
      user_id: user.id,
      content: content.trim(),
    });

    setContent("");
    setLoading(false);
    loadComments();
  }

  function timeAgo(dateStr: string): string {
    const diff = Date.now() - new Date(dateStr).getTime();
    const mins = Math.floor(diff / 60000);
    if (mins < 60) return `${mins}m ago`;
    const hrs = Math.floor(mins / 60);
    if (hrs < 24) return `${hrs}h ago`;
    const days = Math.floor(hrs / 24);
    return `${days}d ago`;
  }

  return (
    <div>
      <h2 className="text-lg font-semibold mb-4">
        Comments{" "}
        <span className="text-gray-400 font-normal text-sm">
          ({comments.length})
        </span>
      </h2>

      {/* Comment form */}
      {isLoggedIn ? (
        <form onSubmit={handleSubmit} className="mb-6">
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Write a comment..."
            rows={3}
            className="w-full rounded-lg border border-gray-200 px-4 py-3 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-royal-blue/30 focus:border-royal-blue"
          />
          <div className="flex justify-end mt-2">
            <button
              type="submit"
              disabled={loading || !content.trim()}
              className="rounded-lg bg-royal-blue px-5 py-2 text-sm font-semibold text-white hover:bg-royal-blue/90 transition-colors disabled:opacity-50"
            >
              {loading ? "Posting..." : "Post Comment"}
            </button>
          </div>
        </form>
      ) : (
        <div className="mb-6 rounded-lg bg-gray-50 border border-gray-100 px-4 py-3 text-sm text-gray-500">
          <a href="/login" className="text-royal-blue hover:underline font-medium">
            Log in
          </a>{" "}
          to post a comment.
        </div>
      )}

      {/* Comments list */}
      {comments.length > 0 ? (
        <div className="space-y-4">
          {comments.map((c) => (
            <div key={c.id} className="rounded-lg border border-gray-100 p-4">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-7 h-7 rounded-full bg-royal-blue/10 flex items-center justify-center text-royal-blue text-xs font-bold">
                  {c.display_name.charAt(0).toUpperCase()}
                </div>
                <span className="text-sm font-semibold">
                  {c.display_name}
                </span>
                <span className="text-xs text-gray-400">{timeAgo(c.created_at)}</span>
              </div>
              <p className="text-sm text-gray-600 leading-relaxed">{c.content}</p>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-sm text-gray-400">
          No comments yet. Be the first to comment!
        </p>
      )}
    </div>
  );
}
