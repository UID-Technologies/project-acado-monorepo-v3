export type errorRequest = {
    title: string
    errors: string
    type: string
    status: number
}

export type errorResponse = {
    status: number
    message: string
    data: any
}

export type errors = {
    title: string
    errors: string
    type: string
    status: number
}