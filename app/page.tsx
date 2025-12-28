'use client'

import { useEffect, useState, useTransition } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { TaskChart } from '@/components/TaskChart'
import { getAiSuggestion } from './actions'
import { Loader2, Plus, Sparkles, Trash2, CheckCircle2, Circle } from 'lucide-react'
import { cn } from '@/lib/utils'

type Task = {
  task: string
  desc: string
  completed: boolean
}

export default function Home() {
  const [task, setTask] = useState('')
  const [desc, setDesc] = useState('')
  const [tasks, setTasks] = useState<Task[]>([])
  const [isPending, startTransition] = useTransition()

  // Load tasks
  useEffect(() => {
    const storedTasks = localStorage.getItem('tasks')
    if (storedTasks) setTasks(JSON.parse(storedTasks))
  }, [])

  // Save tasks
  useEffect(() => {
    localStorage.setItem('tasks', JSON.stringify(tasks))
  }, [tasks])

  const submitHandler = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (!task.trim()) return

    const newTask: Task = { task, desc, completed: false }
    setTasks([...tasks, newTask])
    setTask('')
    setDesc('')
  }

  const deleteHandler = (index: number) => {
    setTasks(tasks.filter((_, i) => i !== index))
  }

  const toggleCompleted = (index: number) => {
    const updatedTasks = [...tasks]
    updatedTasks[index].completed = !updatedTasks[index].completed
    setTasks(updatedTasks)
  }

  const handleAiSuggest = () => {
    if (!task) return alert("Type a topic first (e.g., 'Workout')")
    
    startTransition(async () => {
      try {
        const suggestion = await getAiSuggestion(task)
        setTask(suggestion.title)
        setDesc(suggestion.description)
      } catch (error) {
        console.error(error)
        alert("AI failed to suggest.")
      }
    })
  }

  const completedCount = tasks.filter((task) => task.completed).length
  const pendingCount = tasks.length - completedCount
  const chartData = [
    { name: 'Completed', tasks: completedCount, fill: '#22c55e' }, // Green-500
    { name: 'Pending', tasks: pendingCount, fill: '#ef4444' }, // Red-500
  ]

  return (
    <main className='min-h-screen flex flex-col items-center justify-center bg-gray-50/50 p-4 sm:p-8 font-sans'>
      <div className='w-full max-w-md space-y-6'>
        
        {/* Header Section */}
        <div className='text-center space-y-1'>
            <h1 className='text-xl font-semibold tracking-tight text-gray-900'>AlphaTodo</h1>
            <p className='text-sm text-gray-500'>Manage your tasks with AI precision</p>
        </div>

        {/* Chart Card */}
        {tasks.length > 0 && (
           <div className='bg-white rounded-xl border border-gray-100 shadow-sm p-4 flex justify-center'>
               <div className='w-[200px]'> 
                   {/* Reduced chart size for cleaner look */}
                   <TaskChart data={chartData} />
               </div>
           </div>
        )}

        {/* Input Card */}
        <div className='bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden'>
          <form onSubmit={submitHandler} className='p-4 space-y-3'>
            <div className='space-y-2'>
                <Input
                  placeholder='What needs doing?'
                  value={task}
                  onChange={(e) => setTask(e.target.value)}
                  className='border-0 border-b border-gray-100 rounded-none px-0 focus-visible:ring-0 focus-visible:border-gray-900 text-base font-medium placeholder:text-gray-400'
                />
                <Input
                  placeholder='Add details (optional)'
                  value={desc}
                  onChange={(e) => setDesc(e.target.value)}
                  className='border-0 rounded-none px-0 h-8 text-sm focus-visible:ring-0 text-gray-500 placeholder:text-gray-300'
                />
            </div>
            
            <div className='flex gap-2 pt-2'>
                <Button 
                    type='button' 
                    variant="outline" 
                    size="sm"
                    onClick={handleAiSuggest} 
                    disabled={isPending}
                    className='text-xs h-8 ml-auto border-dashed text-gray-500 hover:text-indigo-600 hover:border-indigo-200 hover:bg-indigo-50'
                >
                    {isPending ? <Loader2 className="w-3 h-3 animate-spin mr-1" /> : <Sparkles className="w-3 h-3 mr-1" />}
                    AI Suggest
                </Button>
                <Button type='submit' size="sm" className='h-8 text-xs font-medium'>
                    <Plus className="w-3 h-3 mr-1" />
                    Add Task
                </Button>
            </div>
          </form>
        </div>

        {/* Task List */}
        <ul className='space-y-2'>
            {tasks.map((t, index) => (
              <li key={index} className='group'>
                <div className={cn(
                    'bg-white px-4 py-3 rounded-xl border border-gray-100 shadow-sm transition-all duration-200 flex items-start justify-between gap-3 group-hover:border-gray-300',
                    t.completed && 'opacity-60 bg-gray-50'
                )}>
                  <div className='flex gap-3 items-start overflow-hidden'>
                    <button 
                        onClick={() => toggleCompleted(index)}
                        className='mt-1 text-gray-400 hover:text-green-600 transition-colors'
                    >
                        {t.completed ? <CheckCircle2 className="w-5 h-5 text-green-500" /> : <Circle className="w-5 h-5" />}
                    </button>
                    
                    <div className='flex flex-col min-w-0'>
                      <span className={cn('text-sm font-medium truncate', t.completed && 'line-through text-gray-500')}>
                          {t.task}
                      </span>
                      {t.desc && (
                          <span className='text-xs text-gray-400 truncate'>
                              {t.desc}
                          </span>
                      )}
                    </div>
                  </div>

                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => deleteHandler(index)}
                    className='h-7 w-7 text-gray-300 hover:text-red-500 hover:bg-red-50 -mr-1 opacity-0 group-hover:opacity-100 transition-opacity'
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </Button>
                </div>
              </li>
            ))}
            
            {tasks.length === 0 && (
                <div className='text-center py-10'>
                    <p className='text-sm text-gray-400'>No tasks yet. Enjoy your day!</p>
                </div>
            )}
        </ul>

      </div>
    </main>
  )
}