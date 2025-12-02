import React from 'react'
import { BrowserRouter } from 'react-router-dom'
import Theme from '@/components/template/Theme'
import Layout from '@layouts'
import { AuthProvider } from '@app/providers/auth'
import Views from '@features'
import '@app/config/locales'
import { SnackbarProvider } from "notistack";
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'

// Mock is only loaded in development - excluded from production builds via .dockerignore
const queryClient = new QueryClient(
    {
        defaultOptions: {
            queries: {
                retry: 1,
                refetchOnWindowFocus: false,
                staleTime: 1000 * 60 * 5, // 5 minutes
                gcTime: 1000 * 60 * 30,   // 30 minutes
            },
            mutations: {
                retry: 1,
                gcTime: 1000 * 60 * 30,   // 30 minutes
            }
        },
    }
);


function App() {
    return (
        <QueryClientProvider client={queryClient}>
            <Theme>
                <SnackbarProvider maxSnack={3} anchorOrigin={{ vertical: 'top', horizontal: 'right' }} autoHideDuration={3000}>
                    <BrowserRouter>
                        <AuthProvider>
                            <Layout>
                                <Views />
                            </Layout>
                            <ReactQueryDevtools initialIsOpen={false} />
                        </AuthProvider>
                    </BrowserRouter>
                </SnackbarProvider>
            </Theme>
        </QueryClientProvider>
    )
}

export default App
