<!-- src/routes/create/+page.svelte -->
<script lang="ts">
	import { Tabs, TabsContent, TabsList, TabsTrigger } from '$lib/components/ui/tabs';
	import { formSchema, workspaceFormSchema } from './schema';
	import UserForm from './user-form.svelte';

	let { data } = $props();
</script>

<div class="container mx-auto p-4">
	<h1 class="mb-4 text-2xl font-bold">Create User or Workspace</h1>
	<Tabs defaultValue="user" class="data-[state=active]:bg-primary">
		<TabsList >
			<TabsTrigger value="user">Create User</TabsTrigger>
			<TabsTrigger value="workspace">Create Workspace</TabsTrigger>
		</TabsList>
		<TabsContent value="user">
			<UserForm data={data.userForm} submitRoute="?/createUser" {formSchema} />
		</TabsContent>
		<TabsContent value="workspace">
			<UserForm
				data={data.workspaceForm}
				submitRoute="?/createWorkspace"
				formSchema={workspaceFormSchema}
			/>
		</TabsContent>
	</Tabs>
</div>