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

export const DELETE: RequestHandler = async ({ params }) => {
	try {
		const removeUsersRes = await prisma.workspacesOnUsers.deleteMany({
			where: {
			  workspaceId: params.workspaceId
			}
		  });
		const res = await prisma.workspace.delete({
			where: { id: params.workspaceId }
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
