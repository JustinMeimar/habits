"use client"
import { useRouter } from 'next/navigation';

const Index = () => {
    const router = useRouter();
    router.push('/login');
    return (
        <div></div>
    );
};

export default Index;