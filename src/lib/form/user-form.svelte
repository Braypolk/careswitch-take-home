<script lang="ts">
	import * as Form from '$lib/components/ui/form';
	import * as Popover from '$lib/components/ui/popover';
	import { Input } from '$lib/components/ui/input';

	import { zodClient } from 'sveltekit-superforms/adapters';
	import { type SuperValidated, type Infer, superForm } from 'sveltekit-superforms';
	// import { userFormSchema, type UserFormSchema } from './schema';
	import {
		formSchema as userFormSchema,
		type FormSchema,
		type WorkspaceFormSchema
	} from './schema';
	import CalendarIcon from 'lucide-svelte/icons/calendar';

	import { Calendar } from '$lib/components/ui/calendar/index.js';
	import { Button, buttonVariants } from '$lib/components/ui/button/index.js';
	import {
		DateFormatter,
		type DateValue,
		fromDate,
		getLocalTimeZone,
		today
	} from '@internationalized/date';
	import { Toaster, toast } from 'svelte-sonner';
	import { cn } from '$lib/utils.js';

	let {
		data,
		submitRoute,
		formSchema,
		submitted = $bindable(),
		edit = true
	}: {
		data: SuperValidated<Infer<FormSchema>> | SuperValidated<Infer<WorkspaceFormSchema>>;
		submitRoute: string;
		formSchema: FormSchema | WorkspaceFormSchema;
		submitted?: boolean;
		edit?: boolean;
	} = $props();


	const form = superForm(data, {
		validators: zodClient(formSchema),
		resetForm: submitted !== undefined ? false : true,
		taintedMessage: null,
		onUpdated: ({ form: f }) => {},
		onResult: ({ result }) => {
			if (result.status === 200) {
				toast.success(`${result.data.form.message}`);
				if (submitted === undefined) {
					value = today(getLocalTimeZone());
				}
				submitted = true;
			} else {
				toast.error('Please fix the errors in the form.');
			}
		}
	});

	const { form: formData, enhance } = form;

	const df = new DateFormatter('en-US', {
		dateStyle: 'long'
	});

	let value: DateValue | undefined = $state(
		$formData.startDate !== undefined
			? fromDate($formData.startDate, Intl.DateTimeFormat().resolvedOptions().timeZone)
			: today(getLocalTimeZone())
	);

	if (data.data.vacationDays) {
		if ($formData.startDate === undefined) {
			$formData.startDate = value.toDate(getLocalTimeZone());
		}
	}
</script>

<form method="POST" action={submitRoute} use:enhance>
	{#each Object.keys($formData) as entry}
		<Form.Field {form} name={entry} class="mt-5">
			<Form.Control let:attrs>
				<Form.Label
					>{entry.replace(/([a-z])([A-Z])/g, '$1 $2').replace(/^./, function (str) {
						return str.toUpperCase();
					})}</Form.Label
				>
				{#if entry === 'startDate'}
					<Popover.Root>
						<Popover.Trigger
							disabled={edit ? false : true}
							{...attrs}
							class={cn(
								buttonVariants({ variant: 'outline' }),
								'flex w-48 justify-start px-4 text-left font-normal',
								!value && 'text-muted-foreground',
								!edit && 'border-background !opacity-100'
							)}
						>
							{value ? df.format(value.toDate(getLocalTimeZone())) : 'Pick a date'}
							{#if edit}
								<CalendarIcon class="ml-auto h-4 w-4 opacity-50" />
							{/if}
						</Popover.Trigger>
						<Popover.Content class="w-auto p-0">
							<Calendar
								bind:value
								calendarLabel={entry}
								initialFocus
								onValueChange={(v) => {
									$formData[entry] = v?.toDate(getLocalTimeZone());
								}}
							/>
						</Popover.Content>
					</Popover.Root>
					<input hidden value={$formData[entry]} name={attrs.name} />
				{:else if entry === 'vacationDays'}
					<Input
						disabled={edit ? false : true}
						type="number"
						class={cn('w-full', !edit && '!cursor-auto border-background !opacity-100')}
						{...attrs}
						placeholder={0}
						bind:value={$formData[entry]}
					/>
				{:else}
					<Input
						disabled={edit ? false : true}
						class={cn('w-full', !edit && '!cursor-auto border-background !opacity-100')}
						{...attrs}
						placeholder="enter text"
						bind:value={$formData[entry]}
					/>
				{/if}
			</Form.Control>
			<Form.FieldErrors />
		</Form.Field>
	{/each}
	{#if edit}
		<Button
			type="submit"
			on:click={() => {
				if (submitted !== undefined) {
					submitted = false;
				}
			}}>Submit</Button
		>
	{/if}
</form>
<Toaster />
