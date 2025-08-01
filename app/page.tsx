'use client'
import { useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

type Task = {
  task: string
  desc: string
}

export default function Home() {
  const [task, setTask] = useState('')
  const [desc, setDesc] = useState('')
  const [mainTask, setMainTask] = useState<Task[]>([])

  // Load from localStorage on mount
  useEffect(() => {
    const storedTasks = localStorage.getItem('tasks')
    if (storedTasks) {
      setMainTask(JSON.parse(storedTasks))
    }
  }, [])

  // Save to localStorage when tasks change
  useEffect(() => {
    localStorage.setItem('tasks', JSON.stringify(mainTask))
  }, [mainTask])

  const submitHandler = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (!task.trim()) return
    setMainTask([...mainTask, { task, desc }])
    setTask('')
    setDesc('')
  }

  const deleteHandler = (i: number) => {
    const temp = [...mainTask]
    temp.splice(i, 1)
    setMainTask(temp)
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
            {mainTask.length > 0 ? (
              mainTask.map((t, index) => (
                <li key={index} className='mb-2'>
                  <div className='bg-white p-2 rounded shadow flex flex-col sm:flex-row sm:items-center justify-between'>
                    <div>
                      <h5 className='font-semibold'>{t.task}</h5>
                      <h6 className='text-sm text-gray-600'>{t.desc}</h6>
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
