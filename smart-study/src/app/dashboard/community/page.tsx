"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { fadeInUp, staggerContainer, scalePop } from "@/lib/motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const CommunityPage = () => {
  const [showModal, setShowModal] = useState(false);
  const [newTitle, setNewTitle] = useState("");
  const [newTopic, setNewTopic] = useState("");
  const [newTags, setNewTags] = useState("");

  const [discussions, setDiscussions] = useState([
    {
      id: 1,
      title: "Best practices for learning machine learning?",
      author: "Sarah Chen",
      avatar: "👩‍💻",
      course: "Machine Learning Fundamentals",
      replies: 12,
      likes: 24,
      likedByMe: false,
      timeAgo: "2 hours ago",
      tags: ["machine-learning", "tips", "beginner"],
    },
    {
      id: 2,
      title: "Help with Python list comprehensions",
      author: "Mike Johnson",
      avatar: "👨‍💼",
      course: "Python Programming Bootcamp",
      replies: 8,
      likes: 15,
      likedByMe: false,
      timeAgo: "4 hours ago",
      tags: ["python", "help", "syntax"],
    },
    {
      id: 3,
      title: "Neural network architecture recommendations",
      author: "Dr. Emily Rodriguez",
      avatar: "👩‍🔬",
      course: "Neural Networks & Deep Learning",
      replies: 18,
      likes: 42,
      likedByMe: false,
      timeAgo: "6 hours ago",
      tags: ["neural-networks", "architecture", "advanced"],
    },
    {
      id: 4,
      title: "Study group for AI fundamentals - Join us!",
      author: "Alex Kim",
      avatar: "👨‍🎓",
      course: "AI Fundamentals Mastery",
      replies: 25,
      likes: 38,
      likedByMe: false,
      timeAgo: "1 day ago",
      tags: ["study-group", "collaboration", "ai"],
    },
  ]);

  const toggleLike = (id: number) => {
    setDiscussions((prev) =>
      prev.map((d) =>
        d.id === id
          ? { ...d, likedByMe: !d.likedByMe, likes: d.likes + (d.likedByMe ? -1 : 1) }
          : d
      )
    );
  };

  const handleCreateDiscussion = (e: React.FormEvent) => {
    e.preventDefault();
    const title = newTitle.trim();
    const description = newTopic.trim();
    const tags = newTags
      .split(",")
      .map((t) => t.trim())
      .filter(Boolean);

    if (!title || !description) return;

    const newDiscussion = {
      id: Date.now(),
      title,
      author: "You",
      avatar: "👤",
      course: "General",
      replies: 0,
      likes: 0,
      likedByMe: false,
      timeAgo: "just now",
      tags,
    } as (typeof discussions)[number];

    setDiscussions((prev) => [newDiscussion, ...prev]);
    setNewTitle("");
    setNewTopic("");
    setNewTags("");
    setShowModal(false);
  };

  const studyGroups = [
    {
      id: 1,
      name: "AI Enthusiasts",
      members: 156,
      description: "Discussing latest trends in artificial intelligence",
      activity: "Very Active",
      image: "🤖",
    },
    {
      id: 2,
      name: "Python Developers",
      members: 203,
      description: "Python programming tips, tricks, and projects",
      activity: "Active",
      image: "🐍",
    },
    {
      id: 3,
      name: "Data Science Hub",
      members: 89,
      description: "Data analysis, visualization, and insights",
      activity: "Moderate",
      image: "📊",
    },
  ];

  const leaderboard = [
    { rank: 1, name: "Sarah Chen", points: 2450, avatar: "👩‍💻" },
    { rank: 2, name: "Mike Johnson", points: 2380, avatar: "👨‍💼" },
    { rank: 3, name: "Emily Rodriguez", points: 2290, avatar: "👩‍🔬" },
    { rank: 4, name: "Alex Kim", points: 2150, avatar: "👨‍🎓" },
    { rank: 5, name: "You", points: 1980, avatar: "👤" },
  ];

  return (
    <div className="p-8">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Community</h1>
            <p className="text-muted-foreground">
              Connect with fellow learners and share knowledge
            </p>
          </div>
          <Button
            className="bg-gradient-to-r from-primary to-primary/90"
            onClick={() => setShowModal(true)}
          >
            <svg
              className="mr-2 h-4 w-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 4v16m8-8H4"
              />
            </svg>
            Start Discussion
          </Button>
        </div>
      </div>

      <div className="grid gap-8 lg:grid-cols-3">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Filter Tabs */}
          <div className="flex space-x-1 bg-muted p-1 rounded-lg w-fit">
            <Button variant="default" size="sm" className="rounded-md">
              All Discussions
            </Button>
            <Button variant="ghost" size="sm" className="rounded-md">
              My Courses
            </Button>
            <Button variant="ghost" size="sm" className="rounded-md">
              Following
            </Button>
            <Button variant="ghost" size="sm" className="rounded-md">
              Popular
            </Button>
          </div>

          {/* Discussions */}
          <motion.div
            className="space-y-4"
            variants={staggerContainer(0.06, 0.05)}
            initial="initial"
            animate="animate"
          >
            {discussions.map((discussion) => (
              <motion.div
                key={discussion.id}
                className="bg-card border rounded-lg p-6 hover:shadow-md transition-shadow"
                variants={fadeInUp}
              >
                <div className="flex items-start space-x-4">
                  <div className="text-2xl">{discussion.avatar}</div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center space-x-2 mb-2">
                      <a
                        href={`/dashboard/community/${discussion.id}`}
                        className="text-lg font-semibold hover:text-primary cursor-pointer"
                      >
                        {discussion.title}
                      </a>
                    </div>

                    <div className="flex items-center space-x-4 text-sm text-muted-foreground mb-3">
                      <span>by {discussion.author}</span>
                      <span>in {discussion.course}</span>
                      <span>{discussion.timeAgo}</span>
                    </div>

                    <div className="flex flex-wrap gap-2 mb-3">
                      {discussion.tags.map((tag, index) => (
                        <span
                          key={index}
                          className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs bg-primary/10 text-primary"
                        >
                          #{tag}
                        </span>
                      ))}
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                        <div className="flex items-center">
                          <svg
                            className="mr-1 h-4 w-4"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                            />
                          </svg>
                          {discussion.replies} replies
                        </div>
                        <motion.button
                          type="button"
                          onClick={() => toggleLike(discussion.id)}
                          className={`flex items-center px-2 py-1 rounded-md border text-xs transition-colors ${
                            discussion.likedByMe
                              ? "border-primary text-primary bg-primary/10"
                              : "border-input text-muted-foreground hover:bg-muted"
                          }`}
                          aria-pressed={discussion.likedByMe}
                          aria-label={discussion.likedByMe ? "Unlike" : "Like"}
                          whileTap={{ scale: 0.92 }}
                          whileHover={{ scale: 1.02 }}
                        >
                          <svg
                            className="mr-1 h-4 w-4"
                            viewBox="0 0 24 24"
                            fill={discussion.likedByMe ? "currentColor" : "none"}
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                            />
                          </svg>
                          {discussion.likes} {discussion.likes === 1 ? "like" : "likes"}
                        </motion.button>
                      </div>
                      <Button variant="outline" size="sm" asChild>
                        <a href={`/dashboard/community/${discussion.id}`}>
                          Join Discussion
                        </a>
                      </Button>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Study Groups */}
          <div className="bg-card border rounded-lg p-6">
            <h2 className="text-lg font-semibold mb-4">Study Groups</h2>
            <div className="space-y-4">
              {studyGroups.map((group) => (
                <div
                  key={group.id}
                  className="p-3 border rounded-lg hover:bg-muted/50 cursor-pointer"
                >
                  <div className="flex items-center space-x-3 mb-2">
                    <div className="text-xl">{group.image}</div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-medium truncate">{group.name}</h3>
                      <p className="text-xs text-muted-foreground">
                        {group.members} members
                      </p>
                    </div>
                    <span
                      className={`text-xs px-2 py-1 rounded-full ${
                        group.activity === "Very Active"
                          ? "bg-green-100 text-green-800"
                          : group.activity === "Active"
                          ? "bg-blue-100 text-blue-800"
                          : "bg-yellow-100 text-yellow-800"
                      }`}
                    >
                      {group.activity}
                    </span>
                  </div>
                  <p className="text-sm text-muted-foreground mb-2">
                    {group.description}
                  </p>
                  <Button variant="outline" size="sm" className="w-full">
                    Join Group
                  </Button>
                </div>
              ))}
            </div>
          </div>

          {/* Leaderboard */}
          <div className="bg-card border rounded-lg p-6">
            <h2 className="text-lg font-semibold mb-4">
              Community Leaderboard
            </h2>
            <div className="space-y-3">
              {leaderboard.map((user) => (
                <div
                  key={user.rank}
                  className={`flex items-center space-x-3 p-2 rounded-lg ${
                    user.name === "You"
                      ? "bg-primary/10 border border-primary/20"
                      : ""
                  }`}
                >
                  <div className="flex items-center justify-center w-6 h-6 rounded-full bg-muted text-xs font-medium">
                    {user.rank}
                  </div>
                  <div className="text-lg">{user.avatar}</div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">{user.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {user.points} points
                    </p>
                  </div>
                  {user.rank <= 3 && (
                    <div className="text-lg">
                      {user.rank === 1 ? "🥇" : user.rank === 2 ? "🥈" : "🥉"}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
      {/* Create Post Modal */}
      <AnimatePresence>
        {showModal && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            {/* Backdrop */}
            <div
              className="absolute inset-0 bg-black/50"
              onClick={() => setShowModal(false)}
            />
            {/* Dialog */}
            <motion.div
              className="relative z-10 w-full max-w-lg rounded-lg border bg-card p-6 shadow-xl"
              variants={scalePop}
              initial="initial"
              animate="animate"
              exit="exit"
              role="dialog"
              aria-modal="true"
              aria-label="Start a new discussion"
            >
              <h3 className="text-lg font-semibold mb-4">Start a new discussion</h3>
              <form onSubmit={handleCreateDiscussion} className="space-y-4">
                <div>
                  <label htmlFor="new-title" className="text-sm font-medium">
                    Title
                  </label>
                  <Input
                    id="new-title"
                    placeholder="Enter a clear, descriptive title"
                    value={newTitle}
                    onChange={(e) => setNewTitle(e.target.value)}
                    className="mt-1"
                  />
                </div>
                <div>
                  <label htmlFor="new-description" className="text-sm font-medium">
                    Description
                  </label>
                  <textarea
                    id="new-description"
                    placeholder="Describe your question or topic..."
                    value={newTopic}
                    onChange={(e) => setNewTopic(e.target.value)}
                    className="mt-1 w-full rounded-md border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                    rows={5}
                  />
                </div>
                <div>
                  <label htmlFor="new-tags" className="text-sm font-medium">
                    Tags (comma separated)
                  </label>
                  <Input
                    id="new-tags"
                    placeholder="e.g. machine-learning, tips, beginner"
                    value={newTags}
                    onChange={(e) => setNewTags(e.target.value)}
                    className="mt-1"
                  />
                </div>
                <div className="flex justify-end gap-2 pt-2">
                  <Button type="button" variant="outline" onClick={() => setShowModal(false)}>
                    Cancel
                  </Button>
                  <Button type="submit" className="bg-gradient-to-r from-primary to-primary/90">
                    Create
                  </Button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default CommunityPage;
