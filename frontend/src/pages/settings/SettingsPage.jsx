import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { ChevronRight, Trash2, AlertTriangle } from 'lucide-react'
import toast from 'react-hot-toast'
import { useTranslation } from '../../context/LanguageContext'
import { useMe, useUpdateProfile } from '../../hooks/useAuth'
import { useClearAllData, useDeleteAccount } from '../../hooks/useUser'
import { Button } from '../../components/ui/Button'
import { Input } from '../../components/ui/Input'

const fadeInUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] } },
}

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1 },
  },
}

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

export default function SettingsPage() {
  const { lang, switchLanguage, t } = useTranslation()
  const [emailNotifications, setEmailNotifications] = useState(true)
  const [pushNotifications, setPushNotifications] = useState(false)

  // Profile section state
  const { data: user } = useMe()
  const updateProfile = useUpdateProfile()

  const firstLetter = user?.name?.[0]?.toUpperCase() ?? '?'

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

  // Data Management state
  const [showClearConfirm, setShowClearConfirm] = useState(false)
  const clearData = useClearAllData()

  // Danger Zone state
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
  const [deleteInput, setDeleteInput] = useState('')
  const deleteAccount = useDeleteAccount()

  return (
    <motion.div
      variants={staggerContainer}
      initial="hidden"
      animate="visible"
      className="space-y-6"
    >
      {/* Page Title */}
      <motion.div variants={fadeInUp}>
        <h1 className="text-2xl font-bold text-white">{t('settings.title')}</h1>
        <p className="text-slate-400 mt-1">{t('settings.subtitle')}</p>
      </motion.div>

      {/* ==================== FEATURE 1: Profile Section ==================== */}
      <motion.div
        variants={fadeInUp}
        className="bg-slate-800 rounded-2xl p-6 shadow-sm border border-slate-700"
      >
        <h2 className="text-lg font-semibold text-white mb-6">Profile</h2>

        {/* Avatar + Name/Email */}
        <div className="flex items-center gap-4 mb-6 pb-6 border-b border-slate-700">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-violet-500 via-purple-500 to-fuchsia-500 flex items-center justify-center text-white text-2xl font-bold shadow-lg shadow-violet-500/20">
            {firstLetter}
          </div>
          <div>
            <p className="text-lg font-semibold text-white">{user?.name || '...'}</p>
            <p className="text-sm text-slate-400">{user?.email || '...'}</p>
            {user?.role && (
              <span className="inline-block mt-1 px-2 py-0.5 text-xs font-medium text-violet-400 bg-violet-500/10 rounded-full capitalize">
                {user.role}
              </span>
            )}
          </div>
        </div>

        {/* Name Change */}
        <div className="mb-6">
          <p className="text-sm font-medium text-white mb-1">Display Name</p>
          <p className="text-xs text-slate-400 mb-3">This is how your name will appear across the app</p>
          <form onSubmit={handleNameSubmit(onNameSubmit)} className="flex items-end gap-3">
            <div className="flex-1">
              <Input
                label=""
                placeholder="Your name"
                {...registerName('name')}
                error={nameErrors.name?.message}
              />
            </div>
            <Button
              type="submit"
              loading={updateProfile.isPending}
              disabled={isNameUnchanged || updateProfile.isPending}
            >
              Save
            </Button>
          </form>
        </div>

        {/* Divider */}
        <div className="border-t border-slate-700 pt-6">
          <p className="text-sm font-medium text-white mb-1">Change Password</p>
          <p className="text-xs text-slate-400 mb-3">
            Update your password. Your new password must be at least 8 characters with an uppercase letter, a number, and a special character.
          </p>

          <form onSubmit={handlePasswordSubmit(onPasswordSubmit)} className="space-y-4 max-w-md">
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
      </motion.div>

      {/* ==================== EXISTING: Appearance Section ==================== */}
      <motion.div
        variants={fadeInUp}
        className="bg-slate-800 rounded-2xl p-6 shadow-sm border border-slate-700"
      >
        <h2 className="text-lg font-semibold text-white mb-4">{t('settings.appearance')}</h2>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-white">{t('settings.darkMode')}</p>
              <p className="text-xs text-slate-400">{t('settings.darkModeDesc')}</p>
            </div>
          </div>

          <div className="border-t border-slate-700 pt-4">
            <p className="text-sm font-medium text-white mb-1">{t('settings.language')}</p>
            <p className="text-xs text-slate-400 mb-3">{t('settings.languageDesc')}</p>
            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={() => switchLanguage('en')}
                className={`p-4 rounded-xl border-2 transition-all duration-200 text-left ${
                  lang === 'en'
                    ? 'border-violet-500 bg-violet-500/10'
                    : 'border-slate-700 hover:border-slate-600'
                }`}
              >
                <span className="text-2xl block mb-2">🇬🇧</span>
                <p className="text-sm font-medium text-white">{t('settings.english')}</p>
                <p className="text-xs text-slate-400">{t('settings.englishDesc')}</p>
              </button>
              <button
                onClick={() => switchLanguage('bn')}
                className={`p-4 rounded-xl border-2 transition-all duration-200 text-left ${
                  lang === 'bn'
                    ? 'border-violet-500 bg-violet-500/10'
                    : 'border-slate-700 hover:border-slate-600'
                }`}
              >
                <span className="text-2xl block mb-2">🇧🇩</span>
                <p className="text-sm font-medium text-white">{t('settings.bengali')}</p>
                <p className="text-xs text-slate-400">{t('settings.bengaliDesc')}</p>
              </button>
            </div>
          </div>
        </div>
      </motion.div>

      {/* ==================== EXISTING: Notifications Section ==================== */}
      <motion.div
        variants={fadeInUp}
        className="bg-slate-800 rounded-2xl p-6 shadow-sm border border-slate-700"
      >
        <h2 className="text-lg font-semibold text-white mb-4">{t('settings.notifications')}</h2>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-white">{t('settings.emailNotifications')}</p>
              <p className="text-xs text-slate-400">{t('settings.emailNotificationsDesc')}</p>
            </div>
            <button
              onClick={() => setEmailNotifications(!emailNotifications)}
              className={`relative w-14 h-8 rounded-full transition-colors duration-300 ${
                emailNotifications ? 'bg-violet-500' : 'bg-slate-300'
              }`}
            >
              <motion.div
                className="absolute top-1 w-6 h-6 rounded-full bg-white shadow-md"
                animate={{ left: emailNotifications ? 30 : 4 }}
                transition={{ type: 'spring', stiffness: 500, damping: 30 }}
              />
            </button>
          </div>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-white">{t('settings.pushNotifications')}</p>
              <p className="text-xs text-slate-400">{t('settings.pushNotificationsDesc')}</p>
            </div>
            <button
              onClick={() => setPushNotifications(!pushNotifications)}
              className={`relative w-14 h-8 rounded-full transition-colors duration-300 ${
                pushNotifications ? 'bg-violet-500' : 'bg-slate-300'
              }`}
            >
              <motion.div
                className="absolute top-1 w-6 h-6 rounded-full bg-white shadow-md"
                animate={{ left: pushNotifications ? 30 : 4 }}
                transition={{ type: 'spring', stiffness: 500, damping: 30 }}
              />
            </button>
          </div>
        </div>
      </motion.div>

      {/* ==================== FEATURE 2: Data Management Section ==================== */}
      <motion.div
        variants={fadeInUp}
        className="bg-slate-800 rounded-2xl p-6 shadow-sm border border-slate-700"
      >
        <h2 className="text-lg font-semibold text-white mb-4">{t('settings.dataManagement')}</h2>
        <div className="space-y-3">
          {/* Export Data — UI only */}
          <button
            className="w-full flex items-center justify-between p-4 rounded-xl bg-slate-700/50 hover:bg-slate-700 transition-colors cursor-pointer"
          >
            <div className="text-left">
              <p className="text-sm font-medium text-white">{t('settings.exportData')}</p>
              <p className="text-xs text-slate-400">{t('settings.exportDataDesc')}</p>
            </div>
            <ChevronRight className="w-5 h-5 text-slate-400" />
          </button>

          {/* Clear All Data — two-step confirm */}
          <div className="rounded-xl bg-red-500/10 border border-red-500/20 overflow-hidden">
            {!showClearConfirm ? (
              <button
                onClick={() => setShowClearConfirm(true)}
                className="w-full flex items-center justify-between p-4 hover:bg-red-500/10 transition-colors"
              >
                <div className="text-left">
                  <p className="text-sm font-medium text-red-400">{t('settings.clearData')}</p>
                  <p className="text-xs text-red-400/70">{t('settings.clearDataDesc')}</p>
                </div>
                <Trash2 className="w-5 h-5 text-red-400" />
              </button>
            ) : (
              <div className="p-4 space-y-3">
                <div className="flex items-start gap-3">
                  <AlertTriangle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-red-300">Are you absolutely sure?</p>
                    <p className="text-xs text-red-300/70 mt-1">
                      This will permanently delete all your products, sales, and expense records. This action cannot be undone.
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3 justify-end">
                  <Button
                    variant="outline"
                    onClick={() => {
                      setShowClearConfirm(false)
                      clearData.reset()
                    }}
                    disabled={clearData.isPending}
                  >
                    Cancel
                  </Button>
                  <Button
                    variant="danger"
                    onClick={() => {
                      clearData.mutate(undefined, {
                        onSuccess: () => {
                          toast.success('All business data has been cleared')
                          setShowClearConfirm(false)
                        },
                        onError: (err) => {
                          toast.error(err.response?.data?.message || 'Failed to clear data')
                        },
                      })
                    }}
                    loading={clearData.isPending}
                  >
                    Yes, Clear All
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>
      </motion.div>

      {/* ==================== FEATURE 3: Danger Zone Section ==================== */}
      <motion.div
        variants={fadeInUp}
        className="bg-slate-800 rounded-2xl p-6 shadow-sm border border-red-500/20"
      >
        <h2 className="text-lg font-semibold text-red-400 mb-4">{t('settings.dangerZone')}</h2>

        {!showDeleteConfirm ? (
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-white">{t('settings.deleteAccount')}</p>
              <p className="text-xs text-slate-400">{t('settings.deleteAccountDesc')}</p>
            </div>
            <Button
              variant="danger"
              onClick={() => setShowDeleteConfirm(true)}
            >
              {t('settings.deleteAccount')}
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="flex items-start gap-3 p-4 rounded-xl bg-red-500/10 border border-red-500/20">
              <AlertTriangle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-semibold text-red-300">This action is irreversible</p>
                <p className="text-xs text-red-300/70 mt-1">
                  All your data including products, sales, expenses, and AI conversations will be permanently deleted.
                  Your account cannot be recovered.
                </p>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1">
                Type <span className="font-mono text-red-400 font-bold">DELETE</span> to confirm
              </label>
              <input
                type="text"
                value={deleteInput}
                onChange={(e) => setDeleteInput(e.target.value)}
                placeholder="Type DELETE here"
                className="w-full px-3 py-2 border border-red-500/40 rounded-lg shadow-sm placeholder-slate-500 bg-slate-800/60 text-slate-100 focus:outline-none focus:ring-2 focus:ring-red-500/50 focus:border-transparent"
              />
            </div>

            <div className="flex items-center gap-3 justify-end">
              <Button
                variant="outline"
                onClick={() => {
                  setShowDeleteConfirm(false)
                  setDeleteInput('')
                  deleteAccount.reset()
                }}
                disabled={deleteAccount.isPending}
              >
                Cancel
              </Button>
              <Button
                variant="danger"
                disabled={deleteInput !== 'DELETE' || deleteAccount.isPending}
                onClick={() => deleteAccount.mutate()}
                loading={deleteAccount.isPending}
              >
                Permanently Delete
              </Button>
            </div>

            {deleteAccount.isError && (
              <p className="text-sm text-red-400">{deleteAccount.error?.response?.data?.message || 'Failed to delete account'}</p>
            )}
          </div>
        )}
      </motion.div>
    </motion.div>
  )
}
