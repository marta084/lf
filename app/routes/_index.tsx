import { defer } from '@remix-run/cloudflare'
import { Await, useLoaderData } from '@remix-run/react'
import prisma from '~/utils/db.server'
import { Suspense } from 'react'

const wait = (ms: number) => new Promise(r => setTimeout(r, ms))

interface DeferredData {
  posts: Promise<string>
}

export const loader = async () => {
  const Posts = prisma.note.findMany({
    select: {
      id: true,
      title: true,
      content: true,
      updatedAt: true,
    },
  })

  return defer({ posts: wait(10).then(() => Posts) })
}

export default function Index() {
  const { posts } = useLoaderData() as DeferredData

  return (
    <div className="mb-auto">
      <div className="my-8"></div>
      <h1> WELCOME TO A GAMING NEWS PLATFORM</h1>
      <div className="my-8">
        <h1>posts:</h1>
        <Suspense fallback={'Loading'}>
          <Await resolve={posts}>
            {posts => (
              <ul>
                {posts.map(post => (
                  <li key={post.id}>{post.title}</li>
                ))}
              </ul>
            )}
          </Await>
        </Suspense>
        <p>---------------------------------</p>
      </div>
    </div>
  )
}
