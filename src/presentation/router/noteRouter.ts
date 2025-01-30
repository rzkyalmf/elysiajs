import Elysia, { t } from "elysia";
import { authServices, noteServices } from "../../application/instance";
import { AutorizationError } from "../../infrastructure/entity/error";

export const noteRouter = new Elysia({ prefix: "/v1/notes" })
	// Middleware
	.derive(async ({ headers }) => {
		const sessionId = headers.authorization?.split(" ")[1];

		if (!sessionId) {
			throw new AutorizationError("Session id not provided");
		}

		const { user } = await authServices.decodeSession(sessionId);

		return { user };
	})

	// Routes get all notes (/api/v1/notes)
	.get("/", async ({ user }) => {
		const notes = await noteServices.getAll(user.id);
		return notes;
	})

	// Routes get one note (/api/v1/notes/:id)
	.get("/:id", async ({ params }) => {
		const note = await noteServices.getOne(params.id);
		return note;
	})

	// Routes create note (/api/v1/notes)
	.post(
		"/",
		async ({ body, user, set }) => {
			const { title, content } = body;

			const newNote = await noteServices.create({
				title,
				content,
				authorId: user.id,
			});

			set.status = 201;
			return newNote;
		},
		{
			body: t.Object({
				title: t.String(),
				content: t.String(),
			}),
		},
	)

	// Routes update note (/api/v1/notes/:id)
	.patch(
		"/:id",
		async ({ params, body }) => {
			const { title, content } = body;

			const updatedNote = await noteServices.update(params.id, {
				title,
				content,
			});

			return updatedNote;
		},
		{
			body: t.Object({
				title: t.Optional(t.String()),
				content: t.Optional(t.String()),
			}),
		},
	)

	// Routes delete note (/api/v1/notes/:id)
	.delete("/:id", async ({ params, set }) => {
		set.status = 204;
		await noteServices.delete(params.id);
	});
