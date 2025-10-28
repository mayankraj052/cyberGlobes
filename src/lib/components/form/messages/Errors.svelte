<script lang="ts">
	export let errorMessages: string[] = [];
</script>

{#if errorMessages.length > 0}
	<div class="mb-4">
		<div class="font-medium text-red-600">Whoops! Something went wrong.</div>
		<ul class="mt-3 list-disc list-inside text-sm text-red-600">
			{#each errorMessages as message}
				<li>
					{message}
					<!-- {#if message === "Please verify your email address first."}
                        <a href="#" on:click={resendVerificationEmail} class="text-blue-600 underline">Resend verification email</a>
                    {/if} -->
				</li>
			{/each}
		</ul>
	</div>
{/if}
