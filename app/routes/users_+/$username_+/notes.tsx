import {
  json,
  type LoaderFunctionArgs,
  type MetaFunction,
} from '@remix-run/cloudflare'
import { Link, NavLink, Outlet, useLoaderData } from '@remix-run/react'
import { z } from 'zod'
import prisma from '~/utils/db.server'
import { cn, invariantResponse } from '~/utils/misc'

const UserSchema = z.object({
  name: z.string().nullable(),
  username: z.string(),
  userImage: z
    .object({
      id: z.string().nullable(),
      cloudinaryurl: z.string(),
    })
    .nullable(),
  notes: z
    .array(
      z.object({
        id: z.string(),
        title: z.string(),
      }),
    )
    .nullable(),
})

export async function loader({ params }: LoaderFunctionArgs) {
  const owner = await prisma.user.findFirst({
    select: {
      name: true,
      username: true,
      userImage: { select: { id: true, cloudinaryurl: true } },
      notes: {
        select: { id: true, title: true },
        orderBy: { updatedAt: 'desc' },
      },
    },
    where: {
      username: params.username,
    },
  })

  invariantResponse(owner, 'User not found', { status: 404 })

  // Validate the owner object with Zod
  const validatedOwner = UserSchema.parse(owner)

  return json({ owner: validatedOwner })
}

export default function NotesRoute() {
  const data = useLoaderData<typeof loader>()
  const user = data.owner
  const userDisplayName = data.owner.name ?? data.owner.username

  return (
    <div>
      <div className="inline-block">
        <Link to={`/users/${user.username}/`}>
          <div className="m-4 overflow-hidden rounded-lg bg-muted p-1 text-lg font-bold shadow-sm transition duration-200 ease-in-out hover:bg-gray-600 hover:text-gray-100">
            <img
              src={data.owner.userImage?.cloudinaryurl}
              alt={userDisplayName}
              className="h-24 w-24 rounded-full object-cover"
            />
            {userDisplayName}s Profile
          </div>
        </Link>
      </div>

      <h1 className="m-4 text-lg font-medium">
        <Link to="/users/kody/notes" relative="path">
          Notes
        </Link>
      </h1>
      <div className="grid w-full grid-cols-4 bg-muted pl-2 md:container md:rounded-3xl md:pr-0">
        <div className="border-gray-450 relative col-span-1 mr-2 border-2">
          <div>
            <Link to="new">Create new note</Link>
          </div>
          <ul className="overflow-y-auto overflow-x-hidden pb-12">
            {data.owner.notes && data.owner.notes.length > 0 ? (
              data.owner.notes?.map(note => (
                <li key={note.id} className="m-1 border-2 border-gray-300 p-4">
                  <NavLink
                    to={note.id}
                    className={({ isActive }) =>
                      cn(isActive && 'bg-black text-white')
                    }
                    preventScrollReset
                  >
                    {note.title}
                  </NavLink>
                </li>
              ))
            ) : (
              <p>No notes yet</p>
            )}
          </ul>
        </div>
        <div className="relative col-span-3 mr-2 bg-accent p-4">
          <Outlet />
        </div>
      </div>
    </div>
  )
}

export const meta: MetaFunction<typeof loader> = ({ data }) => {
  return [{ title: `${data?.owner.name} Notes` }]
}
