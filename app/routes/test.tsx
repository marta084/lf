import { defer } from '@remix-run/cloudflare'
import { NavLink, useLoaderData } from '@remix-run/react'
import { z } from 'zod'
import prisma from '~/utils/db.server'
import { cn } from '~/utils/misc'

const NotesSchema = z.object({
  id: z.string(),
  title: z.string().nullable(),
})

export async function loader() {
  const notes = await prisma.note.findMany({
    select: {
      id: true,
      title: true,
    },
    cacheStrategy: { ttl: 14400 },
  })
  const validatedNotes = NotesSchema.array().parse(notes)

  return defer({ notes: validatedNotes })
}

export default function Testload() {
  const data = useLoaderData<typeof loader>()

  return (
    <div>
      <h1>notes</h1>

      <div className="container bg-background">
        <ul className="overflow-y-auto overflow-x-hidden pb-12">
          {data.notes && data.notes.length > 0 ? (
            data.notes?.map(note => (
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
      <div>hola amigo</div>
    </div>
  )
}
