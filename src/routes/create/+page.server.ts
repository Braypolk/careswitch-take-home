import { prisma } from '$lib/server/db';
import type { PageServerLoad, Actions } from './$types';
import { fail, message, superValidate } from 'sveltekit-superforms';
import { formSchema, workspaceFormSchema } from '../../lib/form/schema';
import { zod } from 'sveltekit-superforms/adapters';
import { generateTag } from '$lib/utils';

export const load: PageServerLoad = async () => {
	return {
		userForm: await superValidate(zod(formSchema)),
		workspaceForm: await superValidate(zod(workspaceFormSchema))
	};
};

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
				tag: generateTag(form.data.firstName + ' ' + form.data.lastName),
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
			data: { ...form.data, tag: generateTag(form.data.name) }
		});
		return message(form, 'Successfully created workspace: ' + form.data.name);
	}
};
