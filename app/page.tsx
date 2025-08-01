'use client'

import { useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

type Task = {
  task: string
  desc: string
  completed: boolean
}

export default function Home() {
  const [task, setTask] = useState('')
  const [desc, setDesc] = useState('')
  const [tasks, setTasks] = useState<Task[]>([])

  // Load tasks from localStorage on mount
  useEffect(() => {
    const storedTasks = localStorage.getItem('tasks')
    if (storedTasks) {
      setTasks(JSON.parse(storedTasks))
    }
  }, [])

  // Save tasks to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('tasks', JSON.stringify(tasks))
  }, [tasks])

  const submitHandler = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (!task.trim()) return

    const newTask: Task = {
      task,
      desc,
      completed: false,
    }

    setTasks([...tasks, newTask])
    setTask('')
    setDesc('')
  }

  const deleteHandler = (index: number) => {
    const updatedTasks = tasks.filter((_, i) => i !== index)
    setTasks(updatedTasks)
  }

  const toggleCompleted = (index: number) => {
    const updatedTasks = [...tasks]
    updatedTasks[index].completed = !updatedTasks[index].completed
    setTasks(updatedTasks)
  }

  return (
    <main className='min-h-screen flex items-center justify-center bg-gray-100 p-8'>
      <div className='bg-white rounded-xl shadow-lg p-6 space-y-4 w-full max-w-xl'>
        <h1 className='text-2xl font-bold text-center'>Todo With AI</h1>

        <form onSubmit={submitHandler} className='flex flex-col sm:flex-row gap-4'>
          <Input
            placeholder='Enter Task'
            value={task}
            onChange={(e) => setTask(e.target.value)}
            className='w-full'
          />
          <Input
            placeholder='Enter Description'
            value={desc}
            onChange={(e) => setDesc(e.target.value)}
            className='w-full'
          />
          <Button type='submit'>Add</Button>
        </form>

        <hr />

        <div className='bg-slate-200 rounded-2xl p-4 mt-2'>
          <ul className='space-y-2'>
            {tasks.length > 0 ? (
              tasks.map((t, index) => (
                <li key={index} className='mb-2'>
                  <div className='bg-white p-2 rounded shadow flex flex-col sm:flex-row sm:items-center justify-between'>
                    <div className='flex items-center gap-2'>
                      <input
                        type='checkbox'
                        checked={t.completed}
                        onChange={() => toggleCompleted(index)}
                      />
                      <div className={t.completed ? 'line-through text-gray-500' : ''}>
                        <h5 className='font-semibold'>{t.task}</h5>
                        <h6 className='text-sm text-gray-600'>{t.desc}</h6>
                      </div>
                    </div>
                    <Button
                      type='button'
                      onClick={() => deleteHandler(index)}
                      className='bg-red-500 mt-2 sm:mt-0'
                    >
                      Delete
                    </Button>
                  </div>
                </li>
              ))
            ) : (
              <h2 className='text-gray-500'>No Task Available</h2>
            )}
          </ul>
        </div>
      </div>
    </main>
  )
}
