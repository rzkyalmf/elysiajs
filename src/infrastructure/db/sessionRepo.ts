import type { ISession } from "../entity/interface";
import { Prisma, type PrismaClient } from "@prisma/client";
import "reflect-metadata";
import { inject, injectable } from "inversify";
import { TYPES } from "../entity/types";
import { DBError, NotFoundError } from "../entity/error";

@injectable()
export class SessionRepository implements ISession {
	constructor(@inject(TYPES.prisma) private prisma: PrismaClient) {}

	async getOne(sessionId: string) {
		try {
			const session = await this.prisma.session.findUnique({
				where: {
					id: sessionId,
				},
			});

			if (!session) {
				throw new NotFoundError("Session not found");
			}

			return session;
		} catch (error) {
			if (error instanceof NotFoundError) {
				throw error;
			}
			throw new DBError("Database error");
		}
	}

	async create(userId: string) {
		try {
			const session = await this.prisma.session.create({
				data: {
					user: {
						connect: {
							id: userId,
						},
					},
				},
			});

			return session;
		} catch (error) {
			if (error instanceof Prisma.PrismaClientKnownRequestError) {
				throw new DBError("Error getting resources from DB");
			}

			throw new DBError("something went wrong while doing DB Operation");
		}
	}

	async delete(sessionId: string) {
		try {
			await this.prisma.session.delete({
				where: {
					id: sessionId,
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
