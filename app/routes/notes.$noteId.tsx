import { Link, useLoaderData } from "@remix-run/react"
import type { LoaderArgs, MetaFunction } from "@remix-run/node";
import { json } from "@remix-run/node"

import { getStoredNotes } from "~/data/notes"

import styles from '~/styles/note-details.css'

export default function NotesDetail() {
  const note: Note = useLoaderData()

  return (
    <main id="note-details">
      <header>
        <nav>
          <Link to="/notes">Back to all Notes</Link>
        </nav>
        <h1>{note.title}</h1>
      </header>
      <p id="note-details-content">{note.content}</p>
    </main>
  )
}

export async function loader({ params }: LoaderArgs) {
  const notes = await getStoredNotes()
  const selectedNote = notes.find((item: Note) => item.id === params.noteId)

  if (!selectedNote) {
    throw json({ 
      message: 'Could not find note for id ' + params.noteId,
      status: 404
    })
  }

  return selectedNote
}

export function links() {
  return [{rel: 'stylesheet', href: styles}]
}

export const meta: MetaFunction = ({ data }) => {
  return {
    title: data.title,
    description: data.content
  }
}
