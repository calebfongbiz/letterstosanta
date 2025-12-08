'use client'

import { useState } from 'react'

interface Review {
  id: string
  name: string
  comment: string
  photoUrl: string | null
  approved: boolean
  createdAt: string
}

interface Child {
  id: string
  name: string
  age: number
  trackerId: string
  currentMilestone: string
  letter: {
    letterText: string
    wishlist: string | null
  } | null
}

interface Customer {
  id: string
  firstName: string
  lastName: string
  email: string
  tier: string
  createdAt: string
  children: Child[]
}

export default function AdminPage() {
  const [password, setPassword] = useState('')
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [activeTab, setActiveTab] = useState<'orders' | 'reviews'>('orders')
  const [reviews, setReviews] = useState<Review[]>([])
  const [customers, setCustomers] = useState<Customer[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const authHeader = { 'Authorization': `Bearer ${password}` }

  const fetchData = async () => {
    setLoading(true)
    setError('')
    try {
      const [reviewsRes, ordersRes] = await Promise.all([
        fetch('/api/admin/reviews', { headers: authHeader }),
        fetch('/api/admin/orders', { headers: authHeader }),
      ])
      if (!reviewsRes.ok || !ordersRes.ok) throw new Error('Failed')
      setReviews(await reviewsRes.json())
      setCustomers(await ordersRes.json())
      setIsAuthenticated(true)
    } catch {
      setError('Invalid password or failed to load')
      setIsAuthenticated(false)
    } finally {
      setLoading(false)
    }
  }

  const toggleApproval = async (id: string, current: boolean) => {
    await fetch('/api/admin/reviews', {
      method: 'PATCH',
      headers: { ...authHeader, 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, approved: !current }),
    })
    fetchData()
  }

  const deleteReview = async (id: string) => {
    if (!confirm('Delete this review?')) return
    await fetch(`/api/admin/reviews?id=${id}`, { method: 'DELETE', headers: authHeader })
    fetchData()
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
        <form onSubmit={(e) => { e.preventDefault(); fetchData() }} className="bg-white p-8 rounded-2xl shadow-lg max-w-md w-full">
          <h1 className="text-2xl font-bold mb-6 text-center">🎅 Admin Login</h1>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter admin password"
            className="w-full px-4 py-3 border border-gray-300 rounded-xl mb-4 text-gray-900"
          />
          {error && <p className="text-red-600 text-sm mb-4">{error}</p>}
          <button type="submit" disabled={loading} className="w-full py-3 bg-santa-red text-white font-semibold rounded-xl">
            {loading ? 'Loading...' : 'Login'}
          </button>
        </form>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-100 p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">🎅 Admin Dashboard</h1>
          <button onClick={() => setIsAuthenticated(false)} className="text-gray-600 hover:text-gray-900">Logout</button>
        </div>

        <div className="flex gap-4 mb-6">
          <button onClick={() => setActiveTab('orders')} className={`px-6 py-3 rounded-xl font-semibold ${activeTab === 'orders' ? 'bg-santa-red text-white' : 'bg-white text-gray-700'}`}>
            Orders ({customers.length})
          </button>
          <button onClick={() => setActiveTab('reviews')} className={`px-6 py-3 rounded-xl font-semibold ${activeTab === 'reviews' ? 'bg-santa-red text-white' : 'bg-white text-gray-700'}`}>
            Reviews ({reviews.length})
          </button>
        </div>

        {activeTab === 'orders' && (
          <div className="space-y-4">
            {customers.length === 0 ? <p className="text-gray-500 text-center py-12">No orders yet</p> : customers.map((c) => (
              <div key={c.id} className="bg-white rounded-2xl p-6 shadow-sm">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="font-bold text-lg">{c.firstName} {c.lastName}</h3>
                    <p className="text-gray-600">{c.email}</p>
                  </div>
                  <div className="text-right">
                    <span className={`px-3 py-1 rounded-full text-sm font-semibold ${c.tier === 'MAGIC' ? 'bg-purple-100 text-purple-800' : 'bg-gray-100 text-gray-800'}`}>{c.tier}</span>
                    <p className="text-gray-500 text-sm mt-1">{new Date(c.createdAt).toLocaleDateString()}</p>
                  </div>
                </div>
                {c.children.map((child) => (
                  <div key={child.id} className="border-t pt-4 mt-4">
                    <div className="flex justify-between items-center mb-2">
                      <span className="font-semibold">{child.name}, age {child.age}</span>
                      <span className="text-sm text-gray-500">Tracker: {child.trackerId}</span>
                    </div>
                    <p className="text-sm text-gray-600 mb-1"><strong>Milestone:</strong> {child.currentMilestone.replace(/_/g, ' ')}</p>
                    {child.letter && (
                      <>
                        <p className="text-sm text-gray-700 bg-gray-50 p-3 rounded-lg mt-2">{child.letter.letterText}</p>
                        {child.letter.wishlist && <p className="text-sm text-gray-600 mt-2"><strong>Wishlist:</strong> {child.letter.wishlist}</p>}
                      </>
                    )}
                  </div>
                ))}
              </div>
            ))}
          </div>
        )}

        {activeTab === 'reviews' && (
          <div className="space-y-4">
            {reviews.length === 0 ? <p className="text-gray-500 text-center py-12">No reviews yet</p> : reviews.map((r) => (
              <div key={r.id} className="bg-white rounded-2xl p-6 shadow-sm">
                <div className="flex gap-4">
                  {r.photoUrl && <img src={r.photoUrl} alt="" className="w-24 h-24 object-cover rounded-xl" />}
                  <div className="flex-grow">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-bold">{r.name}</h3>
                        <p className="text-gray-500 text-sm">{new Date(r.createdAt).toLocaleDateString()}</p>
                      </div>
                      <span className={`px-3 py-1 rounded-full text-sm font-semibold ${r.approved ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                        {r.approved ? 'Approved' : 'Pending'}
                      </span>
                    </div>
                    <p className="text-gray-700 mt-2">{r.comment}</p>
                    <div className="flex gap-2 mt-4">
                      <button onClick={() => toggleApproval(r.id, r.approved)} className={`px-4 py-2 rounded-lg text-sm font-semibold ${r.approved ? 'bg-yellow-100 text-yellow-800' : 'bg-green-100 text-green-800'}`}>
                        {r.approved ? 'Unapprove' : 'Approve'}
                      </button>
                      <button onClick={() => deleteReview(r.id)} className="px-4 py-2 rounded-lg text-sm font-semibold bg-red-100 text-red-800">Delete</button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
