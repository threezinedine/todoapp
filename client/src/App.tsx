import { AppRouter } from './AppRouter'
import { ToastHost } from '~/state-components'

function App() {
	return (
		<>
			<AppRouter />
			<ToastHost dataTestId="global-toast" />
		</>
	)
}

export default App
