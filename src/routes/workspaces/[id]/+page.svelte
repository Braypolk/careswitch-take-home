<script lang="ts">
	import { Button, buttonVariants } from '$lib/components/ui/button';
	import ArrowLeft from 'lucide-svelte/icons/arrow-left';
	import { onMount } from 'svelte';
	import { page } from '$app/stores';
	import DataTable from '$lib/components/data-table/data-table.svelte';
	import { Input } from '$lib/components/ui/input';
	import * as Avatar from '$lib/components/ui/avatar';
	import * as Dialog from '$lib/components/ui/dialog';
	import { dbApiCall } from '$lib/utils';
	import UserForm from '$lib/form/user-form.svelte';
	import { workspaceFormSchema } from '$lib/form/schema';
	import { goto } from '$app/navigation';
	import { Toaster, toast } from 'svelte-sonner';
	import { Skeleton } from '$lib/components/ui/skeleton/index.js';

	let workspace = $state({});
	let users: [] = $state([]);
	let currentNumberOfUsers = $state(0);
	let addUserTabActive = $state(false);
	let isLoading = $state(true);
	let pageloaded = $state(false);
	let filterValueProp = $state('');
	let selectedUsers = $state([]);
	let edit = $state(false);
	let submitted = $state(false);
	let confirmString = $state('');
	let dialogOpen = $state(false);
	let { data } = $props();

	$effect(() => {
		if (submitted) {
			edit = false;
			fetchWorkspaces();
			submitted = false;
		}
	});

	onMount(async () => {
		await fetchWorkspaces();
		data.workspaceForm.data.description = workspace.description;
		data.workspaceForm.data.name = workspace.name;
		pageloaded = true;
	});

	async function getUsersNotInWorkspace() {
		try {
			isLoading = true;
			const resUsersJson: [] | Error = await dbApiCall(
				`/api/workspaces/${$page.params.id}/not-users`
			);
			users = resUsersJson;
			isLoading = false;
		} catch (error) {
			console.log(error);
		}
	}

	async function fetchWorkspaces() {
		try {
			isLoading = true;
			// return workspace information along with users assigned to the workspace
			const resWorkspaceJson: {} | Error = await dbApiCall(`/api/workspaces/${$page.params.id}`);
			const resUsersJson: [] | Error = await dbApiCall(`/api/workspaces/${$page.params.id}/users`);

			workspace = resWorkspaceJson;
			users = resUsersJson;
			currentNumberOfUsers = users.length; // User
			isLoading = false;
		} catch (error) {
			console.log(error);
		}
	}

	async function changeUsersInWorkspace(callType: string) {
		try {
			console.log({
				userIds: selectedUsers
			});
			
			isLoading = true;
			const res = await dbApiCall(`/api/workspaces/${$page.params.id}/users`, callType, {
				userIds: selectedUsers
			});

			const dbUsersRes: [] | Error = await dbApiCall(
				`/api/workspaces/${$page.params.id}/${callType === 'POST' ? 'not-users' : 'users'}`
			);

			users = dbUsersRes;
			isLoading = false;
		} catch (error) {
			if (error instanceof Error) {
				return error;
			}
			return new Error('An unknown error occurred');
		}
	}

	async function deleteWorkspace() {
		try {
			toast.promise(
				() =>
					new Promise((resolve) =>
						dbApiCall(`/api/workspaces/${$page.params.id}`, 'DELETE').then(resolve)
					),
				{
					loading: 'Deleting workspace',
					success: 'Successfully deleted workspace',
					error: 'Error',
					onAutoClose: () => goto('/workspaces')
				}
			);
		} catch (error) {
			console.log(error);
		}
	}
</script>

