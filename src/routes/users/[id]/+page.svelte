<script lang="ts">
	import { page } from '$app/stores';
	import { goto } from '$app/navigation';
	import * as Avatar from '$lib/components/ui/avatar';
	import * as Tooltip from '$lib/components/ui/tooltip';
	import * as Dialog from '$lib/components/ui/dialog';
	import UserForm from '$lib/form/user-form.svelte';
	import { Button, buttonVariants } from '$lib/components/ui/button';
	import { Toaster, toast } from 'svelte-sonner';
	import { formSchema } from '$lib/form/schema';
	import { Input } from '$lib/components/ui/input';
	import Copy from 'lucide-svelte/icons/copy';
	import ArrowLeft from 'lucide-svelte/icons/arrow-left';
	import { cn, dbApiCall } from '$lib/utils.js';

	let { data } = $props();
	let { user } = $state(data);
	let tempData = $state();
	let dialogOpen = $state(false);
	let confirmString = $state('');

	for (const [key, value] of Object.entries(data.userForm.data)) {
		data.userForm.data[key] = user[key];
	}

	let submitted = $state(false);
	let edit = $state(false);
	$effect(() => {
		console.log(tempData);
	});
	$effect(() => {
		if (submitted) {
			edit = false;
			getUser();
			submitted = false;
		}
	});

	async function getUser() {
		const resUsersJson: [] | Error = await dbApiCall(`/api/users/${$page.params.id}`);
		Object.assign(user, resUsersJson);
	}

	async function deleteUser() {
		try {
			toast.promise(
				() =>
					new Promise((resolve) =>
						dbApiCall(`/api/users/${$page.params.id}`, 'DELETE').then(resolve)
					),
				{
					loading: 'Deleting user',
					success: 'Successfully deleted user',
					error: 'Error',
					onAutoClose: () => goto('/users')
				}
			);
		} catch (error) {
			console.log(error);
		}
	}
</script>

<Toaster duration={2000} />
<div class="container mx-auto p-4">
	<div class="mt-10 flex items-start gap-16">
		<div>
			<a
				class="inline-flex items-center justify-center whitespace-nowrap rounded-md bg-accent px-2 py-1 align-text-top text-secondary-foreground ring-offset-background transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50"
				href="/users"><ArrowLeft /></a
			>
			<div class="mt-9">
				<Avatar.Root class="mx-auto h-32 w-32">
					<Avatar.Fallback>{user.tag}</Avatar.Fallback>
				</Avatar.Root>
			</div>
			<div
				class="no-wrap mt-4 flex cursor-pointer items-center justify-center rounded-sm p-2 hover:bg-secondary"
				on:click={() => navigator.clipboard.writeText(user.email)}
			>
				<p class="text-muted-foreground">
					{user?.email}
				</p>
				<Copy class="h-4" />
			</div>
		</div>

		<div class="w-8/12 max-w-[600px]">
			<UserForm data={data.userForm} submitRoute="?/editUser" {formSchema} bind:submitted {edit}
			></UserForm>
			{#if !edit}
				<div class="h-10" />
			{/if}
		</div>
	</div>
	<Dialog.Root bind:open={dialogOpen}>
		<Dialog.Trigger
			class={cn(buttonVariants({ variant: 'destructive' }), 'absolute right-44 top-4')}
			>Delete User</Dialog.Trigger
		>
		<Dialog.Content class="sm:max-w-[425px]">
			<Dialog.Header>
				<Dialog.Description>
					Type "{user?.lastName}" to confirm.
				</Dialog.Description>
			</Dialog.Header>
			<div class="grid gap-4 py-4">
				<div class="grid grid-cols-4 items-center gap-4">
					<Input id="name" bind:value={confirmString} class="col-span-3" />
				</div>
			</div>
			<Dialog.Footer class="sm:justify-start">
				<Button
					on:click={() => deleteUser()}
					disabled={confirmString === user?.lastName ? false : true}
					type="submit"
					variant="destructive">Delete User</Button
				>
			</Dialog.Footer>
		</Dialog.Content>
	</Dialog.Root>
	{#if !edit}
		<Button class="absolute right-20 top-4" variant="outline" on:click={() => (edit = !edit)}
			>Edit</Button
		>
	{/if}
	<div class="mx-auto mt-8 w-10/12">
		<h2 class="rounded-t-md bg-secondary py-3 text-center text-xl font-bold">Workspaces</h2>
		<div class="flex border">
			{#each user.workspaces as workspace}
				<Button
					variant="ghost"
					class="m-4 h-20 w-20 p-0"
					href="/workspaces/{workspace.workspace.id}"
				>
					<Tooltip.Root openDelay={0}>
						<Tooltip.Trigger>
							<Avatar.Root class="h-20 w-20">
								<Avatar.Fallback>{workspace.workspace.tag}</Avatar.Fallback>
							</Avatar.Root>
						</Tooltip.Trigger>
						<Tooltip.Content>
							<p>{workspace.workspace.name}</p>
						</Tooltip.Content>
					</Tooltip.Root>
				</Button>
			{/each}
		</div>
	</div>
</div>
