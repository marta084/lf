import { useForm } from '@conform-to/react'
import { getFieldsetConstraint, parse } from '@conform-to/zod'
import {
  type ActionFunctionArgs,
  type LoaderFunctionArgs,
  json,
  redirect,
  type MetaFunction,
} from '@remix-run/cloudflare'
import { formatDistanceToNow } from 'date-fns'
import { AuthenticityTokenInput } from 'remix-utils/csrf/react'
import { z } from 'zod'
import { GeneralErrorBoundary } from '~/components/error-boundary'
import { floatingToolbarClassName } from '~/components/floating-toolbar'
import { ErrorList } from '~/components/forms'
import { Button } from '~/components/ui/button'
import { Icon } from '~/components/ui/icon'
import { StatusButton } from '~/components/ui/status-button'
import { validateCSRF } from '~/utils/csrf.server'
import prisma from '~/utils/db.server'
import { invariantResponse, useIsPending } from '~/utils/misc'
import { toastSessionStorage } from '~/utils/toast.server'
import { type loader as notesLoader } from './notes'
import { Form, Link, useActionData, useLoaderData } from '@remix-run/react'

export async function loader({ params }: LoaderFunctionArgs) {
  const note = await prisma.note.findUnique({
    where: { id: params.noteId },
    select: {
      id: true,
      title: true,
      content: true,
      ownerId: true,
      updatedAt: true,
    },
  })

  invariantResponse(note, 'Not found', { status: 404 })

  const date = new Date(note.updatedAt)
  const timeAgo = formatDistanceToNow(date)

  return json({
    note,
    timeAgo,
  })
}

const DeleteFormSchema = z.object({
  intent: z.literal('delete-note'),
  noteId: z.string(),
})

export async function action({ request, params }: ActionFunctionArgs) {
  const formData = await request.formData()
  await validateCSRF(formData, request.headers)
  const submission = parse(formData, {
    schema: DeleteFormSchema,
  })
  if (submission.intent !== 'submit') {
    return json({ status: 'idle', submission } as const)
  }
  if (!submission.value) {
    return json({ status: 'error', submission } as const, { status: 400 })
  }

  const { noteId } = submission.value

  const note = await prisma.note.findFirst({
    select: { id: true, owner: { select: { username: true } } },
    where: { id: noteId, owner: { username: params.username } },
  })
  invariantResponse(note, 'Not found', { status: 404 })

  await prisma.note.delete({ where: { id: note.id } })
  const toastCookieSession = await toastSessionStorage.getSession(
    request.headers.get('cookie'),
  )
  toastCookieSession.flash('toast', {
    id: noteId,
    type: 'success',
    title: 'Note deleted',
    description: 'Your note has been deleted',
  })

  return redirect(`/users/${note.owner?.username}/notes`, {
    headers: {
      'set-cookie': await toastSessionStorage.commitSession(toastCookieSession),
    },
  })
}

export default function NoteRoute() {
  const data = useLoaderData<typeof loader>()
  return (
    <div className="flex flex-col px-10">
      <h2 className="mb-2 pt-12 text-h2 lg:mb-6">{data.note.title}</h2>
      <div className="overflow-y-auto pb-24">
        <p className="whitespace-break-spaces text-sm md:text-lg">
          {data.note.content}
        </p>
      </div>
      <div className={floatingToolbarClassName}>
        <span className="text-sm text-foreground/90 max-[524px]:hidden">
          <Icon name="clock" className="scale-125">
            {data.timeAgo} ago
          </Icon>
        </span>
        <div className="grid flex-1 grid-cols-2 justify-end gap-2 min-[525px]:flex md:gap-4">
          <DeleteNote id={data.note.id} />
          <Button
            asChild
            className="min-[525px]:max-md:aspect-square min-[525px]:max-md:px-0"
          >
            <Link to="edit">
              <Icon name="pencil-1" className="scale-125 max-md:scale-150">
                <span className="max-md:hidden">Edit</span>
              </Icon>
            </Link>
          </Button>
        </div>
      </div>
    </div>
  )
}

export function DeleteNote({ id }: Readonly<{ id: string }>) {
  const actionData = useActionData<typeof action>()
  const isPending = useIsPending()
  const [form] = useForm({
    id: 'delete-note',
    lastSubmission: actionData?.submission,
    constraint: getFieldsetConstraint(DeleteFormSchema),
    onValidate({ formData }) {
      return parse(formData, { schema: DeleteFormSchema })
    },
  })

  return (
    <Form method="post" {...form.props}>
      <AuthenticityTokenInput />
      <input type="hidden" name="noteId" value={id} />
      <StatusButton
        type="submit"
        name="intent"
        value="delete-note"
        variant="destructive"
        status={isPending ? 'pending' : actionData?.status ?? 'idle'}
        disabled={isPending}
        className="w-full max-md:aspect-square max-md:px-0"
      >
        <Icon name="trash" className="scale-125 max-md:scale-150">
          <span className="max-md:hidden">Delete</span>
        </Icon>
      </StatusButton>
      <ErrorList errors={form.errors} id={form.errorId} />
    </Form>
  )
}

export const meta: MetaFunction<
  typeof loader,
  { 'routes/users+/$username_+/notes': typeof notesLoader }
> = ({ data, params, matches }) => {
  const notesMatch = matches.find(
    m => m.id === 'routes/users+/$username_+/notes',
  )
  const displayName = notesMatch?.data?.owner.name ?? params.username
  const noteTitle = data?.note.title ?? 'Note'
  const noteContentsSummary =
    data && data.note.content.length > 100
      ? data?.note.content.slice(0, 97) + '...'
      : 'No content'
  return [
    { title: `${noteTitle} | ${displayName}'s Notes | Epic Notes` },
    {
      name: 'description',
      content: noteContentsSummary,
    },
  ]
}

export function ErrorBoundary() {
  return (
    <GeneralErrorBoundary
      statusHandlers={{
        404: ({ params }) => <p>No note with the id {params.noteId} exists</p>,
      }}
    />
  )
}
