import type { SessionRepository } from "../../infrastructure/db/sessionRepo";
import type { UserRepository } from "../../infrastructure/db/userRepo";
import "reflect-metadata";
import { inject, injectable } from "inversify";
import { TYPES } from "../../infrastructure/entity/types";
import { UserDTO } from "../dtos/userDTO";

@injectable()
export class AuthServices {
	constructor(
		@inject(TYPES.userRepo) private userRepo: UserRepository,
		@inject(TYPES.sessionRepo) private sessionRepo: SessionRepository,
	) {}

	async registerUser(name: string, email: string, password: string) {
		const user = await this.userRepo.getOne(email);

		if (user) {
			throw new Error("User already exists");
		}

		const hashedPassword = await Bun.password.hash(password);
		const newUser = await this.userRepo.create({
			name,
			email,
			password: hashedPassword,
			avatar: "",
		});

		return new UserDTO(newUser).fromEntity();
	}

	async loginUser(email: string, password: string) {
		const user = await this.userRepo.getOne(email);

		if (!user) {
			throw new Error("User not found");
		}

		const matchPassword = await Bun.password.verify(password, user.password);

		if (!matchPassword) {
			throw new Error("Invalid password");
		}

		const session = await this.sessionRepo.create(user.id);

		return session;
	}

	async checkSession(sessionId: string) {
		const session = await this.sessionRepo.getOne(sessionId);
		if (!session) {
			throw new Error("Session invalid");
		}
		return "valid";
	}

	async decodeSession(sessionId: string) {
		const session = await this.sessionRepo.getOne(sessionId);

		if (!session) {
			throw new Error("Session invalid");
		}

		const user = await this.userRepo.getOne(session.userId);

		return { user };
	}
}
