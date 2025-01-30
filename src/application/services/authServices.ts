import type { SessionRepository } from "../../infrastructure/db/sessionRepo";
import type { UserRepository } from "../../infrastructure/db/userRepo";
import "reflect-metadata";
import { inject, injectable } from "inversify";
import { TYPES } from "../../infrastructure/entity/types";
import { UserDTO } from "../dtos/userDTO";
import {
	AutorizationError,
	NotFoundError,
} from "../../infrastructure/entity/error";

@injectable()
export class AuthServices {
	constructor(
		@inject(TYPES.userRepo) private userRepo: UserRepository,
		@inject(TYPES.sessionRepo) private sessionRepo: SessionRepository,
	) {}

	async registerUser(name: string, email: string, password: string) {
		try {
			await this.userRepo.getOne(email);
			throw new AutorizationError("User already exists");
		} catch (error) {
			if (error instanceof NotFoundError) {
				const hashedPassword = await Bun.password.hash(password);
				const newUser = await this.userRepo.create({
					name,
					email,
					password: hashedPassword,
					avatar: "",
				});

				return new UserDTO(newUser).fromEntity();
			}
			throw error;
		}
	}

	async loginUser(email: string, password: string) {
		const user = await this.userRepo.getOne(email);
		const matchPassword = await Bun.password.verify(password, user.password);

		if (!matchPassword) {
			throw new AutorizationError("Wrong Password");
		}

		const session = await this.sessionRepo.create(user.id);

		return session;
	}

	async checkSession(sessionId: string) {
		const session = await this.sessionRepo.getOne(sessionId);

		return "valid";
	}

	async decodeSession(sessionId: string) {
		try {
			const session = await this.sessionRepo.getOne(sessionId);
			const user = await this.userRepo.getOne(session.userId);

			return { user };
		} catch (error) {
			if (error instanceof NotFoundError) {
				throw new AutorizationError("Session invalid");
			}
			throw error;
		}
	}
}
