export async function speakTTS(text) {
	const response = await fetch('https://foxland-ai.onrender.com/v1/tts', {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
		},
		body: JSON.stringify({ text, voiceId: '8HSRAwEWAAa6wv9cdi5S' }),
	})

	if (!response.ok) {
		console.error('TTS Error')
		return
	}

	const audioBlob = await response.blob()
	const audioUrl = URL.createObjectURL(audioBlob)
	new Audio(audioUrl).play()
}
