import { Prisma, type PrismaClient } from "@prisma/client";
import type { CreateNote, INote, UpdateNote } from "../entity/interface";
import "reflect-metadata";
import { inject, injectable } from "inversify";
import { TYPES } from "../entity/types";
import { DBError, NotFoundError } from "../entity/error";

@injectable()
export class NoteRepository implements INote {
	constructor(@inject(TYPES.prisma) private prisma: PrismaClient) {}

	async getAll(userId: string) {
		try {
			const notes = await this.prisma.note.findMany({
				where: {
					authorId: userId,
				},
			});

			return notes;
		} catch (error) {
			if (error instanceof Prisma.PrismaClientKnownRequestError) {
				throw new DBError("Error getting resources from DB");
			}

			throw new DBError("something went wrong while doing DB Operation");
		}
	}

	async getOne(id: string) {
		try {
			const note = await this.prisma.note.findUnique({
				where: {
					id,
				},
			});

			if (!note) {
				throw new NotFoundError("Note not found");
			}

			return note;
		} catch (error) {
			if (error instanceof NotFoundError) {
				throw error;
			}
			throw new DBError("Database error");
		}
	}

	async create(data: CreateNote) {
		try {
			const newNote = await this.prisma.note.create({
				data,
			});

			return newNote;
		} catch (error) {
			if (error instanceof Prisma.PrismaClientKnownRequestError) {
				throw new DBError("Error getting resources from DB");
			}

			throw new DBError("something went wrong while doing DB Operation");
		}
	}

	async update(noteId: string, data: UpdateNote) {
		try {
			const updatedNote = await this.prisma.note.update({
				where: {
					id: noteId,
				},
				data,
			});

			return updatedNote;
		} catch (error) {
			if (error instanceof Prisma.PrismaClientKnownRequestError) {
				throw new DBError("Error getting resources from DB");
			}

			throw new DBError("something went wrong while doing DB Operation");
		}
	}

	async delete(noteId: string) {
		try {
			await this.prisma.note.delete({
				where: {
					id: noteId,
				},
			});
		} catch (error) {
			if (error instanceof Prisma.PrismaClientKnownRequestError) {
				throw new DBError("Error getting resources from DB");
			}

			throw new DBError("something went wrong while doing DB Operation");
		}
	}
}
