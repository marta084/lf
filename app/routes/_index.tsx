import { defer } from '@remix-run/cloudflare'
import { Await, NavLink, useLoaderData } from '@remix-run/react'
import prisma from '~/utils/db.server'
import { Suspense } from 'react'

const wait = (ms: number) => new Promise(r => setTimeout(r, ms))

interface DeferredData {
  posts: Promise<string>
}

export const loader = async () => {
  const Posts = await prisma.note.findMany({
    select: {
      id: true,
      title: true,
      content: true,
      updatedAt: true,
    },
    cacheStrategy: { ttl: 14400 },
  })

  return defer({ postz: Posts, posts: wait(1).then(() => Posts) })
}

export default function Index() {
  const { posts } = useLoaderData() as DeferredData
  const data = useLoaderData<typeof loader>()

  return (
    <div className="mb-auto">
      <div className="my-8"></div>
      <h1> WELCOME TO A GAMING NEWS PLATFORM</h1>
      {/* <div className="my-8">
        <h1>posts:</h1>
        <Suspense fallback={'Loading'}>
          <Await resolve={posts}>
            {posts => (
              <ul>
                {posts.map(post => (
                  <li
                    className="m-4 border-2 border-green-300 p-2"
                    key={post.id}
                  >
                    <NavLink to={post.id}>
                      <h1>{post.title}</h1>
                      <p>{post.content}</p>
                    </NavLink>
                  </li>
                ))}
              </ul>
            )}
          </Await>
        </Suspense>
        <p>---------------------------------</p>
      </div> */}
      <div className="container bg-background">
        <ul className="overflow-y-auto overflow-x-hidden pb-12">
          {data.postz && data.postz.length > 0 ? (
            data.postz?.map(potz => (
              <li key={potz.id} className="m-4 border-2 border-green-300 p-2">
                <NavLink to={potz.id} preventScrollReset>
                  {potz.title}
                </NavLink>
              </li>
            ))
          ) : (
            <p>No posts yet</p>
          )}
        </ul>
      </div>
    </div>
  )
}
