'use client'

import { useState } from 'react'
import { Clock, Share2, Maximize2, MoreHorizontal, Download, Eye } from 'lucide-react'

type Priority = 'High Priority' | 'Medium Priority' | 'Low Priority'
type Status = 'TODO' | 'IN PROGRESS' | 'COMPLETED'

interface Task {
    id: number
    title: string
    priority: Priority
    daysLeft: number
    views: number
    comments: number
    status: Status
}

interface Attachment {
    id: number
    name: string
    type: string
    date: string
}

interface Comment {
    id: number
    user: string
    avatar: string
    date: string
    content: string
}

const tasks: Task[] = [
    {
        id: 1,
        title: "Schedule me an appointment with my endocrinologist",
        priority: "High Priority",
        daysLeft: 15,
        views: 17,
        comments: 6,
        status: "TODO"
    },
    {
        id: 2,
        title: "Help DStudio get more customers",
        priority: "Medium Priority",
        daysLeft: 15,
        views: 12,
        comments: 23,
        status: "TODO"
    },
    {
        id: 3,
        title: "Plan an event",
        priority: "High Priority",
        daysLeft: 15,
        views: 32,
        comments: 7,
        status: "IN PROGRESS"
    },
    {
        id: 4,
        title: "Return a package",
        priority: "Low Priority",
        daysLeft: 15,
        views: 8,
        comments: 34,
        status: "IN PROGRESS"
    },
    {
        id: 5,
        title: "Find a kids activity",
        priority: "Medium Priority",
        daysLeft: 15,
        views: 5,
        comments: 2,
        status: "COMPLETED"
    }
]

const attachments: Attachment[] = [
    {
        id: 1,
        name: "Medical Prescription.docx",
        type: "docx",
        date: "12:32 PM, 22, August"
    },
    {
        id: 2,
        name: "Doctor Appiontment.pdf",
        type: "pdf",
        date: "14:35 PM, 24, August"
    }
]

const comments: Comment[] = [
    {
        id: 1,
        user: "John Smith",
        avatar: "/placeholder.svg?height=40&width=40",
        date: "17th Feb 2024",
        content: "I want a complete diet plan."
    },
    {
        id: 2,
        user: "John Smith",
        avatar: "/placeholder.svg?height=40&width=40",
        date: "Just Now",
        content: "Do you have any update?"
    }
]

