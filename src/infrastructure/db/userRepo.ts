import type { PrismaClient } from "@prisma/client";
import type { CreateUser, IUser, UpdateUser } from "../entity/interface";
import "reflect-metadata";
import { inject, injectable } from "inversify";
import { TYPES } from "../entity/types";

@injectable()
export class UserRepository implements IUser {
	constructor(@inject(TYPES.prisma) private prisma: PrismaClient) {}

	async getAll() {
		const users = await this.prisma.user.findMany();
		return users;
	}

	async getOne(userIdOrEmail: string) {
		const user = await this.prisma.user.findFirst({
			where: {
				OR: [
					{
						id: userIdOrEmail,
					},
					{
						email: userIdOrEmail,
					},
				],
			},
		});

		return user;
	}

	async create(data: CreateUser) {
		const newUser = await this.prisma.user.create({
			data,
		});

		return newUser;
	}

	async update(userId: string, data: UpdateUser) {
		const updatedUser = await this.prisma.user.update({
			where: {
				id: userId,
			},
			data,
		});

		return updatedUser;
	}

	async delete(userId: string) {
		await this.prisma.user.delete({
			where: {
				id: userId,
			},
		});
	}
}
