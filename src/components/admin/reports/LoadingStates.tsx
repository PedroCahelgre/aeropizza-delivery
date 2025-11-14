import { Card, CardContent } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { RefreshCw } from 'lucide-react'

interface LoadingStatesProps {
  type: 'dashboard' | 'reports-list' | 'templates' | 'analytics'
}

// Componente para loading states profissionais
export const LoadingStates = ({ type }: LoadingStatesProps) => {
  switch (type) {
    case 'dashboard':
      return (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <Card key={i} className="bg-gradient-to-br from-gray-800 to-gray-900 border-gray-700">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div className="space-y-2">
                    <Skeleton className="h-4 w-24 bg-gray-700" />
                    <Skeleton className="h-8 w-16 bg-gray-600" />
                    <Skeleton className="h-3 w-20 bg-gray-700" />
                  </div>
                  <div className="bg-gray-700 p-3 rounded-full">
                    <RefreshCw className="w-6 h-6 animate-spin text-gray-400" />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )

    case 'reports-list':
      return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <Card key={i} className="bg-gray-900 border-gray-800">
              <CardContent className="p-6">
                <div className="space-y-4">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <Skeleton className="w-12 h-12 bg-gray-700 rounded-xl" />
                      <div className="space-y-1">
                        <Skeleton className="h-5 w-32 bg-gray-600" />
                        <Skeleton className="h-4 w-20 bg-gray-700" />
                      </div>
                    </div>
                    <Skeleton className="h-6 w-16 bg-gray-700 rounded-full" />
                  </div>
                  
                  <Skeleton className="h-4 w-full bg-gray-700" />
                  <Skeleton className="h-4 w-3/4 bg-gray-700" />
                  
                  <div className="flex justify-between">
                    <Skeleton className="h-3 w-16 bg-gray-700" />
                    <Skeleton className="h-3 w-12 bg-gray-700" />
                  </div>
                  
                  <div className="flex gap-1">
                    <Skeleton className="h-6 w-12 bg-gray-700 rounded" />
                    <Skeleton className="h-6 w-16 bg-gray-700 rounded" />
                    <Skeleton className="h-6 w-10 bg-gray-700 rounded" />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )

    case 'templates':
      return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {Array.from({ length: 5 }).map((_, i) => (
            <Card key={i} className="bg-gray-900 border-gray-800">
              <CardContent className="p-6">
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <Skeleton className="w-12 h-12 bg-yellow-500/20 rounded-xl" />
                    <div className="flex-1 space-y-2">
                      <Skeleton className="h-5 w-40 bg-gray-600" />
                      <div className="flex gap-2">
                        <Skeleton className="h-4 w-12 bg-gray-700 rounded" />
                        <Skeleton className="h-4 w-16 bg-gray-700" />
                      </div>
                    </div>
                  </div>
                  
                  <Skeleton className="h-4 w-full bg-gray-700" />
                  <Skeleton className="h-3 w-5/6 bg-gray-700" />
                  
                  <div className="space-y-2">
                    <Skeleton className="h-3 w-24 bg-gray-600" />
                    {Array.from({ length: 3 }).map((_, j) => (
                      <div key={j} className="flex items-center gap-2">
                        <Skeleton className="h-3 w-3 bg-green-500/30 rounded-full" />
                        <Skeleton className="h-3 w-32 bg-gray-700" />
                      </div>
                    ))}
                  </div>
                  
                  <Skeleton className="h-10 w-full bg-yellow-500/20 rounded" />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )

    case 'analytics':
      return (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card className="bg-gray-900 border-gray-800">
            <CardContent className="p-6">
              <div className="space-y-4">
                <Skeleton className="h-6 w-48 bg-gray-600" />
                {Array.from({ length: 6 }).map((_, i) => (
                  <div key={i} className="space-y-2">
                    <div className="flex justify-between">
                      <Skeleton className="h-4 w-24 bg-gray-700" />
                      <Skeleton className="h-4 w-16 bg-gray-700" />
                    </div>
                    <Skeleton className="h-2 w-full bg-gray-800 rounded-full" />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gray-900 border-gray-800">
            <CardContent className="p-6">
              <div className="space-y-4">
                <Skeleton className="h-6 w-40 bg-gray-600" />
                <div className="grid grid-cols-2 gap-4">
                  {Array.from({ length: 4 }).map((_, i) => (
                    <div key={i} className="text-center p-4 bg-gray-800 rounded-lg">
                      <Skeleton className="h-8 w-12 bg-gray-600 mx-auto mb-2" />
                      <Skeleton className="h-3 w-20 bg-gray-700 mx-auto" />
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )

    default:
      return (
        <div className="flex items-center justify-center p-8">
          <RefreshCw className="w-8 h-8 animate-spin text-yellow-400" />
        </div>
      )
  }
}