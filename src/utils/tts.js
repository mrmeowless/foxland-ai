const API_KEY = 'sk_a5a1f200812919a461b536491aa47337665c665857efffdc'
const VOICE_ID = '8HSRAwEWAAa6wv9cdi5S'

export async function speakTTS(text) {
	const url = `https://api.elevenlabs.io/v1/text-to-speech/${VOICE_ID}`
	text = text.replace(/https?:\/\/\S+/g, '')

	const body = {
		text,
		model_id: 'eleven_multilingual_v2',
		voice_settings: {
			stability: 0.8,
			similarity_boost: 0,
		},
	}

	try {
		const response = await fetch(url, {
			method: 'POST',
			headers: {
				'xi-api-key': API_KEY,
				'Content-Type': 'application/json',
				Accept: 'audio/mpeg',
			},
			body: JSON.stringify(body),
		})

		if (!response.ok) throw new Error('Ошибка TTS запроса')

		const audioBlob = await response.blob()
		const audioUrl = URL.createObjectURL(audioBlob)
		const audio = new Audio(audioUrl)
		audio.play()
	} catch (error) {
		console.error('Ошибка озвучки:', error)
	}
}
