/* eslint-disable no-undef */
import cors from 'cors'
import 'dotenv/config'
import express from 'express'

const app = express()
app.use(cors())
app.use(express.json())

const API_KEY = process.env.OPENAI_API_KEY

app.post('/v1/tts', async (req, res) => {
	const { text, voiceId } = req.body
	const TTS_API_KEY = process.env.ELEVEN_API_KEY
	console.log(TTS_API_KEY ? 'OK' : 'NOT SET')

	try {
		const ttsRes = await fetch(
			`https://api.elevenlabs.io/v1/text-to-speech/${voiceId}`,
			{
				method: 'POST',
				headers: {
					'xi-api-key': TTS_API_KEY,
					'Content-Type': 'application/json',
					Accept: 'audio/mpeg',
				},
				body: JSON.stringify({
					text,
					model_id: 'eleven_multilingual_v2',
					voice_settings: {
						stability: 0.8,
						similarity_boost: 0,
					},
				}),
			}
		)

		if (!ttsRes.ok) {
			const errText = await ttsRes.text()
			return res
				.status(ttsRes.status)
				.json({ error: 'TTS Error', description: errText })
		}

		const audioBuffer = await ttsRes.arrayBuffer()
		res.set('Content-Type', 'audio/mpeg')
		res.send(Buffer.from(audioBuffer))
	} catch (err) {
		res
			.status(500)
			.json({ error: 'TTS Server Error', description: err.message })
	}
})

app.post('/v1/assistant', async (req, res) => {
	const { message } = req.body

	try {
		const openaiRes = await fetch(
			'https://api.openai.com/v1/chat/completions',
			{
				method: 'POST',
				headers: {
					Authorization: `Bearer ${API_KEY}`,
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({
					model: 'gpt-3.5-turbo',
					messages: [
						{
							role: 'system',
							content: 'Ты полезный ассистент по целям пользователя.',
						},
						{ role: 'user', content: message },
					],
				}),
			}
		)

		const data = await openaiRes.json()

		if (!openaiRes.ok) {
			return res.status(openaiRes.status).json({
				error: 'OpenAI API error',
				description: data.error.code,
			})
		}

		res.json({ message: data.choices[0].message.content })
	} catch (err) {
		res.status(500).json({
			error: 'Server error',
			description: err.message,
		})
	}
})

const PORT = process.env.PORT || 4000
app.listen(PORT, () =>
	console.log(`Server running on http://localhost:${PORT}`)
)
