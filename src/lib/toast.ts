import toast from 'react-hot-toast'

export const showSuccessToast = (message: string) => {
  toast.success(message, {
    duration: 5000,
    position: 'top-right',
  })
}

export const showErrorToast = (message: string) => {
  toast.error(message, {
    duration: 5000,
    position: 'top-right',
  })
}
