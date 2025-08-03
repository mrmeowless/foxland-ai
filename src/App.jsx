import { useEffect, useState } from 'react'
import styles from './App.module.scss'
import { useAssistant } from './context/useAssistant'
import UserForm from './UserForm'
import { getAssistantReply } from './utils/openai'
import { speakTTS } from './utils/tts'

function App() {
	const { user } = useAssistant()
	const [lastError, setLastError] = useState(null)
	const [messages, setMessages] = useState(
		user
			? [
					{
						role: 'assistant',
						text: `Привет, ${user.name}! Чем могу помочь в достижении цели "${user.goal}"?`,
					},
			  ]
			: []
	)
	const [input, setInput] = useState('')

	const sendMessage = async () => {
		if (!input.trim()) return

		const lowerInput = input.trim().toLowerCase()

		setMessages(prev => [...prev, { role: 'user', text: input }])
		setInput('')

		if (lowerInput.includes('ошибка')) {
			if (lastError) {
				const errorTranslations = {
					insufficient_quota:
						'У тебя закончилась квота на запросы. Проверь аккаунт OpenAI.',
					invalid_api_key: 'Неверный API-ключ. Проверь настройки.',
					rate_limit_reached: 'Превышен лимит запросов. Попробуй позже.',
					context_length_exceeded:
						'Слишком длинное сообщение. Уменьши объем ввода.',
					unauthorized: 'Нет доступа. Возможно, ключ неактивен.',
				}
				console.log(lastError)

				const translated =
					errorTranslations[lastError] || 'Произошла неизвестная ошибка.'
				setMessages(prev => [...prev, { role: 'assistant', text: translated }])
			} else {
				setMessages(prev => [
					...prev,
					{ role: 'assistant', text: 'Ошибок пока не было.' },
				])
			}
			return
		}

		const reply = await getAssistantReply(input)

		if (reply.status !== 200) {
			setLastError(reply.description)
		}
		setMessages(prev => [...prev, { role: 'assistant', text: reply.message }])
	}

	useEffect(() => {
		if (!messages.length) return

		const last = messages[messages.length - 1]
		if (last.role === 'assistant') {
			speakTTS(last.text)
		}
	}, [messages])

	if (!user) return <UserForm />

	return (
		<div className={styles.app}>
			<div className={styles.chatWindow}>
				{messages.map((msg, i) => (
					<div key={i} className={`${styles.message} ${styles[msg.role]}`}>
						{msg.text}
					</div>
				))}
			</div>
			<div className={styles.inputArea}>
				<input
					type='text'
					value={input}
					onChange={e => setInput(e.target.value)}
					onKeyDown={e => e.key === 'Enter' && sendMessage()}
					placeholder='Введите сообщение...'
					className={styles.input}
				/>
				<button onClick={sendMessage} className={styles.button}>
					Отправить
				</button>
			</div>
		</div>
	)
}

export default App
