import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { getHistory } from '../services/aiService'
import type { Profile, Highlight, Post } from '../services/aiService'

interface HistoryItem {
  _id: string;
  prompt: string;
  style: string;
  profile: Profile;
  highlights: Highlight[];
  posts: Post[];
  createdAt: string;
}

export default function HistoryList() {
  const [items, setItems] = useState<HistoryItem[]>([])
  const navigate = useNavigate()

  useEffect(() => {
    async function load() {
      try {
        const data = await getHistory()
        console.log('History data:', data); // Debug log
        setItems(Array.isArray(data) ? data : [])
      } catch (err) {
        console.error(err)
        setItems([])
      }
    }
    load()
  }, [])

  if (!items.length) return <div className="bg-white p-4 rounded shadow">No history yet</div>

  return (
    <div className="space-y-3">
      {Array.isArray(items) && items.map((it) => (
        <button
          key={it._id}
          className="bg-white p-4 rounded shadow text-left w-full hover:bg-slate-50"
          onClick={() => navigate(`/history/${it._id}`)}
        >
          <div className="text-sm text-slate-500">{new Date(it.createdAt).toLocaleString()}</div>
          <div className="mt-1 font-medium">Prompt: {it.prompt}</div>
          <div className="mt-1 text-sm text-slate-600">Style: {it.style}</div>
          {it.profile && (
            <div className="mt-2 border-t pt-2">
              <div className="font-semibold">@{it.profile.username} - {it.profile.name}</div>
              <div className="text-xs text-slate-700 whitespace-pre-line mt-1 line-clamp-2">{it.profile.bio}</div>
              <div className="text-xs text-slate-500 mt-1">
                {it.posts?.length || 0} posts • {it.highlights?.length || 0} highlights
              </div>
            </div>
          )}
        </button>
      ))}
    </div>
  )
}
