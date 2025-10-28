<script type="ts">
	import { Button } from '$lib/components/ui/button/index.ts';
	import Icon from '@iconify/svelte';
	import { toast } from 'svelte-sonner';
	import { onMount } from 'svelte';
	
	// Form data
	let name = '';
	let email = '';
	let subject = '';
	let message = '';
	
	// Validation state
	let errors = {
		name: '',
		email: '',
		subject: '',
		message: ''
	};
	
	// Form state
	let isSubmitting = false;
	let formSubmitted = false;
	
	// Validate email format
	function isValidEmail(email) {
		const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
		return emailRegex.test(email);
	}
	
	// Validate form
	function validateForm() {
		let isValid = true;
		errors = {
			name: '',
			email: '',
			subject: '',
			message: ''
		};
		
		if (!name.trim()) {
			errors.name = 'Name is required';
			isValid = false;
		}
		
		if (!email.trim()) {
			errors.email = 'Email is required';
			isValid = false;
		} else if (!isValidEmail(email)) {
			errors.email = 'Please enter a valid email address';
			isValid = false;
		}
		
		if (!subject.trim()) {
			errors.subject = 'Subject is required';
			isValid = false;
		}
		
		return isValid;
	}
	
	// Handle form submission
	async function handleSubmit(e) {
		e.preventDefault();
		if (!validateForm()) {
			return;
		}
		
		isSubmitting = true;
		
		try {
			// Simulate API call with timeout
			await new Promise(resolve => setTimeout(resolve, 1500));
			
			// Reset form
			name = '';
			email = '';
			subject = '';
			message = '';
			formSubmitted = true;
			
			// Show success message
			toast.success('Your message has been sent successfully! We will contact you soon.', { 
				position: 'top-right'
			});
		} catch (error) {
			toast.error('There was an error sending your message. Please try again.', {
				position: 'top-right'
			});
		} finally {
			isSubmitting = false;
		}
	}

    // Hide error message on input
    function hideError() {
        errors.name = '';
        errors.email = '';
        errors.subject = '';
        errors.message = '';
    }

</script>
<section class="py-12">
	<div class="mt-6 max-w-6xl max-lg:max-w-3xl mx-auto bg-primary-900 rounded-lg">
		<div class="grid lg:grid-cols-2 items-center gap-14 sm:p-8 p-4">
			<div>
				<h1 class="text-4xl font-semibold text-white">Get in Touch</h1>
				<p class="text-sm text-gray-300 mt-6 leading-relaxed">
                We’re building the future of geo-intelligence — and we’re just getting started.
                Explore what Cyberglobes can do. Or get in touch to work, partner, or build with us.
				</p>

				<ul class="mt-12 space-y-8">
					<li class="flex items-center">
						<Icon
                            icon="mdi:email-outline"
                            class="text-white h-5 w-5"
                        />  
						<a href="javascript:void(0)" class="text-white text-sm ml-4"> info@cyberglobes.ai </a>
					</li>
					<li class="flex items-center">
						<Icon
                            icon="mdi:phone-in-talk"
                            class="text-white h-5 w-5"
                        />
						<a href="javascript:void(0)" class="text-white text-sm ml-4"> +44 78 6212 6522 </a>
					</li>
					<li class="flex items-center">
						<Icon
                            icon="mdi:map-marker"
                            class="text-white h-5 w-5"
                        />
						<a href="javascript:void(0)" class="text-white text-sm ml-4"> Isarel </a>
					</li>
				</ul>

				<ul class="flex mt-12 space-x-4">
					<li
						class="bg-primary hover:bg-primary-400 h-10 w-10 rounded-full flex items-center justify-center shrink-0"
					>
						<a href="javascript:void(0)">
							<Icon
                                icon="akar-icons:facebook-fill"
                                class="text-white h-5 w-5"
                            />
						</a>
					</li>
					<li
						class="bg-primary hover:bg-primary-400 h-10 w-10 rounded-full flex items-center justify-center shrink-0"
					>
						<a href="javascript:void(0)">
							<Icon
                                icon="akar-icons:instagram-fill"
                                class="text-white h-5 w-5"
                            />
						</a>
					</li>
					<li
						class="bg-primary hover:bg-primary-400 h-10 w-10 rounded-full flex items-center justify-center shrink-0"
					>
						<a href="javascript:void(0)">
							<Icon
                                icon="akar-icons:twitter-fill"
                                class="text-white h-5 w-5"
                            />
                               
						</a>
					</li>
				</ul>
			</div>

			<div class="bg-gray-200 p-6 rounded-lg">
				<p class="text-sm font-semibold text-slate-900">Send Us a Message</p>


				<form onsubmit="{handleSubmit}" oninput="{hideError}" class="mt-8 space-y-4">
					<input
						type="text"
                        autocomplete="off"
                        bind:value="{name}"
						placeholder="Name *"
						class="w-full rounded-lg py-3 px-4 text-slate-900 text-sm outline-0 bg-white"
					/>
                    {#if errors.name}
                        <p class="text-red-500 text-sm">{errors.name}</p>
                    {/if}
                   
					<input
						type="email *"
						placeholder="Email"
                        autocomplete="off"
                        bind:value="{email}"
						class="w-full rounded-lg py-3 px-4 text-slate-900 text-sm outline-0 bg-white"
					/>
                    {#if errors.email}
                        <p class="text-red-500 text-sm">{errors.email}</p>
                    {/if}
					<input
						type="text"
						placeholder="Subject *"
                        autocomplete="off"
                        bind:value="{subject}"
						class="w-full rounded-lg py-3 px-4 text-slate-900 text-sm outline-0 bg-white"
					/>
                    {#if errors.subject}
                        <p class="text-red-500 text-sm">{errors.subject}</p>
                    {/if}
					<textarea
						placeholder="Message (optional)"
						rows="6"
						class="w-full rounded-lg px-4 text-slate-900 text-sm pt-3 outline-0 bg-white"
					></textarea>
					<Button type="submit" class="w-full">
                         {#if isSubmitting}
                            <Icon
                            icon="mdi:loading"
                            class="text-white h-5 w-5 ml-2 animate-spin"
                            />
                        {/if}
                        Send Message</Button>
				</form>
			</div>
		</div>
	</div>
</section>
