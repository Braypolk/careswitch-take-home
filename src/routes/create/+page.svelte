<!-- src/routes/create/+page.svelte -->
<script lang="ts">
	import { Tabs, TabsContent, TabsList, TabsTrigger } from '$lib/components/ui/tabs';
	import { formSchema, workspaceFormSchema } from '../../lib/form/schema';
	import UserForm from '$lib/form/user-form.svelte';

	let { data } = $props();
</script>

<div class="container relative mx-auto h-full p-4">
	<h1 class="mb-4 text-2xl font-bold">Create User or Workspace</h1>
	<div class="mt-16 flex items-center">
		<Tabs defaultValue="user" class="mx-auto w-80 data-[state=active]:bg-primary">
			<TabsList>
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
</div>
