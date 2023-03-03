import type { ActionArgs } from "@remix-run/node"
import { json } from "@remix-run/node"
import { redirect } from "@remix-run/node"
import { Link, useCatch, useLoaderData } from "@remix-run/react"

import NewNote, { links as newNoteLinks } from "~/components/newNote"
import NoteList, { links as noteListLinks } from "~/components/noteList"

import { getStoredNotes, storeNotes } from "~/data/notes"

export default function Notes() {
  const notes = useLoaderData()

  return (
    <main>
      <NewNote />
      <NoteList notes={notes} />
    </main>
  )
}

export async function loader() {
  const notes = await getStoredNotes()
  if (!notes || notes.length === 0) {
    throw json(
      { message: 'Could not find any notes.'}, 
      { status: 404 }
    )
  }
  return notes
}

export async function action({ request }: ActionArgs) {
  const formData = await request.formData()
   const noteData = Object.fromEntries(formData) as Note

  // Add validation
  if (noteData.title.trim().length < 5) {
    return { 
      message: 'Invalid title - must be at least 5 characters long.'
    }
  }

  const existingNotes = await getStoredNotes()
  noteData.id = new Date().toISOString()
  const updateNotes = existingNotes.concat(noteData)
  await storeNotes(updateNotes)

  return redirect('/notes')
}

export function links() {
  return [...newNoteLinks(), ...noteListLinks()]
}

export function meta() {
  return {
    title: 'All Notes',
    description: 'Manage your notes with ease.'
  }
}

export function CatchBoundary() {
  const errorResponse = useCatch()

  return (
    <main>
      <NewNote />
      <p className="info-message">{errorResponse.data?.message || 'Data not found.'}</p>
    </main>
  )
}

export function ErrorBoundary({ error }: ErrorType) {
  return (
    <main className="error">
      <h1>An related to your notes occured!</h1>
      <p>{error.message}</p>
      <p>Back to <Link to="/">safety</Link>!</p>
    </main>
  )
}

