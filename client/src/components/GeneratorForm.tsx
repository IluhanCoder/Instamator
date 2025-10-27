import React, { useState } from 'react';
import toast from 'react-hot-toast';
import InstagramMock, { InstagramMockSkeleton } from './InstagramMock';
import { generate, saveHistory } from '../services/aiService';
import type { StyleType, Profile, Highlight, Post } from '../services/aiService';

export default function GeneratorForm() {
  const [prompt, setPrompt] = useState('');
  const [style, setStyle] = useState<StyleType>('friendly');
  const [posts, setPosts] = useState<Post[] | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [highlights, setHighlights] = useState<Highlight[]>([]);
  const [loading, setLoading] = useState(false);
  const isAuth = !!localStorage.getItem('token');

  async function handleGenerate(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!prompt.trim()) {
      toast.error('Please enter content description');
      return;
    }
    setLoading(true);
    setPosts(null);
    setProfile(null);
    setHighlights([]);
    try {
      const data = await generate({ prompt, style });
      console.log('API response:', data); // Debug log
      if (data && data.profile && data.posts && Array.isArray(data.posts)) {
        setPosts(data.posts);
        setProfile(data.profile);
        setHighlights(Array.isArray(data.highlights) ? data.highlights : []);
        toast.success('Content plan generated!');
      } else {
        console.error('Invalid response structure:', data);
        toast.error('Unexpected response from server');
      }
    } catch (err: any) {
      console.error(err);
      toast.error(err.response?.data?.error || 'Failed to generate content');
    } finally {
      setLoading(false);
    }
  }

  async function handleSave() {
    const isAuth = !!localStorage.getItem('token');
    if (!isAuth) {
      toast.error('Please login to save history');
      setTimeout(() => (window.location.href = '/login'), 1000);
      return;
    }
    if (!posts || !profile) {
      toast.error('No content to save');
      return;
    }
    try {
      await saveHistory({ prompt, style, profile, highlights, posts });
      toast.success('Saved to history!');
    } catch (err: any) {
      console.error(err);
      toast.error(err.response?.data?.error || 'Failed to save');
    }
  }

  return (
    <div className="">
      <form className='bg-white p-6 rounded shadow' onSubmit={handleGenerate}>
        <label className="block mb-2 font-medium">What is the content about?</label>
        <textarea
          className="w-full border rounded p-2 mb-3"
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          rows={4}
        />

        <label className="block mb-2 font-medium">Style</label>
        <select
          value={style}
          onChange={(e) => setStyle(e.target.value as StyleType)}
          className="mb-3 p-2 border rounded w-full"
        >
          <option value="friendly">friendly</option>
          <option value="professional">professional</option>
          <option value="humorous">humorous</option>
        </select>

        <div className="flex gap-2">
          <button className="bg-blue-600 text-white px-4 py-2 rounded" type="submit" disabled={loading}>
            {loading ? 'Generating...' : 'Generate'}
          </button>
        </div>
      </form>

      <div className="mt-4 flex justify-center">
        {!posts && (
          loading ? (
            <InstagramMockSkeleton />
          ) : (
            <div className="w-full justify-center">
              <div className="text-center text-xl whitespace-pre-wrap bg-slate-50 p-4 min-h-[80px]">No result yet</div>
            </div>
          )
        )}
        {posts && profile && (
          <InstagramMock
            profile={profile}
            highlights={highlights}
            posts={posts}
            onSave={handleSave}
            isAuth={isAuth}
            loading={false}
          />
        )}
      </div>
    </div>
  );
}
