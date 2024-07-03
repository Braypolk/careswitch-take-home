import { json, error } from '@sveltejs/kit';
import type { RequestHandler } from '@sveltejs/kit';
import { prisma, handlePrismaError } from '$lib/server/db';

export const GET: RequestHandler = async ({ url }) => {
    try {
        const workspaces = await prisma.workspace.findMany();
        return json(workspaces);
    } catch (e) {
        // handle things like json parsing errors
        if (e instanceof Error) {
            throw error(400, e.message);
        }
        // throw prisma error
        handlePrismaError(e);
    }
};

export const POST: RequestHandler = async ({ request }) => {
    try {
        const { name, description } = await request.json();
        if (!name) throw error(400, 'Name is required');
        
        const workspace = await prisma.workspace.create({
            data: { name, description }
        });
        return json(workspace, { status: 201 });
    } catch (e) {
        // handle things like json parsing errors
        if (e instanceof Error) {
            throw error(400, e.message);
        }
        // throw prisma error
        handlePrismaError(e);
    }
};