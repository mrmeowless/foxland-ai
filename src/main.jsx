import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import AssistantProvider from './context/AssistantProvider'

ReactDOM.createRoot(document.getElementById('root')).render(
	<AssistantProvider>
		<App />
	</AssistantProvider>
)
