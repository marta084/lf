import { format } from 'date-fns'
import { json, type LoaderFunctionArgs } from '@remix-run/cloudflare'
import { NavLink, useLoaderData } from '@remix-run/react'
import { z } from 'zod'
import prisma from '~/utils/db.server'
import { cn } from '~/utils/misc'

const PostsSchema = z.object({
  id: z.string(),
  title: z.string().nullable(),
  content: z.string().nullable(),
  updatedAt: z.date().nullable(),
})

const formatDate = dateString => {
  const date = new Date(dateString)
  return format(date, 'yyyy-MM-dd HH:mm:ss')
}

export const loader = async ({ request }: LoaderFunctionArgs) => {
  // console.log('DATABASE_URL:', context.env.DATABASE_URL)

  // const dbtest = context.env.DATABASE_URL ?? 'Database URL not available'

  const Posts = await prisma.note.findMany({
    select: {
      id: true,
      title: true,
      content: true,
      updatedAt: true,
    },
  })

  const validatedPosts = PostsSchema.array().parse(Posts)

  return json({ posts: validatedPosts })
}

export default function Index() {
  const data = useLoaderData<typeof loader>()

  return (
    <div className="mb-auto">
      <div className="my-8"></div>
      <h1> WELCOME TO A GAMING NEWS PLATFORM</h1>
      <div className="my-8">
        <h1>posts:</h1>

        {data.posts && data.posts.length > 0 ? (
          data.posts?.map(post => (
            <div
              key={post.id}
              className="m-1 mb-4 border-2 border-gray-300 p-4"
            >
              <NavLink
                to={`test/${post.id}`}
                className={({ isActive }) =>
                  cn(isActive && 'bg-black text-white')
                }
                preventScrollReset
              >
                title: {post.title}
                <p></p>
                content: {post.content}
                <p></p>
                updated at: {formatDate(post.updatedAt)}
              </NavLink>
            </div>
          ))
        ) : (
          <p>No posts yet</p>
        )}
      </div>
    </div>
  )
}
