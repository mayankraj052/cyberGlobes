import { writable } from 'svelte/store';

interface ChatMessage {
	id: string;
	role: 'user' | 'assistant';
	content: string;
	timestamp: Date;
	isVoiceInput: boolean;
}

interface Chat {
	id: string;
	title: string;
	messages: ChatMessage[];
	lastMessage?: string;
	timestamp: Date;
	messageCount: number;
}

interface ChatState {
	chats: Chat[];
	activeChat: string | null;
	isLoading: boolean;
}

const initialState: ChatState = {
	chats: [],
	activeChat: null,
	isLoading: false
};

function createChatStore() {
	const { subscribe, set, update } = writable<ChatState>(initialState);

	return {
		subscribe,
		setActiveChat: (chatId: string) => {
			update((state: ChatState) => ({
				...state,
				activeChat: chatId
			}));
		},
		createNewChat: (chatId: string) => {
			update((state: ChatState) => {
				const newChat: Chat = {
					id: chatId,
					title: 'New Chat',
					messages: [],
					timestamp: new Date(),
					messageCount: 0
				};
				
				return {
					...state,
					chats: [newChat, ...state.chats],
					activeChat: chatId
				};
			});
		},
		addMessage: (chatId: string, message: ChatMessage) => {
			update((state: ChatState) => ({
				...state,
				chats: state.chats.map((chat: Chat) => {
					if (chat.id === chatId) {
						const updatedMessages = [...chat.messages, message];
						return {
							...chat,
							messages: updatedMessages,
							lastMessage: message.content,
							messageCount: updatedMessages.length,
							timestamp: message.timestamp,
							title: chat.title === 'New Chat' && updatedMessages.length === 1 
								? generateChatTitle(message.content) 
								: chat.title
						};
					}
					return chat;
				})
			}));
		},
		updateChatTitle: (chatId: string, title: string) => {
			update((state: ChatState) => ({
				...state,
				chats: state.chats.map((chat: Chat) => 
					chat.id === chatId ? { ...chat, title } : chat
				)
			}));
		},
		deleteChat: (chatId: string) => {
			update((state: ChatState) => ({
				...state,
				chats: state.chats.filter((chat: Chat) => chat.id !== chatId),
				activeChat: state.activeChat === chatId ? null : state.activeChat
			}));
		},
		setLoading: (loading: boolean) => {
			update((state: ChatState) => ({
				...state,
				isLoading: loading
			}));
		}
	};
}

function generateChatTitle(firstMessage: string): string {
	// Simple title generation based on first message
	const words = firstMessage.split(' ').slice(0, 5);
	return words.join(' ') + (firstMessage.split(' ').length > 5 ? '...' : '');
}

export const chatStore = createChatStore();