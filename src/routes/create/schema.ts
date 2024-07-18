import { z } from 'zod';

export const formSchema = z.object({
	firstName: z.string().refine((v) => v, { message: "A first name is required." }),
	lastName: z.string().refine((v) => v, { message: "A last name is required." }),
	startDate: z.date().refine((v) => v, { message: "A start date is required." }),
	jobTitle: z.string().refine((v) => v, { message: "A job title is required." }),
	vacationDays: z.number().refine((v) => v, { message: "A number is required." }),
});

export const workspaceFormSchema = z.object({
	name: z.string().refine((v) => v, { message: "A name is required." }),
	description: z.string()
});

export type WorkspaceFormSchema = typeof workspaceFormSchema;
export type FormSchema = typeof formSchema;
