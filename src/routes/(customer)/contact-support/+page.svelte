<script type="ts">
	import * as Card from '$lib/components/ui/card/index.ts';
	import { Button } from '$lib/components/ui/button/index.ts';
	import { Input } from '$lib/components/ui/input/index.ts';
	import { Label } from '$lib/components/ui/label/index.ts';
</script>

<div class="container max-w-100">
	<div class="flex-1 space-y-4">
		<Card.Root class="col-span-4 mx-auto max-w-xl">
			<Card.Header>
				<Card.Title>Customer Support</Card.Title>
			</Card.Header>
			<Card.Content>
				<div class="grid gap-4">
					<div class="grid gap-2">
						<Label for="full-name">Full Name</Label>
						<Input id="full-name" placeholder="Max Robinson" required />
					</div>
					<div class="grid gap-2">
						<Label for="email">Email</Label>
						<Input id="email" type="email" placeholder="m@example.com" required />
					</div>
					<div class="grid gap-2">
						<Label for="subject">Subject</Label>
						<Input id="subject" placeholder="Briefly describe your issue" required />
					</div>
					<div class="grid gap-2">
						<Label for="message">Message</Label>
						<textarea
							id="message"
							placeholder="Explain your issue in detail..."
							class="border rounded-md p-2 h-24"
							required
						></textarea>
					</div>
					<Button type="submit" class="w-full">Submit Request</Button>
				</div>
			</Card.Content>
		</Card.Root>
	</div>
</div>
