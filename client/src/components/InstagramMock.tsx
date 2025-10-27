import React, { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import type { Profile, Highlight, Story, Post } from '../services/aiService';

export interface InstagramMockProps {
  profile: Profile;
  highlights: Highlight[];
  posts: Post[];
  onSave?: () => void;
  isAuth?: boolean;
  loading?: boolean;
}

export default function InstagramMock({ profile, highlights, posts, onSave, isAuth, loading = false }: InstagramMockProps) {
  const [modalPost, setModalPost] = useState<Post | null>(null);
  const [viewingStories, setViewingStories] = useState<Story[] | null>(null);
  const [currentStoryIndex, setCurrentStoryIndex] = useState<number>(0);

  // Esc to close modals
  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === 'Escape') {
        if (modalPost) setModalPost(null);
        if (viewingStories) {
          setViewingStories(null);
          setCurrentStoryIndex(0);
        }
      }
    }
    if (modalPost || viewingStories) {
      window.addEventListener('keydown', onKeyDown);
      return () => window.removeEventListener('keydown', onKeyDown);
    }
  }, [modalPost, viewingStories]);

  return (
    <div className="w-full max-w-md bg-white rounded-lg shadow-lg border overflow-hidden">
      {/* Top Bar with username (nickname) */}
      <div className="bg-white px-4 py-2">
        <div className="font-semibold text-base">{profile.username}</div>
      </div>

      {/* Header */}
      <div className="bg-white p-3 mb-3">
        <div className="flex items-start gap-4 mb-3">
          {/* Avatar */}
          {loading ? (
            <div className="w-20 h-20 rounded-full bg-slate-200 animate-pulse flex-shrink-0" />
          ) : (
            <div className="w-20 h-20 rounded-full bg-gradient-to-br from-purple-400 to-pink-500 flex items-center justify-center text-white text-2xl font-bold flex-shrink-0">
              {profile.name?.charAt(0).toUpperCase()}
            </div>
          )}

          {/* Stats */}
          <div className="flex-1">
            {/* Name */}
            {loading ? (
              <>
                <div className="h-4 w-40 bg-slate-200 rounded animate-pulse mb-2" />
                <div className="flex w-full pr-10 justify-between gap-4 text-sm">
                  <div className='flex w-full flex-col'><span className="h-4 w-10 bg-slate-200 rounded animate-pulse" /> <span className="text-xs mt-1 h-3 w-10 bg-slate-100 rounded" /></div>
                  <div className='flex w-full flex-col'><span className="h-4 w-16 bg-slate-200 rounded animate-pulse" /> <span className="text-xs mt-1 h-3 w-14 bg-slate-100 rounded" /></div>
                  <div className='flex w-full flex-col'><span className="h-4 w-10 bg-slate-200 rounded animate-pulse" /> <span className="text-xs mt-1 h-3 w-12 bg-slate-100 rounded" /></div>
                </div>
              </>
            ) : (
              <>
                <div className="font-semibold text-sm mb-1">{profile.name}</div>
                <div className="flex w-full pr-10 justify-between gap-4 text-sm">
                  <div className='flex w-full flex-col '><span className="font-semibold">{profile.postsCount}</span> <span className="text-xs">posts</span></div>
                  <div className='flex w-full flex-col'><span className="font-semibold">{profile.followers.toLocaleString()}</span> <span className="text-xs">followers</span></div>
                  <div className='flex w-full flex-col'><span className="font-semibold">{profile.following}</span> <span className="text-xs">following</span></div>
                </div>
              </>
            )}
          </div>
        </div>

        {/* Bio */}
        {loading ? (
          <div className="space-y-2 mb-3">
            <div className="h-3 w-5/6 bg-slate-200 rounded animate-pulse" />
            <div className="h-3 w-2/3 bg-slate-200 rounded animate-pulse" />
            <div className="h-3 w-1/2 bg-slate-200 rounded animate-pulse" />
          </div>
        ) : (
          <div className="text-xs text-slate-700 mb-3 whitespace-pre-line">
            {profile.bio}
          </div>
        )}

        {/* Highlights */}
        {loading ? (
          <div className="flex gap-3 overflow-x-hidden pb-2">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="flex flex-col items-center flex-shrink-0">
                <div className="w-14 h-14 rounded-full bg-slate-200 animate-pulse mb-1" />
                <div className="h-2 w-10 bg-slate-100 rounded" />
              </div>
            ))}
          </div>
        ) : (
          highlights && highlights.length > 0 && Array.isArray(highlights) && (
            <div className="flex gap-3 overflow-x-auto pb-2">
              {highlights.map((highlight, idx) => (
                <div
                  key={idx}
                  className="flex flex-col items-center cursor-pointer flex-shrink-0"
                  onClick={() => {
                    if (highlight.stories && Array.isArray(highlight.stories)) {
                      setViewingStories(highlight.stories);
                      setCurrentStoryIndex(0);
                    }
                  }}
                >
                  <div className="w-14 h-14 rounded-full bg-gradient-to-br from-yellow-400 to-pink-500 flex items-center justify-center text-white text-base font-bold mb-1 border-2 border-white shadow">
                    {highlight.title.charAt(0).toUpperCase()}
                  </div>
                  <div className="text-[10px] text-center max-w-[60px] truncate">{highlight.title}</div>
                </div>
              ))}
            </div>
          )
        )}
      </div>

      {/* Posts Grid */}
      <div className="grid grid-cols-3 gap-1">
        {loading
          ? Array.from({ length: 9 }).map((_, i) => (
              <div key={i} className="aspect-[4/5] bg-slate-200 animate-pulse rounded" />
            ))
          : Array.isArray(posts) && posts.length > 0 
          ? posts.map((post) => (
              <div
                key={post.index}
                className="aspect-[4/5] bg-slate-100 flex flex-col items-center justify-center cursor-pointer hover:bg-slate-200 transition text-xs p-1"
                onClick={() => setModalPost(post)}
              >
                <div className="font-bold text-sm mb-1">{post.index}</div>
                <div className="text-center text-slate-700 line-clamp-4">{post.img}</div>
              </div>
            ))
          : (
              <div className="col-span-3 text-center text-slate-500 p-4">No posts available</div>
            )}
      </div>

      {onSave && (
        <div className="p-3">
          {isAuth ? (
            <button className="bg-green-600 text-white px-4 py-2 rounded w-full" onClick={onSave}>
              Save to history
            </button>
          ) : (
            <p className="text-sm text-slate-600 text-center">
              <a href="/login" className="text-blue-600 underline">Login</a> to save your history
            </p>
          )}
        </div>
      )}

      {/* Post Modal */}
      {modalPost && (
        <div
          className="fixed inset-0 bg-black/40 flex items-center justify-center z-50"
          onClick={() => setModalPost(null)}
          role="dialog"
          aria-modal="true"
        >
          <div
            className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md relative"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              className="absolute top-2 right-2 text-xl text-slate-500 hover:text-slate-800"
              onClick={() => setModalPost(null)}
              aria-label="Close"
            >
              ×
            </button>
            <div className="mb-2 text-xs text-slate-400">Post #{modalPost.index}</div>
            <div className="mb-3 font-semibold">{modalPost.img}</div>
            <div className="mb-3 whitespace-pre-wrap">{modalPost.content}</div>
            <div className="mb-2 text-blue-700">{modalPost.hashtags}</div>
            <div className="text-green-700 font-medium mb-4">{modalPost.callToAction}</div>

            {/* Copy buttons */}
            <div className="flex gap-2 justify-end">
              <button
                className="px-3 py-2 rounded bg-slate-100 hover:bg-slate-200 text-slate-800 text-sm"
                onClick={async () => {
                  try {
                    await navigator.clipboard.writeText(`${modalPost.content}\n\n${modalPost.hashtags}`.trim());
                    toast.success('Caption copied');
                  } catch (e) {
                    toast.error('Failed to copy');
                  }
                }}
              >
                Copy caption
              </button>
              <button
                className="px-3 py-2 rounded bg-slate-100 hover:bg-slate-200 text-slate-800 text-sm"
                onClick={async () => {
                  try {
                    await navigator.clipboard.writeText(modalPost.hashtags || '');
                    toast.success('Hashtags copied');
                  } catch (e) {
                    toast.error('Failed to copy');
                  }
                }}
              >
                Copy hashtags
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Stories Viewer */}
      {viewingStories && viewingStories.length > 0 && (
        <div
          className="fixed inset-0 bg-black z-50 flex items-center justify-center"
          role="dialog"
          aria-modal="true"
          onClick={() => {
            setViewingStories(null);
            setCurrentStoryIndex(0);
          }}
        >
          <div className="w-full max-w-md h-full relative flex flex-col" onClick={(e) => e.stopPropagation()}>
            {/* Progress bars */}
            <div className="absolute top-4 left-4 right-4 flex gap-1 z-10">
              {Array.isArray(viewingStories) && viewingStories.map((_, idx) => (
                <div key={idx} className="flex-1 h-1 bg-white/30 rounded-full overflow-hidden">
                  {(idx === currentStoryIndex || idx < currentStoryIndex) && (
                    <div className="h-full bg-white w-full"></div>
                  )}
                </div>
              ))}
            </div>

            {/* Close button */}
            <button
              className="absolute top-4 right-4 text-white text-2xl z-10"
              onClick={() => {
                setViewingStories(null);
                setCurrentStoryIndex(0);
              }}
            >
              ×
            </button>

            {/* Story content */}
            <div className="flex-1 flex items-center justify-center p-8 text-white">
              <div className="text-center">
                <div className="text-sm mb-2 opacity-70">Story #{viewingStories[currentStoryIndex].index}</div>
                <div className="text-lg">{viewingStories[currentStoryIndex].description}</div>
              </div>
            </div>

            {/* Navigation */}
            <div className="absolute inset-0 flex">
              <div
                className="flex-1 cursor-pointer"
                onClick={() => {
                  if (currentStoryIndex > 0) {
                    setCurrentStoryIndex(currentStoryIndex - 1);
                  }
                }}
              ></div>
              <div
                className="flex-1 cursor-pointer"
                onClick={() => {
                  if (currentStoryIndex < viewingStories.length - 1) {
                    setCurrentStoryIndex(currentStoryIndex + 1);
                  } else {
                    setViewingStories(null);
                    setCurrentStoryIndex(0);
                  }
                }}
              ></div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// Skeleton version for loading state
export function InstagramMockSkeleton() {
  return (
    <div className="w-full max-w-md bg-white rounded-lg shadow-lg border overflow-hidden">
      <div className="bg-white px-4 py-2">
        <div className="h-4 w-24 bg-slate-200 rounded animate-pulse" />
      </div>
      <div className="bg-white p-3 mb-3">
        <div className="flex items-start gap-4 mb-3">
          <div className="w-20 h-20 rounded-full bg-slate-200 animate-pulse flex-shrink-0" />
          <div className="flex-1">
            <div className="h-4 w-40 bg-slate-200 rounded animate-pulse mb-2" />
            <div className="flex w-full pr-10 justify-between gap-4 text-sm">
              <div className='flex w-full flex-col'><span className="h-4 w-10 bg-slate-200 rounded animate-pulse" /> <span className="text-xs mt-1 h-3 w-10 bg-slate-100 rounded" /></div>
              <div className='flex w-full flex-col'><span className="h-4 w-16 bg-slate-200 rounded animate-pulse" /> <span className="text-xs mt-1 h-3 w-14 bg-slate-100 rounded" /></div>
              <div className='flex w-full flex-col'><span className="h-4 w-10 bg-slate-200 rounded animate-pulse" /> <span className="text-xs mt-1 h-3 w-12 bg-slate-100 rounded" /></div>
            </div>
          </div>
        </div>
        <div className="space-y-2 mb-3">
          <div className="h-3 w-5/6 bg-slate-200 rounded animate-pulse" />
          <div className="h-3 w-2/3 bg-slate-200 rounded animate-pulse" />
          <div className="h-3 w-1/2 bg-slate-200 rounded animate-pulse" />
        </div>
        <div className="flex gap-3 overflow-x-hidden pb-2">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="flex flex-col items-center flex-shrink-0">
              <div className="w-14 h-14 rounded-full bg-slate-200 animate-pulse mb-1" />
              <div className="h-2 w-10 bg-slate-100 rounded" />
            </div>
          ))}
        </div>
      </div>
      <div className="grid grid-cols-3 gap-1">
        {Array.from({ length: 9 }).map((_, i) => (
          <div key={i} className="aspect-[4/5] bg-slate-200 animate-pulse rounded" />
        ))}
      </div>
    </div>
  );
}