<Toaster duration={800} />
<div class="container mx-auto p-4">
	<div class="mt-10 flex">
		<div>
			<a
				class="inline-flex items-center justify-center whitespace-nowrap rounded-md bg-accent px-2 py-1 align-text-top text-secondary-foreground ring-offset-background transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50"
				href="/workspaces"><ArrowLeft /></a
			>
		</div>
		{#if pageloaded}
			<Avatar.Root class="ml-4">
				<Avatar.Fallback>{workspace.tag}</Avatar.Fallback>
			</Avatar.Root>
			{#if edit}
				<!-- todo: on submit, change edit to false and update page with new data, also do this same thing on the users[id] page -->
				<UserForm
					data={data.workspaceForm}
					submitRoute="?/editWorkspace"
					formSchema={workspaceFormSchema}
					bind:submitted
				></UserForm>
			{:else}
				<div class="ml-2 inline-block align-top">
					<h1 class="text-2xl font-bold">{workspace.name}</h1>
					<p class="text-muted-foreground">{workspace.description}</p>
				</div>
			{/if}
		{:else}
			<Skeleton class="ml-4 h-10 w-10 rounded-full" />
			<div class="ml-2 inline-block w-full align-top">
				<Skeleton class="mb-1 h-7 max-w-48" />
				<Skeleton class="h-6 w-8/12 min-w-48" />
			</div>
		{/if}
	</div>
	<Button class="absolute right-20 top-4" variant="outline" on:click={() => (edit = !edit)}
		>Edit</Button
	>

	<div class="mt-8">
		<div class="flex gap-1 border-b border-secondary">
			<button
				onclick={() => {
					if (addUserTabActive) {
						filterValueProp = '';
						addUserTabActive = false;
						fetchWorkspaces();
					}
				}}
				class={!addUserTabActive
					? 'grow-[2] cursor-pointer border-b border-accent-foreground py-3 text-center transition-all'
					: 'grow-[2] cursor-pointer py-3 text-center transition-all hover:border-b-2 hover:border-accent hover:pb-[.625rem]'}
				>Users</button
			>
			<button
				onclick={() => {
					if (!addUserTabActive) {
						filterValueProp = '';
						addUserTabActive = true;
						getUsersNotInWorkspace();
					}
				}}
				class={addUserTabActive
					? 'grow cursor-pointer border-b border-accent-foreground py-3 text-center transition-all'
					: 'grow cursor-pointer py-3 text-center transition-all hover:border-b-2 hover:border-accent hover:pb-[.625rem]'}
				>Add Users</button
			>
		</div>
		<div class="flex">
			<Input
				class="my-4 grow"
				placeholder="Filter by Name..."
				type="text"
				bind:value={filterValueProp}
			/>
			{#if addUserTabActive}
				{#if selectedUsers.length > 0}
					<div class="mt-4 grow-0 space-x-2">
						<Button on:click={() => changeUsersInWorkspace('POST')}>Add to Workspace</Button>
					</div>
				{/if}
			{:else if selectedUsers.length > 0}
				<div class="mt-4 grow-0 space-x-2">
					<Button variant="destructive" on:click={() => changeUsersInWorkspace('DELETE')}
						>Remove Selected</Button
					>
				</div>
			{/if}
		</div>
		{#if !isLoading}
			<DataTable
				data={users}
				{filterValueProp}
				hover={false}
				selectable={true}
				bind:selectedUsers
			/>
		{:else}
			<div class="h-80">
				<Skeleton class="h-12 w-full rounded-b-none border bg-background" />
				<Skeleton class="h-16 w-full rounded-none bg-secondary pb-[1px]" />
				<Skeleton class="h-16 w-full rounded-none bg-secondary pb-[1px]" />
				<Skeleton class="h-16 w-full rounded-t-none bg-secondary pb-[1px]" />
			</div>
		{/if}
	</div>
	<div class="mt-8"></div>
	<Dialog.Root bind:open={dialogOpen}>
		<Dialog.Trigger class={buttonVariants({ variant: 'destructive' })}
			>Delete Workspace</Dialog.Trigger
		>
		<Dialog.Content class="sm:max-w-[425px]">
			<Dialog.Header>
				<Dialog.Description>
					Type "{workspace.name}" to confirm.
				</Dialog.Description>
			</Dialog.Header>
			<div class="grid gap-4 py-4">
				<div class="grid grid-cols-4 items-center gap-4">
					<Input id="name" bind:value={confirmString} class="col-span-3" />
				</div>
			</div>
			<Dialog.Footer class="sm:justify-start">
				<Button
					on:click={() => deleteWorkspace()}
					disabled={confirmString === workspace.name ? false : true}
					type="submit"
					variant="destructive">Delete Workspace</Button
				>
			</Dialog.Footer>
		</Dialog.Content>
	</Dialog.Root>
</div>
