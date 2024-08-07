import { json, type LoaderFunctionArgs } from '@remix-run/cloudflare'
import { useLoaderData } from '@remix-run/react'
import prisma from '~/utils/db.server'
import { invariantResponse } from '~/utils/misc'
import { NoteEditor, action } from './__note-editor'

export { action }

export async function loader({ params }: LoaderFunctionArgs) {
  const note = await prisma.note.findFirst({
    select: {
      id: true,
      title: true,
      content: true,
    },
    where: {
      id: params.noteId,
      owner: { username: params.username },
    },
  })
  invariantResponse(note, 'Not found', { status: 404 })
  return json({ note })
}

export default function NoteEdit() {
  const data = useLoaderData<typeof loader>()

  return <NoteEditor note={data.note} />
}
