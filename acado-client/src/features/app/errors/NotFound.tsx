import { Container } from '@/components/shared'
import { Button } from '@/components/ui'
import React from 'react'
import { Link } from 'react-router-dom'

function NotFound() {
    return (
        <Container className='h-[60vh] flex justify-center items-center'>
            <div className='text-center'>
                <h1 className='text-9xl font-bold text-primary'>400</h1>
                <h2 className='text-2xl font-bold text-gray-900 mb-2'>Not Found</h2>
                <p className='text-gray-500'>
                    The page you are looking for might have been removed, had its name changed, or is temporarily unavailable.
                </p>
                <Link to='/' className='text-primary'>
                    <Button className='mt-4 bg-primary'>Go Home</Button>
                </Link>
            </div>
        </Container>
    )
}

export default NotFound