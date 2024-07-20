import { json, error } from '@sveltejs/kit';
import type { RequestHandler } from '@sveltejs/kit';
import { prisma, handlePrismaError } from '$lib/server/db';

export const GET: RequestHandler = async ({ params }) => {
    try {
        const users = await prisma.workspacesOnUsers.findMany({
            where: { workspaceId: params.workspaceId },
            include: { user: true }
        });
        return json(users.map(u => u.user));
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
        const { userIds } = await request.json();
        if (!userIds) throw error(400, 'User ID is required');

        const result = await prisma.workspacesOnUsers.createMany({
            data: userIds.map(userId => ({
              userId: userId,
              workspaceId: params.workspaceId
            }))
          });
          console.log(result);
          
        return json(result, { status: 201 });
    } catch (e) {
        // handle things like json parsing errors
        if (e instanceof Error) {
            throw error(400, e.message);
        }
        // throw prisma error
        handlePrismaError(e);
    }
};

export const DELETE: RequestHandler = async ({ params, request }) => {
	try {
        const { userIds } = await request.json();

		const deletedRows = await prisma.workspacesOnUsers.deleteMany({
            where: {
                userId: {
                    in: userIds
                },
                workspaceId: params.workspaceId
            }
        });
		return json(deletedRows);
	} catch (e) {
		// handle things like json parsing errors
		if (e instanceof Error) {
			throw error(400, e.message);
		}
		// throw prisma error
		handlePrismaError(e);
	}
};
