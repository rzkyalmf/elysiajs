import type { NoteRepository } from "../../infrastructure/db/noteRepo";
import type {
	CreateNote,
	UpdateNote,
} from "../../infrastructure/entity/interface";
import "reflect-metadata";
import { inject, injectable } from "inversify";
import { TYPES } from "../../infrastructure/entity/types";

@injectable()
export class NoteServices {
	constructor(@inject(TYPES.noteRepo) private noteRepo: NoteRepository) {}

	async getAll(userId: string) {
		const notes = await this.noteRepo.getAll(userId);
		return notes;
	}

	async getOne(id: string) {
		const note = await this.noteRepo.getOne(id);
		return note;
	}

	async create(data: CreateNote) {
		const newNote = await this.noteRepo.create(data);
		return newNote;
	}

	async update(noteId: string, data: UpdateNote) {
		const updatedNote = await this.noteRepo.update(noteId, data);
		return updatedNote;
	}

	async delete(noteId: string) {
		await this.noteRepo.delete(noteId);
	}
}
