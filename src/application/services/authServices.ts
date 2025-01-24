import type { SessionRepository } from "../../infrastructure/db/sessionRepo";
import type { UserRepository } from "../../infrastructure/db/userRepo";

export class AuthServices {
	private userRepo: UserRepository;
	private sessionRepo: SessionRepository;

	constructor(userRepo: UserRepository, sessionRepo: SessionRepository) {
		this.userRepo = userRepo;
		this.sessionRepo = sessionRepo;
	}

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
		return newUser;
	}
}
