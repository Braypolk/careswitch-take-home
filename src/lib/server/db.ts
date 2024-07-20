import { PrismaClient } from '@prisma/client';
import { error } from '@sveltejs/kit';

export const prisma = new PrismaClient();

export function handlePrismaError(e: any): never {
    if (e.code === 'P2002') {
        throw error(409, 'Unique constraint violation');
    } else if (e.code === 'P2025') {
        throw error(404, 'Record not found');
    } else {
        console.error(e);
        throw error(500, 'Internal server error');
    }
}