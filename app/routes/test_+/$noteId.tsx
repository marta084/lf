
import { GeneralErrorBoundary } from '~/components/error-boundary'



export default function NoteTestId() {
	

	return (
		<div>
			<h1 className="text-bold text-lg bg-headertext text-header">
				Title: 
			</h1>
			<div>Content:</div>
		</div>
	)
}

export function ErrorBoundary() {
	return (
		<GeneralErrorBoundary
			statusHandlers={{
				404: ({ params }) => {
					return <p>No note with the id {params.noteId} exists</p>
				},
			}}
		/>
	)
}