export default function MyPortalPage() {
    const [selectedTask, setSelectedTask] = useState<Task>(tasks[0])
    const [filter, setFilter] = useState<'All' | 'Remote' | 'In Person'>('All')

    const getPriorityColor = (priority: Priority) => {
        switch (priority) {
            case 'High Priority':
                return 'bg-red-100 text-red-700'
            case 'Medium Priority':
                return 'bg-purple-100 text-purple-700'
            case 'Low Priority':
                return 'bg-green-100 text-green-700'
        }
    }

    return (
        <div className="flex min-h-screen bg-gray-50">

            <div className="w-full max-w-md border-r border-gray-200 bg-white dark:bg-gray-700">
                <div className="p-6">
                    <h1 className="text-2xl font-bold mb-6 text-gray-800 dark:text-primary">My Portal Page</h1>

                    {/* Filters */}
                    <div className="flex gap-2 mb-8">
                        {['All', 'Remote', 'In Person'].map((option) => (
                            <button
                                key={option}
                                onClick={() => setFilter(option as any)}
                                className={`px-4 py-2 rounded-full text-sm ${filter === option
                                        ? 'bg-gray-900 text-white'
                                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                                    }`}
                            >
                                {option}
                            </button>
                        ))}
                    </div>

                   
                    <div className="space-y-8">
                       
                        <div>
                            <div className="flex items-center gap-2 mb-4">
                                <h2 className="text-sm font-medium  dark:text-primary text-gray-500">TODO</h2>
                                <span className="dark:bg-gray-100 dark:text-gray-600 text-xs px-2 py-1 rounded-full">2</span>
                            </div>
                            <div className="space-y-3">
                                {tasks.filter(task => task.status === 'TODO').map(task => (
                                    <div
                                        key={task.id}
                                        onClick={() => setSelectedTask(task)}
                                        className={`p-4 rounded-lg border cursor-pointer transition-colors ${selectedTask.id === task.id
                                                ? 'border-blue-500 dark:bg-primary'
                                                : 'border-gray-200 hover:border-gray-300'
                                            }`}
                                    >
                                        <h3 className="font-medium mb-3  dark:text-white text-gray-800">{task.title}</h3>
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center gap-4">
                                                <span className="text-sm dark:text-white text-gray-500">{task.daysLeft} Days left</span>
                                                <span className="text-sm dark:text-white text-gray-500">{task.views}</span>
                                                <span className="text-sm dark:text-white text-gray-500">{task.comments}</span>
                                            </div>
                                            <span className={`text-xs px-3 py-1 rounded-full ${getPriorityColor(task.priority)}`}>
                                                {task.priority}
                                            </span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                       
                        <div>
                            <div className="flex items-center gap-2 mb-4">
                                <h2 className="text-sm font-medium dark:text-primary text-gray-500">IN PROGRESS</h2>
                                <span className="bg-gray-100 text-gray-600 text-xs px-2 py-1 rounded-full">2</span>
                            </div>
                            <div className="space-y-3">
                                {tasks.filter(task => task.status === 'IN PROGRESS').map(task => (
                                    <div
                                        key={task.id}
                                        onClick={() => setSelectedTask(task)}
                                        className={`p-4 rounded-lg border cursor-pointer transition-colors ${selectedTask.id === task.id
                                                ? 'border-blue-500 dark:bg-primary'
                                                : 'border-gray-200 hover:border-gray-300'
                                            }`}
                                    >
                                        <h3 className="font-medium mb-3  dark:text-white text-gray-800">{task.title}</h3>
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center gap-4">
                                                <span className="text-sm dark:text-white text-gray-500">{task.daysLeft} Days left</span>
                                                <span className="text-sm dark:text-white text-gray-500">{task.views}</span>
                                                <span className="text-sm dark:text-white text-gray-500">{task.comments}</span>
                                            </div>
                                            <span className={`text-xs px-3 py-1 rounded-full ${getPriorityColor(task.priority)}`}>
                                                {task.priority}
                                            </span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* COMPLETED Section */}
                        <div>
                            <div className="flex items-center gap-2 mb-4">
                                <h2 className="text-sm font-medium  dark:text-primary text-gray-500">COMPLETED</h2>
                                <span className="bg-gray-100 text-gray-600 text-xs px-2 py-1 rounded-full">1</span>
                            </div>
                            <div className="space-y-3">
                                {tasks.filter(task => task.status === 'COMPLETED').map(task => (
                                    <div
                                        key={task.id}
                                        onClick={() => setSelectedTask(task)}
                                        className={`p-4 rounded-lg border cursor-pointer transition-colors ${selectedTask.id === task.id
                                                ? 'border-blue-500 bg-blue-50'
                                                : 'border-gray-200 hover:border-gray-300'
                                            }`}
                                    >
                                        <h3 className="font-medium mb-3 dark:text-gray-100 text-gray-800">{task.title}</h3>
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center gap-4">
                                                <span className="text-sm dark:text-gray-100 text-gray-700">{task.daysLeft} Days left</span>
                                                <span className="text-sm dark:text-gray-100 text-gray-700">{task.views}</span>
                                                <span className="text-sm dark:text-gray-100 text-gray-700">{task.comments}</span>
                                            </div>
                                            <span className={`text-xs px-3 py-1 rounded-full ${getPriorityColor(task.priority)}`}>
                                                {task.priority}
                                            </span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Right Content */}
            <div className="flex-1 bg-white dark:bg-gray-700">
                <div className="p-6">
                    {/* Header */}
                    <div className="flex items-center justify-between mb-8">
                        <div className="flex items-center gap-2">
                            <span className="bg-gray-100 p-2 rounded">📅</span>
                            <span className="text-sm text-gray-600 dark:text-primary">Appointments</span>
                        </div>
                        <div className="flex items-center gap-4">
                            <button className="dark:text-gray-600 hover:text-gray-900">
                                <Share2 className="h-5 w-5" />
                            </button>
                            <button className="dark:text-gray-600 hover:text-gray-900">
                                <Maximize2 className="h-5 w-5" />
                            </button>
                            <button className="dark:text-gray-600 hover:text-gray-900">
                                <MoreHorizontal className="h-5 w-5" />
                            </button>
                        </div>
                    </div>

                    {/* Title and Priority */}
                    <div className="mb-6">
                        <h1 className="text-2xl font-bold mb-4">{selectedTask.title}</h1>
                        <div className="flex items-center gap-4">
                            <span className={`text-xs px-3 py-1 rounded-full ${getPriorityColor(selectedTask.priority)}`}>
                                {selectedTask.priority}
                            </span>
                            <div className="flex items-center gap-2 text-sm dark:text-gray-600">
                                <Clock className="h-4 w-4" />
                                <span>Jul 10 - 14</span>
                            </div>
                        </div>
                    </div>

                    {/* Time Spent */}
                    <div className="bg-purple-50 rounded-lg p-4 mb-8">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <Clock className="h-5 w-5 text-purple-700" />
                                <span className="text-purple-700">Time Spent on this project</span>
                            </div>
                            <span className="text-xl font-mono text-purple-700">12:45:00</span>
                        </div>
                    </div>

                    {/* Description */}
                    <div className="mb-8">
                        <h2 className="text-lg font-semibold mb-4 dark:text-primary text-gray-400">Description</h2>
                        <p className="dark:text-gray-100 mb-4">
                            Specializes in the diagnosis and treatment of diseases related to the endocrine system,
                            which includes glands and organs that produce hormones.
                        </p>
                        <p className="dark:text-gray-100">
                            These hormones regulate various bodily functions such as metabolism, growth, and
                            reproduction.
                        </p>
                    </div>

                    {/* Attachments */}
                    <div className="mb-8">
                        <h2 className="text-lg font-semibold mb-4 text-gray-600 dark:text-primary">Attachments</h2>
                        <div className="space-y-3">
                            {attachments.map(file => (
                                <div
                                    key={file.id}
                                    className="flex items-center justify-between p-4 dark:bg-gray-700 bg-gray-50 rounded-lg"
                                >
                                    <div className="flex items-center gap-3">
                                        <div className="bg-red-100 p-2 rounded">
                                            <span className="text-red-700 text-sm">📄</span>
                                        </div>
                                        <div>
                                            <h3 className="font-medium">{file.name}</h3>
                                            <p className="text-sm text-gray-500 dark:text-white">{file.date}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <button className="dark:text-gray-600 hover:text-gray-900">
                                            <Eye className="h-5 w-5 dark:bg-primary" />
                                        </button>
                                        <button className="dark:text-gray-600 hover:text-gray-900">
                                            <Download className="h-5 w-5 dark:bg-primary" />
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Comments */}
                    <div>
                        <div className="flex gap-4 mb-4">
                            <button className="dark:text-primary text-gray-900 border-b-2 dark:border-gray-900 pb-2 ">Comments</button>
                            <button className="dark:text-primary text-gray-500 pb-2">Updates</button>
                        </div>
                        <div className="space-y-6">
                            {comments.map(comment => (
                                <div key={comment.id} className="flex gap-4">
                                    <img
                                        src={comment.avatar}
                                        alt={comment.user}
                                        className="w-10 h-10 rounded-full"
                                    />
                                    <div>
                                        <div className="flex items-center gap-2 mb-1">
                                            <span className="font-medium">{comment.user}</span>
                                            <span className="text-sm dark:text-gray-500">• {comment.date}</span>
                                        </div>
                                        <p className="dark:text-gray-600">{comment.content}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                        <div className="mt-6">
                            <input
                                type="text"
                                placeholder="Add a comment..."
                                className="w-full p-4 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

