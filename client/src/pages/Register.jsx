import React, { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import toast from 'react-hot-toast'
import api from '../lib/api'

const registerSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters').optional().or(z.literal('')),
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters')
})

export default function Register() {
  const [loading, setLoading] = useState(false)
  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: zodResolver(registerSchema)
  })

  async function onSubmit(data) {
    setLoading(true)
    try {
      const res = await api.post('/auth/register', data);
      localStorage.setItem('token', res.data.token)
      localStorage.setItem('user', JSON.stringify(res.data.user))
      toast.success('Registered successfully!')
      setTimeout(() => window.location.href = '/', 500)
    } catch (err) {
      console.error(err)
      toast.error(err.response?.data?.error || 'Registration failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="bg-white p-6 rounded shadow max-w-md mx-auto">
      <h2 className="text-xl font-semibold mb-4">Register</h2>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="mb-3">
          <label className="block mb-1 font-medium">Name (optional)</label>
          <input 
            {...register('name')}
            className={`w-full p-2 border rounded ${errors.name ? 'border-red-500' : 'border-slate-300'}`}
          />
          {errors.name && (
            <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>
          )}
        </div>

        <div className="mb-3">
          <label className="block mb-1 font-medium">Email</label>
          <input 
            {...register('email')}
            type="email"
            className={`w-full p-2 border rounded ${errors.email ? 'border-red-500' : 'border-slate-300'}`}
          />
          {errors.email && (
            <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>
          )}
        </div>

        <div className="mb-4">
          <label className="block mb-1 font-medium">Password</label>
          <input 
            {...register('password')}
            type="password"
            className={`w-full p-2 border rounded ${errors.password ? 'border-red-500' : 'border-slate-300'}`}
          />
          {errors.password && (
            <p className="text-red-500 text-sm mt-1">{errors.password.message}</p>
          )}
        </div>

        <button 
          type="submit"
          className="w-full bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition disabled:opacity-50" 
          disabled={loading}
        >
          {loading ? 'Registering...' : 'Register'}
        </button>
      </form>
    </div>
  )
}
