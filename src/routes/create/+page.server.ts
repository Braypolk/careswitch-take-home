import { json, error, fail } from '@sveltejs/kit';
import type { RequestHandler } from '@sveltejs/kit';
import { prisma, handlePrismaError } from '$lib/server/db';
import type { PageServerLoad, Actions } from './$types';
import { message, superValidate } from 'sveltekit-superforms';
import { formSchema, workspaceFormSchema } from './schema';
import { zod } from 'sveltekit-superforms/adapters';

export const load: PageServerLoad = async () => {
	return {
		userForm: await superValidate(zod(formSchema)),
		workspaceForm: await superValidate(zod(workspaceFormSchema))
	};
};

function generateAltTag(text) {
	const words = text.trim().split(/\s+/); // Split the text into words based on whitespace
	// If there is only one word, return the first two letters of that word otherwise return the first letter of the first two word
	if (words.length === 1) {
		return words[0].substring(0, 2);
	} else {
		return words[0][0] + words[1][0];
	}
}

export const actions: Actions = {
	createUser: async (event) => {
		const form = await superValidate(event, zod(formSchema));
		console.log(form);
		if (!form.valid) {
			return fail(400, {
				form
			});
		}
		const createdUser = await prisma.user.create({
			data: {
				...form.data,
				tag: generateAltTag(form.data.firstName + ' ' + form.data.lastName),
				email: form.data.firstName + '.' + form.data.lastName + '@example.com'
			}
		});
		return message(form, 'Successfully created user: ' + form.data.firstName);
	},
	createWorkspace: async (event) => {
		const form = await superValidate(event, zod(workspaceFormSchema));
		console.log(form);
		if (!form.valid) {
			return fail(400, {
				form
			});
		}
		const createdUser = await prisma.workspace.create({
			data: { ...form.data, tag: generateAltTag(form.data.name) }
		});
		return message(form, 'Successfully created workspace: ' + form.data.name);
	}
};
