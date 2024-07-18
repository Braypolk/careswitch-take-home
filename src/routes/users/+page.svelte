<script lang="ts">
	import { onMount } from 'svelte';

	import { Button } from '$lib/components/ui/button';
	import { Input } from '$lib/components/ui/input';
	import { Skeleton } from '$lib/components/ui/skeleton/index.js';
	import * as Card from '$lib/components/ui/card';
	import * as Select from '$lib/components/ui/select';
	import * as Collapsible from '$lib/components/ui/collapsible';
	import * as Avatar from '$lib/components/ui/avatar';
	import DataTable from '$lib/components/data-table/data-table.svelte';

	import ChevronDown from 'lucide-svelte/icons/chevron-down';
	import ChevronUp from 'lucide-svelte/icons/chevron-up';
	import SquareArrowOutUpRight from 'lucide-svelte/icons/square-arrow-out-up-right';

	import { dbApiCall } from '$lib/utils';

	let users: [] | Error = $state([]);
	let workspaces: [] | Error = $state([]);
	let selectedWorkspace = $state('');
	let selectedUserId = $state('');
	let filterValueProp = $state('');
	let infoOpen = $state(true);
	let isLoading = $state(true);

	let selectedUser = $derived.by(() => {
		for (let i = 0; i < users.length; i++) {
			if (users[i].id === selectedUserId) {
				return users[i];
			}
		}
	});

	// make api calls to get users and the workspaces they're in and full list of workspaces
	onMount(async () => {
		const usersRes = await dbApiCall('/api/users/inworkspaces');
		if (usersRes instanceof Error) {
			// todo: handle error
			console.error(usersRes.message);
		} else {
			users = usersRes;
		}
		const workspacesRes = await dbApiCall('/api/workspaces');
		if (workspacesRes instanceof Error) {
			// todo: handle error
			console.error(workspacesRes.message);
		} else {
			workspaces = workspacesRes;
		}

		selectedUserId = users[0].id;
		infoOpen = selectedUser ? true : false;
		isLoading = false;
	});
</script>

<div class="container mx-auto p-4">
	<h1 class="mb-4 text-2xl font-bold">Users</h1>
	<Collapsible.Root bind:open={infoOpen}>
		<Collapsible.Trigger class="block h-8 w-full rounded-t-lg bg-secondary">
			{#if infoOpen}
				<ChevronDown class="mx-auto" />
			{:else}
				<ChevronUp class="mx-auto" />
			{/if}
		</Collapsible.Trigger>
		{#if isLoading}
			<Collapsible.Content>
				<Card.Root class="h-60 overflow-y-scroll  rounded-t-none">
					<Card.Header class="flex flex-row gap-3">
						<Skeleton class="my-auto h-12 w-12 rounded-full" />
						<div>
							<Skeleton class="mb-1 h-9 w-64" />
							<Skeleton class="h-5 w-64" />
						</div>
					</Card.Header>
					<Card.Content>
						<Skeleton class="mb-1 h-6 w-64" />
						<Skeleton class="mb-6 h-6 w-64" />
						<Skeleton class="mb-1 h-6 w-64" />
						<Skeleton class="mb-6 h-6 w-64" />
						<Skeleton class="mb-1 h-6 w-64" />
						<Skeleton class="mb-6 h-6 w-64" />
					</Card.Content>
				</Card.Root>
			</Collapsible.Content>
		{:else}
			<Collapsible.Content>
				<Card.Root class="h-60 overflow-scroll rounded-t-none">
					<Card.Header>
						<div class="flex justify-between">
							<div class="flex gap-3">
								<Avatar.Root class="my-auto h-12 w-12">
									<Avatar.Fallback>{selectedUser.tag}</Avatar.Fallback>
								</Avatar.Root>
								<div>
									<Card.Title class="text-3xl"
										>{selectedUser.firstName} {selectedUser.lastName}</Card.Title
									>
									<Card.Description
										onclick={() => {
											console.log('# todo: copy to clip board');
										}}>{selectedUser.email}</Card.Description
									>
								</div>
							</div>
							<Button variant="ghost" class="h-9 w-9 px-2 py-2" href="/users/{selectedUser.id}"
								><SquareArrowOutUpRight class="h-full w-full" data-sveltekit-prefetch /></Button
							>
						</div>
					</Card.Header>
					<Card.Content>
						<p class="text-muted-foreground">id:</p>
						<p class="pb-6">{selectedUser.id}</p>
						<p class="text-muted-foreground">Start Date:</p>
						<p class="pb-6">{selectedUser.startDate}</p>
						<p class="text-muted-foreground">Job Title:</p>
						<p class="pb-6">{selectedUser.jobTitle}</p>
						<p class="text-muted-foreground">Vacation Days:</p>
						<p class="pb-6">{selectedUser.vacationDays}</p>
						<h3 class="text-2xl font-semibold text-muted-foreground">Workspaces:</h3>
						<ul>
							{#each selectedUser.workspaces as workspace}
								<li>{workspace.name}</li>
							{/each}
						</ul>
					</Card.Content>
				</Card.Root>
			</Collapsible.Content>
		{/if}
	</Collapsible.Root>

	<div>
		<div class="flex items-center justify-center py-4">
			<Input
				class="max-w-sm"
				placeholder="Filter by Name..."
				type="text"
				bind:value={filterValueProp}
			/>
		</div>
		{#if !isLoading}
			<DataTable data={users} selectable={false} {filterValueProp} bind:selectedUserId />
		{/if}
	</div>
</div>
