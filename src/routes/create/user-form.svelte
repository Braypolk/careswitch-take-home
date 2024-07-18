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
	import { DateFormatter, type DateValue, getLocalTimeZone, today } from '@internationalized/date';
	import { Toaster, toast } from 'svelte-sonner';
	import { cn } from '$lib/utils.js';

	let {
		data,
		submitRoute,
		formSchema
	}: {
		data: SuperValidated<Infer<FormSchema>> | SuperValidated<Infer<WorkspaceFormSchema>>;
		submitRoute: string;
		formSchema: FormSchema | WorkspaceFormSchema;
	} = $props();

	if (data.data.vacationDays) {
		// default start date to today
		data.data.startDate = new Date(
			new Date().getFullYear(),
			new Date().getMonth(),
			new Date().getDate()
		);
		data.data.vacationDays = 10;
	}

	const form = superForm(data, {
		validators: zodClient(formSchema),
		taintedMessage: null,
		onUpdated: ({ form: f }) => {},
		onResult: ({ result }) => {
			console.log(result);
			if (result.status === 200) {
				toast.success(`${result.data.form.message}`);
				value = today(getLocalTimeZone());
			} else {
				toast.error('Please fix the errors in the form.');
			}
		}
	});

	const { form: formData, enhance } = form;

	const df = new DateFormatter('en-US', {
		dateStyle: 'long'
	});
	let value: DateValue | undefined = $state(today(getLocalTimeZone()));

	if (data.data.vacationDays) {
		$formData.startDate = value.toDate(getLocalTimeZone());
	}
</script>

<form method="POST" action={submitRoute} use:enhance>
	{#each Object.keys($formData) as entry}
		<Form.Field {form} name={entry} class="mt-5">
			<Form.Control let:attrs>
				<Form.Label>{entry.replace(/([a-z])([A-Z])/g, '$1 $2').replace(/^./, function(str){ return str.toUpperCase(); })}</Form.Label>
				{#if entry === 'startDate'}
					<Popover.Root>
						<Popover.Trigger
							{...attrs}
							class={cn(
								buttonVariants({ variant: 'outline' }),
								'w-48 justify-start px-4 text-left font-normal',
								!value && 'text-muted-foreground'
							)}
						>
							{value ? df.format(value.toDate(getLocalTimeZone())) : 'Pick a date'}
							<CalendarIcon class="ml-auto h-4 w-4 opacity-50" />
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
				{:else}
					<Input
						type={typeof $formData[entry] === 'number' ? 'number' : 'text'}
						class="w-fit"
						{...attrs}
						bind:value={$formData[entry]}
					/>
				{/if}
			</Form.Control>
			<Form.FieldErrors />
		</Form.Field>
	{/each}
	<Button type="submit">Submit</Button>
</form>
<Toaster />
