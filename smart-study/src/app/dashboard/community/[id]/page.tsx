"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  discussions as baseDiscussions,
  discussionCommentsData,
} from "../../../../../data";
import { ArrowLeft } from "lucide-react";

// Fallback small list if baseDiscussions is not exported – we won't rely on it for now.
const seedDiscussion = {
  id: 1,
  title: "Best practices for learning machine learning?",
  author: "Sarah Chen",
  avatar: "👩‍💻",
  course: "Machine Learning Fundamentals",
  timeAgo: "2 hours ago",
  tags: ["machine-learning", "tips", "beginner"],
};

export default function DiscussionPage({ params }: { params: { id: string } }) {
  const id = Number(params.id);
  const initialComments = discussionCommentsData[id] ?? [];
  const [comments, setComments] = useState(
    initialComments.map((c) => ({ ...c, likedByMe: false }))
  );
  const [newComment, setNewComment] = useState("");

  // In a real app we'd fetch the discussion by id; for now use seed content.
  const discussion = seedDiscussion;

  const handlePost = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim()) return;
    setComments((prev) => [
      {
        id: Date.now(),
        author: "You",
        avatar: "👤",
        timeAgo: "just now",
        content: newComment.trim(),
        likes: 0,
        likedByMe: false,
      },
      ...prev,
    ]);
    setNewComment("");
  };

  const toggleCommentLike = (commentId: number) => {
    setComments((prev) =>
      prev.map((c) =>
        c.id === commentId
          ? { ...c, likedByMe: !c.likedByMe, likes: c.likes + (c.likedByMe ? -1 : 1) }
          : c
      )
    );
  };

  return (
    <div className="p-8">
      <div className="mb-6 flex items-center justify-between">
        <Link href="/dashboard/community">
          <ArrowLeft className="w-8 h-8 border rounded-full text-black border-black hover:bg-gray-600 " />
        </Link>
      </div>

      <div className="bg-card border rounded-lg p-6 mb-6">
        <div className="flex items-start gap-4">
          <div className="text-2xl">{discussion.avatar}</div>
          <div className="flex-1 min-w-0">
            <h1 className="text-xl font-semibold mb-1">{discussion.title}</h1>
            <div className="flex items-center gap-4 text-sm text-muted-foreground mb-2">
              <span>by {discussion.author}</span>
              <span>in {discussion.course}</span>
              <span>{discussion.timeAgo}</span>
            </div>
            <div className="flex flex-wrap gap-2">
              {discussion.tags.map((tag) => (
                <span
                  key={tag}
                  className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs bg-primary/10 text-primary"
                >
                  #{tag}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-4">
          <form onSubmit={handlePost} className="bg-card border rounded-lg p-4">
            <label htmlFor="comment" className="text-sm font-medium">
              Add a comment
            </label>
            <div className="mt-2 flex items-center gap-3">
              <Input
                id="comment"
                placeholder="Write your reply..."
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
              />
              <Button type="submit">Reply</Button>
            </div>
          </form>

          {comments.length === 0 ? (
            <div className="text-sm text-muted-foreground">
              No comments yet. Be the first to reply.
            </div>
          ) : (
            <div className="space-y-3">
              {comments.map((c) => (
                <div key={c.id} className="bg-card border rounded-lg p-4">
                  <div className="flex items-start gap-3">
                    <div className="text-xl">{c.avatar}</div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 text-sm">
                        <span className="font-medium">{c.author}</span>
                        <span className="text-muted-foreground">
                          • {c.timeAgo}
                        </span>
                      </div>
                      <p className="mt-1 text-sm">{c.content}</p>
                      <div className="mt-2">
                        <motion.button
                          type="button"
                          onClick={() => toggleCommentLike(c.id)}
                          className={`inline-flex items-center px-2 py-1 rounded-md border text-xs transition-colors ${
                            c.likedByMe
                              ? "border-primary text-primary bg-primary/10"
                              : "border-input text-muted-foreground hover:bg-muted"
                          }`}
                          aria-pressed={c.likedByMe}
                          aria-label={c.likedByMe ? "Unlike comment" : "Like comment"}
                          whileTap={{ scale: 0.92 }}
                          whileHover={{ scale: 1.02 }}
                        >
                          <svg
                            className="mr-1 h-4 w-4"
                            viewBox="0 0 24 24"
                            fill={c.likedByMe ? "currentColor" : "none"}
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                            />
                          </svg>
                          {c.likes} {c.likes === 1 ? "like" : "likes"}
                        </motion.button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
        <div className="space-y-4">
          <div className="bg-card border rounded-lg p-4">
            <p className="text-sm font-medium mb-2">About this thread</p>
            <p className="text-sm text-muted-foreground">
              Stay respectful and on-topic. Share resources and concrete
              examples where possible.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
