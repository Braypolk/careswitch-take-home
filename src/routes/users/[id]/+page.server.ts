import { prisma } from '$lib/server/db';
import type { Actions, PageServerLoad } from './$types';
import { fail, message, superValidate } from 'sveltekit-superforms';
import { formSchema } from '$lib/form/schema';
import { zod } from 'sveltekit-superforms/adapters';
import { generateTag } from '$lib/utils';

export const load = (async ({ params: { id } }) => {
	const response = await prisma.user.findUnique({
		where: { id: id },
		include: {
			workspaces: {
				select: {
					workspace: {
						select: {
							name: true,
							tag: true,
							id: true
						}
					}
				}
			}
		}
	});
	console.log(response);

	return { user: response, userForm: await superValidate(zod(formSchema)) };
}) satisfies PageServerLoad;

export const actions: Actions = {
	editUser: async (event) => {
		console.log(event);
		const {
			params: { id }
		} = event;
		const { request } = event;
		const form = await superValidate(event, zod(formSchema));
		console.log(form);
		if (!form.valid) {
			return fail(400, {
				form
			});
		}

		const updatedUser = await prisma.user.update({
			where: { id: id },
			data: {
				...form.data,
				email: form.data.firstName + '.' + form.data.lastName + '@example.com',
				tag: generateTag(form.data.firstName + ' ' + form.data.lastName)
			}
		});
		return message(form, 'Successfully edited user: ' + form.data.firstName);
	}
};
