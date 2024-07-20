import { json, error } from '@sveltejs/kit';
import type { RequestHandler } from '@sveltejs/kit';
import { prisma, handlePrismaError } from '$lib/server/db';

export const GET: RequestHandler = async ({ url }) => {
	try {
		const workspacesWithUserCount = await prisma.workspace.findMany({
			include: {
				_count: {
					select: {
						users: true
					}
				}
			}
		});

		return json(workspacesWithUserCount);
	} catch (e) {
		// handle things like json parsing errors
		if (e instanceof Error) {
			throw error(400, e.message);
		}
		// throw prisma error
		handlePrismaError(e);
	}
};
