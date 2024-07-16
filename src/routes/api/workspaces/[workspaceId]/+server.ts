import { json, error } from '@sveltejs/kit';
import type { RequestHandler } from '@sveltejs/kit';
import { prisma, handlePrismaError } from '$lib/server/db';

export const GET: RequestHandler = async ({ params }) => {
	try {
		const workspace = await prisma.workspace.findUnique({
			where: {
				id: params.workspaceId
			}
		});

		if (!workspace) throw error(404, 'Workspace not found');

		return json(workspace);
	} catch (e) {
		// handle things like json parsing errors
		if (e instanceof Error) {
			throw error(400, e.message);
		}
		// throw prisma error
		handlePrismaError(e);
	}
};

export const PUT: RequestHandler = async ({ params, request }) => {
	try {
		const { name, description } = await request.json();
		if (!name) throw error(400, 'Name is required');

		const workspace = await prisma.workspace.update({
			where: { id: params.id },
			data: { name, description }
		});
		return json(workspace);
	} catch (e) {
		// handle things like json parsing errors
		if (e instanceof Error) {
			throw error(400, e.message);
		}
		// throw prisma error
		handlePrismaError(e);
	}
};

export const DELETE: RequestHandler = async ({ params }) => {
	try {
		await prisma.workspace.delete({
			where: { id: params.id }
		});
		return json({ success: true });
	} catch (e) {
		// handle things like json parsing errors
		if (e instanceof Error) {
			throw error(400, e.message);
		}
		// throw prisma error
		handlePrismaError(e);
	}
};
