import { json, error } from '@sveltejs/kit';
import type { RequestHandler } from '@sveltejs/kit';
import { prisma, handlePrismaError } from '$lib/server/db';

export const GET: RequestHandler = async ({ params }) => {
	try {
		const workspaceUsers = await prisma.workspacesOnUsers.findMany({
			where: { workspaceId: params.workspaceId },
			include: { user: true }
		});

		const workspaceUserIds = workspaceUsers.map((u) => u.user.id);
		const usersNotInWorkspace = await prisma.user.findMany({
			where: {
				NOT: {
					id: {
						in: workspaceUserIds
					}
				}
			}
		});
		return json(usersNotInWorkspace);
	} catch (e) {
		// handle things like json parsing errors
		if (e instanceof Error) {
			throw error(400, e.message);
		}
		// throw prisma error
		handlePrismaError(e);
	}
};

export const POST: RequestHandler = async ({ params, request }) => {
	try {
		if (!params.workspaceId) throw error(400, 'Workspace ID is required');
		const { userId } = await request.json();
		if (!userId) throw error(400, 'User ID is required');

		const workspaceUser = await prisma.workspacesOnUsers.create({
			data: {
				userId: userId,
				workspaceId: params.workspaceId
			}
		});
		return json(workspaceUser, { status: 201 });
	} catch (e) {
		// handle things like json parsing errors
		if (e instanceof Error) {
			throw error(400, e.message);
		}
		// throw prisma error
		handlePrismaError(e);
	}
};
