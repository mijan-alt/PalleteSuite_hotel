// src/components/BlogsArchive.tsx

import { BlogCard } from '../BlogCard'

export const BlogArchive: React.FC<{ posts: any[] }> = ({ posts }) => {
  return (
    <div className="grid gap-20 lg:gap-32">
      {posts.map((post, i) => (
        <BlogCard key={post.id} post={post} isReversed={i % 2 === 1} />
      ))}
    </div>
  )
}
