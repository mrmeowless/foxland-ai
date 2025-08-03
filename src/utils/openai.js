export async function getAssistantReply(message) {
	try {
		const response = await fetch(
			'https://foxland-ai.onrender.com/v1/assistant',
			{
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({ message }),
			}
		)
		const data = await response.json()

		if (!response.ok) {
			console.error('OpenAI API error: ', data.description)
			return {
				status: response.status,
				message: 'Произошла ошибка при обращении к AI.',
				description: data.description,
			}
		}

		return {
			status: 200,
			message: data.message,
			description: 'Ответ получен успешно',
		}
	} catch (err) {
		console.error('Ошибка при получении ответа от OpenAI: ', err)
		return {
			status: 500,
			message: 'Сервис временно недоступен.',
			description: err.message,
		}
	}
}
