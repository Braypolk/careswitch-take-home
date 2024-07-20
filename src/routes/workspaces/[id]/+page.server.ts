import { prisma } from '$lib/server/db';
import type { PageServerLoad, Actions } from './$types';
import { fail, message, superValidate } from 'sveltekit-superforms';
import { workspaceFormSchema } from '$lib/form/schema';
import { zod } from 'sveltekit-superforms/adapters';
import { generateTag } from '$lib/utils';


export const load: PageServerLoad = async () => {
	return {
		workspaceForm: await superValidate(zod(workspaceFormSchema))
	};
};

export const actions: Actions = {
	editWorkspace: async (event) => {
		console.log(event);
		const {params: {id}} = event;
		const {request} = event;
		const form = await superValidate(event, zod(workspaceFormSchema));
		console.log(form);
		if (!form.valid) {
			return fail(400, {
				form
			});
		}
		
		const updatedWorkspace = await prisma.workspace.update({
			where: { id: id },
			data: { ...form.data, tag: generateTag(form.data.name) }
		});
		return message(form, 'Successfully edited workspace: ' + form.data.name);
	}
};
