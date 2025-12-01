import React from "react"
import { AlertCircle, Bell, CheckCircle, Info } from "lucide-react"
import { useNotifications } from "@app/hooks/data/useNotification"
import { stripHtmlTags } from "@/utils/stripHtmlTags";

// Custom Skeleton Component
const Skeleton = ({ className }: { className?: string }) => (
  <div className={`bg-gray-300 dark:bg-gray-600 animate-pulse ${className}`} />
)

function NotificationList() {

  const { data: notification, isLoading: loading, error } = useNotifications();

  const getNotificationIcon = (type: string) => {
    switch (type?.toLowerCase()) {
      case "success":
        return <CheckCircle className="h-5 w-5 text-green-500" />
      case "error":
      case "danger":
        return <AlertCircle className="h-5 w-5 text-red-500" />
      case "info":
        return <Info className="h-5 w-5 text-blue-500" />
      default:
        return <Bell className="h-7 text-gray-500" />
    }
  }

  return (
    <section className="container mx-auto bg-white dark:bg-gray-800 p-4 rounded-lg">
      <h1 className="text-3xl font-bold dark:text-primary text-primary mb-8">Notifications</h1>

      {loading && (
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="flex items-start gap-4 p-4 border rounded-lg">
              <Skeleton className="h-5 w-5 rounded-full" />
              <div className="space-y-2 flex-1">
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-3 w-1/2" />
              </div>
            </div>
          ))}
        </div>
      )}

      {!loading && !error && notification?.length === 0 && (
        <div className="text-center py-8 text-gray-500 dark:text-gray-400">
          <Bell className="mx-auto h-12 w-12 mb-4 opacity-50" />
          <p>No notifications found</p>
        </div>
      )}

      <div className="space-y-4">
        {!loading &&
          notification?.map((item, index) => (
            <div
              key={index}
              className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 transition-all hover:shadow-md"
            >
              <div className="flex items-start gap-3">
                <div className="mt-1">{getNotificationIcon(item.content_type)}</div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 justify-between">
                    <h3 className="font-medium text-primary dark:text-primary">{item.title || "Notification"}</h3>
                    {item.content_type && <div className="inline-block text-xs px-2 py-1 rounded-full bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200">
                      {item.content_type}
                    </div>}
                  </div>
                  {item.description && <p className="text-sm text-gray-600 dark:text-gray-300 mt-1 line-clamp-2">{stripHtmlTags(item.description)}</p>}
                  {item.created_at && (
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                      {new Date(item.created_at).toLocaleString()}
                    </p>
                  )}
                </div>
              </div>
            </div>
          ))}
      </div>
    </section>
  )
}

export default NotificationList
