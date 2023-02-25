import type { ActionArgs } from "@remix-run/node";
import { redirect } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";

import NewNote, { links as newNoteLinks } from "~/components/newNote";
import NoteList, { links as noteListLinks } from "~/components/noteList";

import { getStoredNotes, storeNotes } from "~/data/notes";

export default function Notes() {
  const notes = useLoaderData();

  return (
    <main>
      <NewNote />
      <NoteList notes={notes} />
    </main>
  );
}

export async function loader() {
  const notes = await getStoredNotes()
  return notes
}

type Note = { 
  id: string, 
  title: string, 
  content: string 
}

export async function action({ request }: ActionArgs) {
  const formData = await request.formData();
   const noteData = Object.fromEntries(formData) as Note;

  // Add validation
  if (noteData.title.trim().length < 5) {
    return { 
      message: 'Invalid title - must be at least 5 characters long.'
    };
  }

  const existingNotes = await getStoredNotes();
  noteData.id = new Date().toISOString();
  const updateNotes = existingNotes.concat(noteData);
  await storeNotes(updateNotes);

  return redirect('/notes')
}

export function links() {
  return [...newNoteLinks(), ...noteListLinks()]
}
