import { useQuery } from '@tanstack/react-query'
import api from '../lib/api'

interface TimelineStep {
  id: number
  step_name: string
  step_type: string
  status: string
  duration_hours?: number
  sequence_order?: number
}

interface TimelineData {
  order_id: number
  order_number: string
  customer_name: string
  product_description: string
  steps: TimelineStep[]
  total_steps: number
}

interface OrderTimelineProps {
  orderId: number
}

const statusColors: Record<string, string> = {
  pending: 'bg-gray-200 border-gray-400',
  in_progress: 'bg-blue-500 border-blue-600',
  completed: 'bg-green-500 border-green-600',
  failed: 'bg-red-500 border-red-600',
}

export default function OrderTimeline({ orderId }: OrderTimelineProps) {
  const { data, isLoading, error } = useQuery<TimelineData>({
    queryKey: ['order-timeline', orderId],
    queryFn: async () => {
      const response = await api.get(`/orders/${orderId}/timeline`)
      return response.data
    }
  })

  if (isLoading) {
    return (
      <div className="text-center py-4">
        <div className="inline-block animate-spin rounded-full h-6 w-6 border-b-2 border-indigo-600"></div>
        <p className="mt-2 text-sm text-gray-500">Loading timeline...</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-md p-3">
        <p className="text-sm text-red-800">Error loading timeline</p>
      </div>
    )
  }

  if (!data || data.steps.length === 0) {
    return (
      <div className="text-center py-4">
        <p className="text-sm text-gray-500">No manufacturing steps yet</p>
      </div>
    )
  }

  return (
    <div className="py-4">
      {/* Order Info */}
      <div className="mb-4 pb-3 border-b border-gray-200">
        <h4 className="text-sm font-medium text-gray-900">{data.order_number}</h4>
        <p className="text-xs text-gray-600">{data.customer_name} - {data.product_description}</p>
      </div>

      {/* Timeline */}
      <div className="relative">
        {/* Vertical line */}
        <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-gray-200"></div>

        {/* Steps */}
        <div className="space-y-4">
          {data.steps.map((step) => (
            <div key={step.id} className="relative flex items-start">
              {/* Step indicator */}
              <div className={`flex-shrink-0 w-8 h-8 rounded-full border-2 ${statusColors[step.status]} flex items-center justify-center relative z-10`}>
                {step.status === 'completed' && (
                  <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                )}
                {step.status === 'in_progress' && (
                  <div className="w-3 h-3 bg-white rounded-full"></div>
                )}
                {step.status === 'failed' && (
                  <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                )}
              </div>

              {/* Step content */}
              <div className="ml-4 flex-1">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-900">{step.step_name}</p>
                    <p className="text-xs text-gray-500 capitalize">{step.status.replace('_', ' ')}</p>
                  </div>
                  {step.duration_hours !== null && step.duration_hours !== undefined && (
                    <span className="text-xs text-gray-500">{step.duration_hours}h</span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Progress summary */}
      <div className="mt-6 pt-4 border-t border-gray-200">
        <div className="flex items-center justify-between text-sm">
          <span className="text-gray-600">Progress:</span>
          <span className="font-medium text-gray-900">
            {data.steps.filter(s => s.status === 'completed').length} / {data.total_steps} completed
          </span>
        </div>
      </div>
    </div>
  )
}
