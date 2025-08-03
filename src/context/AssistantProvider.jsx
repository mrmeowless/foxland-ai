import { useState } from 'react'
import AssistantContext from './assistant'

function AssistantProvider({ children }) {
	const [user, setUser] = useState(null)

	return (
		<AssistantContext.Provider value={{ user, setUser }}>
			{children}
		</AssistantContext.Provider>
	)
}

export default AssistantProvider
