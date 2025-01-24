import {createRoot} from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import {QueryClient, QueryClientProvider} from "@tanstack/react-query";
import {I18nextProvider} from 'react-i18next';
import i18n from './i18n'; // path to your i18n configuration


const queryClient = new QueryClient()

createRoot(document.getElementById('root')!).render(
    <QueryClientProvider client={queryClient}>
        <I18nextProvider i18n={i18n}>
            <App/>
        </I18nextProvider>

    </QueryClientProvider>
)
