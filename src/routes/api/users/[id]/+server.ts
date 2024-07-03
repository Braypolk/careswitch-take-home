import { json, error } from '@sveltejs/kit';
import type { RequestHandler } from '@sveltejs/kit';
import { prisma, handlePrismaError } from '$lib/server/db';

export const GET: RequestHandler = async ({ params }) => {
    try {
        const user = await prisma.user.findUnique({
            where: { id: params.id }
        });
        if (!user) throw error(404, 'User not found');
        return json(user);
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
        const { name } = await request.json();
        if (!name) throw error(400, 'Name is required');
        
        const user = await prisma.user.update({
            where: { id: params.id },
            data: { name }
        });
        return json(user);
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
        await prisma.user.delete({
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