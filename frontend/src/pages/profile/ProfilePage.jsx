import { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { motion } from 'framer-motion'
import { Mail, Shield, Calendar, Camera, LogOut, Loader2, AlertTriangle } from 'lucide-react'
import toast from 'react-hot-toast'
import { useAuth, useMe, useUpdateProfile, useUploadAvatar, useDeleteAvatar } from '../../hooks/useAuth'
import { Button } from '../../components/ui/Button'
import { Input } from '../../components/ui/Input'
import { Modal } from '../../components/ui/Modal'
import { slideUp } from '../../lib/motion'
import { API_URL } from '../../utils/config'

const nameSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters').max(50, 'Name must be at most 50 characters'),
})

const passwordSchema = z
  .object({
    currentPassword: z.string().min(1, 'Current password is required'),
    newPassword: z
      .string()
      .min(8, 'Password must be at least 8 characters')
      .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
      .regex(/[0-9]/, 'Password must contain at least one number')
      .regex(/[^A-Za-z0-9]/, 'Password must contain at least one special character'),
    confirmPassword: z.string(),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  })

export default function ProfilePage() {
  const navigate = useNavigate()
  const { logout } = useAuth()
  const { data: user, isLoading } = useMe()
  const updateProfile = useUpdateProfile()
  const uploadAvatar = useUploadAvatar()
  const deleteAvatar = useDeleteAvatar()
  const fileInputRef = useRef(null)
  const [avatarPreview, setAvatarPreview] = useState(null)
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)

  const avatarSrc = avatarPreview || (user?.avatar ? `${API_URL}${user.avatar}` : null)

  const handleAvatarClick = () => {
    fileInputRef.current?.click()
  }

  const handleFileSelect = async (e) => {
    const file = e.target.files?.[0]
    if (!file) return

    // Preview locally
    const reader = new FileReader()
    reader.onload = (ev) => setAvatarPreview(ev.target.result)
    reader.readAsDataURL(file)

    // Upload
    const formData = new FormData()
    formData.append('avatar', file)
    try {
      await uploadAvatar.mutateAsync(formData)
      setAvatarPreview(null)
      toast.success('Avatar updated successfully')
    } catch (err) {
      setAvatarPreview(null)
      toast.error(err.response?.data?.message || 'Failed to upload avatar')
    }
    // Reset input so same file can be picked again
    e.target.value = ''
  }

  // Name form
  const {
    register: registerName,
    handleSubmit: handleNameSubmit,
    formState: { errors: nameErrors },
    reset: resetName,
    watch: watchName,
  } = useForm({
    resolver: zodResolver(nameSchema),
    defaultValues: { name: '' },
  })
  const currentNameValue = watchName('name')
  const isNameUnchanged = currentNameValue === user?.name

  useEffect(() => {
    if (user?.name) {
      resetName({ name: user.name })
    }
  }, [user, resetName])

  const onNameSubmit = async (data) => {
    try {
      await updateProfile.mutateAsync(data)
      toast.success('Name updated successfully')
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to update name')
    }
  }

  // Password form
  const {
    register: registerPassword,
    handleSubmit: handlePasswordSubmit,
    formState: { errors: passwordErrors },
    reset: resetPassword,
  } = useForm({
    resolver: zodResolver(passwordSchema),
    defaultValues: {
      currentPassword: '',
      newPassword: '',
      confirmPassword: '',
    },
  })

  const onPasswordSubmit = async (data) => {
    try {
      await updateProfile.mutateAsync({
        currentPassword: data.currentPassword,
        newPassword: data.newPassword,
      })
      toast.success('Password updated successfully')
      resetPassword()
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to update password')
    }
  }

  const handleLogout = async () => {
    try {
      await logout()
      navigate('/login')
    } catch {
      navigate('/login')
    }
  }

  if (isLoading) {
    return (
      <div className="p-6 max-w-2xl mx-auto space-y-6">
        <div className="animate-pulse space-y-6">
          <div className="h-8 bg-gray-800 rounded w-32" />
          <div className="bg-gray-900 rounded-2xl border border-gray-800 overflow-hidden">
            <div className="h-24 bg-gray-800" />
            <div className="px-6 pb-6">
              <div className="flex items-end gap-4 -mt-10 mb-4">
                <div className="w-20 h-20 rounded-2xl bg-gray-800" />
                <div className="space-y-2 pb-1">
                  <div className="h-5 bg-gray-800 rounded w-32" />
                  <div className="h-4 bg-gray-800 rounded w-16" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="p-6 max-w-2xl mx-auto space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1 className="text-2xl font-bold text-white">Profile</h1>
        <p className="text-sm text-gray-400 mt-0.5">
          Manage your account
        </p>
      </motion.div>

      {/* Profile Card */}
      <motion.div
        variants={slideUp}
        initial="hidden"
        animate="visible"
        className="bg-gray-900 rounded-2xl border border-gray-800 overflow-hidden"
      >
        {/* Banner gradient */}
        <div className="h-24 bg-gradient-to-r from-violet-500 via-purple-500 to-pink-500" />

        {/* Avatar + Info */}
        <div className="px-6 pb-6">
          <div className="flex items-end gap-4 -mt-10 mb-4">
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="relative w-20 h-20 rounded-2xl bg-gradient-to-br from-violet-400 to-purple-600 border-4 border-gray-900 flex items-center justify-center text-white text-3xl font-bold shadow-xl overflow-hidden cursor-pointer group"
              onClick={handleAvatarClick}
            >
              {avatarSrc ? (
                <img
                  src={avatarSrc}
                  alt={user?.name ?? 'Avatar'}
                  className="w-full h-full object-cover"
                />
              ) : (
                user?.name?.[0]?.toUpperCase() ?? 'U'
              )}
              {/* Upload overlay */}
              <div className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                {uploadAvatar.isPending || deleteAvatar.isPending ? (
                  <Loader2 size={16} className="text-white animate-spin" />
                ) : (
                  <Camera size={14} className="text-white" />
                )}
              </div>
            </motion.div>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/jpeg,image/png,image/gif,image/webp"
              className="hidden"
              onChange={handleFileSelect}
            />
            {avatarSrc && !avatarPreview && (
              <button
                onClick={() => setShowDeleteConfirm(true)}
                disabled={deleteAvatar.isPending}
                className="mt-1 text-xs font-medium text-red-400 hover:text-red-300 transition-colors disabled:opacity-50"
              >
                {deleteAvatar.isPending ? 'Removing...' : 'Remove photo'}
              </button>
            )}

            <div className="pb-1">
              <h2 className="text-xl font-bold text-white">
                {user?.name ?? 'User'}
              </h2>
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-violet-500/10 text-violet-400 capitalize">
                <Shield size={10} />
                {user?.role ?? 'user'}
              </span>
            </div>
          </div>

          {/* Info rows */}
          <div className="space-y-3 mb-6">
            <div className="flex items-center gap-3 p-3 rounded-xl bg-gray-800/60">
              <Mail size={16} className="text-gray-400" />
              <div>
                <p className="text-xs text-gray-400">Email</p>
                <p className="text-sm font-medium text-white">
                  {user?.email ?? 'user@example.com'}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3 p-3 rounded-xl bg-gray-800/60">
              <Calendar size={16} className="text-gray-400" />
              <div>
                <p className="text-xs text-gray-400">Member since</p>
                <p className="text-sm font-medium text-white">
                  {user?.createdAt
                    ? new Date(user.createdAt).toLocaleDateString('en-US', {
                        year: 'numeric', month: 'long', day: 'numeric'
                      })
                    : '—'}
                </p>
              </div>
            </div>
          </div>

          {/* ---- Name Change ---- */}
          <div className="border-t border-gray-800 pt-6 mb-6">
            <p className="text-sm font-medium text-white mb-1">Display Name</p>
            <p className="text-xs text-gray-400 mb-3">
              This is how your name will appear across the app
            </p>
            <form onSubmit={handleNameSubmit(onNameSubmit)} className="flex items-end gap-3">
              <div className="flex-1">
                <Input
                  label=""
                  placeholder="Your name"
                  {...registerName('name')}
                  error={nameErrors.name?.message}
                />
              </div>            <Button
              type="submit"
              loading={updateProfile.isPending}
              disabled={isNameUnchanged || updateProfile.isPending}
            >
              Save
            </Button>
          </form>
          </div>

          {/* ---- Change Password ---- */}
          <div className="border-t border-gray-800 pt-6">
            <p className="text-sm font-medium text-white mb-1">Change Password</p>
            <p className="text-xs text-gray-400 mb-3">
              Update your password. It must be at least 8 characters with an uppercase letter, a number, and a special character.
            </p>

            <form onSubmit={handlePasswordSubmit(onPasswordSubmit)} className="space-y-4">
              <Input
                label="Current Password"
                type="password"
                placeholder="Enter current password"
                {...registerPassword('currentPassword')}
                error={passwordErrors.currentPassword?.message}
              />
              <Input
                label="New Password"
                type="password"
                placeholder="Enter new password"
                {...registerPassword('newPassword')}
                error={passwordErrors.newPassword?.message}
              />
              <Input
                label="Confirm New Password"
                type="password"
                placeholder="Confirm new password"
                {...registerPassword('confirmPassword')}
                error={passwordErrors.confirmPassword?.message}
              />

              <Button
                type="submit"
                loading={updateProfile.isPending}
                disabled={updateProfile.isPending}
              >
                Update Password
              </Button>
            </form>
          </div>
        </div>
      </motion.div>

      {/* Confirm Delete Avatar Modal */}
      <Modal
        isOpen={showDeleteConfirm}
        onClose={() => setShowDeleteConfirm(false)}
        title="Remove profile photo"
        size="sm"
      >
        <div className="space-y-4">
          <div className="flex items-start gap-3">
            <div className="flex-shrink-0 w-10 h-10 rounded-full bg-red-500/10 flex items-center justify-center">
              <AlertTriangle size={20} className="text-red-400" />
            </div>
            <div>
              <p className="text-sm text-gray-300">
                Are you sure you want to remove your profile photo? Your avatar will revert to your initials.
              </p>
            </div>
          </div>
          <div className="flex justify-end gap-3 pt-2">
            <Button
              variant="ghost"
              onClick={() => setShowDeleteConfirm(false)}
            >
              Cancel
            </Button>
            <Button
              variant="danger"
              loading={deleteAvatar.isPending}
              onClick={() => {
                deleteAvatar.mutate(undefined, {
                  onSuccess: () => {
                    toast.success('Photo removed')
                    setShowDeleteConfirm(false)
                  },
                  onError: (err) => {
                    toast.error(err.response?.data?.message || 'Failed to remove photo')
                  },
                })
              }}
            >
              Remove
            </Button>
          </div>
        </div>
      </Modal>

      {/* Danger Zone */}
      <motion.div
        variants={slideUp}
        initial="hidden"
        animate="visible"
        transition={{ delay: 0.2 }}
        className="bg-gray-900 rounded-2xl border border-red-900/40 p-6"
      >
        <h3 className="text-sm font-semibold text-red-400 mb-3">
          Danger Zone
        </h3>
        <motion.button
          whileHover={{ scale: 1.01 }}
          whileTap={{ scale: 0.98 }}
          onClick={handleLogout}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm font-medium hover:bg-red-500/20 transition-colors"
        >
          <LogOut size={15} />
          Sign out of account
        </motion.button>
      </motion.div>
    </div>
  )
}
