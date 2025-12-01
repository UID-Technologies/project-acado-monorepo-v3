import React, { useEffect, useState } from 'react';

interface CountdownProps {
    date: string;
}

const Countdown: React.FC<CountdownProps> = ({ date }) => {
    const [timeLeft, setTimeLeft] = useState<string>('');

    useEffect(() => {
        const interval = setInterval(() => {
            const now = new Date();
            const eventDate = new Date(date);

            const diffInSeconds = Math.floor((eventDate.getTime() - now.getTime()) / 1000);

            if (diffInSeconds <= 0) {
                clearInterval(interval);
                setTimeLeft('Event Ended');
                return;
            }

            const days = Math.floor(diffInSeconds / (3600 * 24));
            const hours = Math.floor((diffInSeconds % (3600 * 24)) / 3600);
            const minutes = Math.floor((diffInSeconds % 3600) / 60);
            const seconds = diffInSeconds % 60;

            setTimeLeft(`${days} Days ${hours} Hours ${minutes} Min ${seconds} Sec`);
        }, 1000);

        return () => clearInterval(interval);
    }, [date]);

    return <span>{timeLeft}</span>;
};

export default Countdown;
