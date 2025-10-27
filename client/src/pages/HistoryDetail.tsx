import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { getHistoryItem } from '../services/aiService';
import type { Profile, Highlight, Post } from '../services/aiService';
import InstagramMock, { InstagramMockSkeleton } from '../components/InstagramMock';

interface HistoryItem {
  _id: string;
  prompt: string;
  style: string;
  profile: Profile;
  highlights: Highlight[];
  posts: Post[];
  createdAt: string;
}

export default function HistoryDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [item, setItem] = useState<HistoryItem | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function load() {
      if (!id) {
        setError('No ID provided');
        setLoading(false);
        return;
      }
      try {
        const data = await getHistoryItem(id);
        setItem(data);
      } catch (err: any) {
        console.error(err);
        setError(err.response?.data?.error || 'Failed to load history item');
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [id]);

  async function handleCopyLink() {
    try {
      await navigator.clipboard.writeText(window.location.href);
      toast.success('Link copied! Share it with anyone.');
    } catch (e) {
      toast.error('Failed to copy link');
    }
  }

  if (loading) {
    return (
      <div className="flex flex-col items-center">
        <InstagramMockSkeleton />
        <div className="mt-4 text-slate-500">Loading...</div>
      </div>
    );
  }

  if (error || !item) {
    return (
      <div className="bg-white p-6 rounded shadow">
        <div className="text-red-600 mb-3">{error || 'Not found'}</div>
        <button
          className="text-blue-600 underline"
          onClick={() => navigate('/history')}
        >
          ← Back to History
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center">
      <div className="w-full max-w-md mb-4 bg-white p-4 rounded shadow">
        <div className="flex items-center justify-between mb-2">
          <button
            className="text-blue-600 underline text-sm"
            onClick={() => navigate('/history')}
          >
            ← Back to History
          </button>
          <button
            className="text-green-600 underline text-sm flex items-center gap-1"
            onClick={handleCopyLink}
          >
            📋 Copy share link
          </button>
        </div>
        <div className="text-xs text-slate-500">
          Created: {new Date(item.createdAt).toLocaleString()}
        </div>
        <div className="mt-2 text-sm">
          <span className="font-medium">Prompt:</span> {item.prompt}
        </div>
        <div className="text-sm text-slate-600">
          <span className="font-medium">Style:</span> {item.style}
        </div>
      </div>

      <InstagramMock
        profile={item.profile}
        highlights={item.highlights || []}
        posts={item.posts || []}
      />
    </div>
  );
}
