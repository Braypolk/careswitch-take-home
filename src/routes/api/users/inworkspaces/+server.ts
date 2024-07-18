import { PrismaClient } from '@prisma/client';
import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { prisma, handlePrismaError } from '$lib/server/db';


export const GET: RequestHandler = async () => {
  try {
    const usersWithWorkspaces = await prisma.user.findMany({
      include: {
        workspaces: {
          select: {
            workspace: {
                select: {
                    id: true,
                    name: true,
                    tag: true
                }
            }
          }
        }
      }
    });

    const formattedUsers = usersWithWorkspaces.map(user => ({
      ...user,
      workspaces: user.workspaces.map(ws => ws.workspace)
    }));

    return json(formattedUsers);
  } catch (error) {
    console.error('Error fetching users with workspaces:', error);
    return new Response(JSON.stringify({ error: 'Failed to fetch users' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  } finally {
    await prisma.$disconnect();
  }
};