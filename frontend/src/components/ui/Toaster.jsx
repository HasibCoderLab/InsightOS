import { Toaster as HotToaster } from 'react-hot-toast'

export function Toaster() {
  return (
    <HotToaster
      position="top-right"
      gutter={12}
      containerClassName="!z-[9999]"
      toastOptions={{
        duration: 3000,
        style: {
          background: '#1e293b',
          color: '#f1f5f9',
          border: '1px solid #334155',
          borderRadius: '12px',
          padding: '12px 16px',
          fontSize: '14px',
          boxShadow: '0 8px 32px rgba(0,0,0,0.4)',
        },
        success: {
          iconTheme: {
            primary: '#34d399',
            secondary: '#1e293b',
          },
        },
        error: {
          iconTheme: {
            primary: '#f87171',
            secondary: '#1e293b',
          },
          duration: 4000,
        },
      }}
    />
  )
}
