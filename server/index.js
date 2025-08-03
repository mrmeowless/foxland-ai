import cors from 'cors'
import 'dotenv/config'
import express from 'express'

const app = express()
app.use(cors())
app.use(express.json())

const API_KEY = process.env.OPENAI_API_KEY

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
