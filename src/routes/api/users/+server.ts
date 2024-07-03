import { json, error } from '@sveltejs/kit';
import type { RequestHandler } from '@sveltejs/kit';
import { prisma, handlePrismaError } from '$lib/server/db';

export const GET: RequestHandler = async ({ url }) => {
    try {
        const users = await prisma.user.findMany();
        return json(users);
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
        const { name } = await request.json();
        if (!name) throw error(400, 'Name is required');
        
        const user = await prisma.user.create({
            data: { name }
        });
        return json(user, { status: 201 });
    } catch (e) {
        // handle things like json parsing errors
        if (e instanceof Error) {
            throw error(400, e.message);
        }
        // throw prisma error
        handlePrismaError(e);
    }
};