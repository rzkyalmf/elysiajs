import { Elysia } from "elysia";
import { authRouter } from "./presentation/router/authRouter";
import { noteRouter } from "./presentation/router/noteRouter";
import cors from "@elysiajs/cors";
import swagger from "@elysiajs/swagger";

const app = new Elysia()
	.use(cors())
	.use(
		swagger({
			path: "/docs",
		}),
	)
	.group("/api", (app) => app.use(authRouter).use(noteRouter))
	.listen(8000);
