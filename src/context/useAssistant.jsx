import { useContext } from 'react'
import AssistantContext from './assistant'

export function useAssistant() {
	return useContext(AssistantContext)
}
