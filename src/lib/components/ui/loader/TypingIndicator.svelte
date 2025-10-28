<div class="flex justify-start mb-4">
    <div class="bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-gray-100 p-3 rounded-lg rounded-tl-none max-w-[80%]">
        <div class="typing-indicator">
            <span class="animate-typing-dot"></span>
            <span class="animate-typing-dot-delay-1"></span>
            <span class="animate-typing-dot-delay-2"></span>
        </div>
    </div>
</div>
<style>
	.typing-indicator {
		display: flex;
		align-items: center;
		gap: 4px;
	}
	
	.typing-indicator span {
		width: 8px;
		height: 8px;
		background-color: currentColor;
		border-radius: 50%;
		opacity: 0.6;
	}
	
	.typing-indicator span:nth-child(2) {
		animation-delay: 0.2s;
	}
	
	.typing-indicator span:nth-child(3) {
		animation-delay: 0.4s;
	}
	
	@keyframes typing-dot {
		0%, 60%, 100% {
			transform: translateY(0);
		}
		30% {
			transform: translateY(-4px);
		}
	}
	
	.animate-typing-dot {
		animation: typing-dot 1.4s infinite ease-in-out;
	}
	.animate-typing-dot-delay-1 {
		animation: typing-dot 1.4s infinite ease-in-out 0.2s;
	}
	.animate-typing-dot-delay-2 {
		animation: typing-dot 1.4s infinite ease-in-out 0.4s;
	}
</style>