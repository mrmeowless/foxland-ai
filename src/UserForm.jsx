import { useState } from 'react'
import { useAssistant } from './context/useAssistant'
import styles from './UserForm.module.scss'

function UserForm() {
	const { setUser } = useAssistant()
	const [name, setName] = useState('')
	const [goal, setGoal] = useState('')

	const handleSubmit = e => {
		e.preventDefault()
		if (name.trim() && goal.trim()) {
			setUser({ name, goal })
		}
	}

	return (
		<form className={styles.form} onSubmit={handleSubmit}>
			<h2>Настройки ассистента</h2>
			<input
				placeholder='Как тебя зовут?'
				value={name}
				onChange={e => setName(e.target.value)}
			/>
			<input
				placeholder='Какая у тебя цель?'
				value={goal}
				onChange={e => setGoal(e.target.value)}
			/>
			<button type='submit'>Сохранить</button>
		</form>
	)
}

export default UserForm
