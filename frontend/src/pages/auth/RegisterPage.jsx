import { Link, useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Mail, Lock, User } from 'lucide-react'
import toast from 'react-hot-toast'
import { Button } from '../../components/ui/Button'
import { Input } from '../../components/ui/Input'
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '../../components/ui/Card'
import { useAuth } from '../../hooks/useAuth'

const registerSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: 'Passwords do not match',
  path: ['confirmPassword'],
})

export function RegisterPage() {
  const navigate = useNavigate()
  const { register: registerUser, isLoading, registerMutation } = useAuth()

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      name: '',
      email: '',
      password: '',
      confirmPassword: '',
    },
  })

  const onSubmit = async (data) => {
    try {
      const { name, email, password } = data
      await registerUser({ name, email, password })
      toast.success('Account created successfully!')
      navigate('/dashboard')
    } catch (err) {
      const details = err.response?.data?.details
      if (details && details.length > 0) {
        toast.error(details.map(d => d.message).join(', '))
      } else {
        toast.error(err.response?.data?.message || 'Registration failed')
      }
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0a0f1e] px-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl">Create an account</CardTitle>
          <CardDescription>Start your InsightOS journey today</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">

            <Input
              label="Name"
              type="text"
              placeholder="John Doe"
              error={errors.name?.message}
              {...register('name')}
              disabled={isLoading}
              autoComplete="name"
            >
              <User className="w-5 h-5 text-gray-400" />
            </Input>

            <Input
              label="Email"
              type="email"
              placeholder="you@example.com"
              error={errors.email?.message}
              {...register('email')}
              disabled={isLoading}
              autoComplete="email"
            >
              <Mail className="w-5 h-5 text-gray-400" />
            </Input>

            <Input
              label="Password"
              type="password"
              placeholder="••••••••"
              error={errors.password?.message}
              {...register('password')}
              disabled={isLoading}
              autoComplete="new-password"
            >
              <Lock className="w-5 h-5 text-gray-400" />
            </Input>

            <Input
              label="Confirm Password"
              type="password"
              placeholder="••••••••"
              error={errors.confirmPassword?.message}
              {...register('confirmPassword')}
              disabled={isLoading}
              autoComplete="new-password"
            >
              <Lock className="w-5 h-5 text-gray-400" />
            </Input>

            <Button
              type="submit"
              className="w-full"
              size="lg"
              loading={isLoading || registerMutation.isPending}
            >
              Create account
            </Button>
          </form>
        </CardContent>
        <CardFooter className="flex justify-center">
          <p className="text-sm text-gray-400">
            Already have an account?{' '}
            <Link to="/login" className="text-primary hover:text-primary-dark font-medium">
              Sign in
            </Link>
          </p>
        </CardFooter>
      </Card>
    </div>
  )
}
