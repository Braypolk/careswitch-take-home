import { json, error } from '@sveltejs/kit';
import type { RequestHandler } from '@sveltejs/kit';
import { prisma, handlePrismaError } from '$lib/server/db';

export const DELETE: RequestHandler = async ({ params }) => {
    const { workspaceId, userId } = params;

    if (!workspaceId || !userId) {
        throw error(400, 'Workspace ID and User ID are required');
    }

    try {
        await prisma.workspacesOnUsers.delete({
            where: {
                userId_workspaceId: {
                    userId,
                    workspaceId
                }
            }
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