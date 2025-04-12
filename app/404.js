// Import the useRouter hook from next/router
import { useRouter } from 'next/router';
import { useEffect } from 'react';

export default function Custom404() {
    // Get the router object
    const router = useRouter();

    useEffect(() => {
        // Check if the page exists by checking the pathname
        if (router.pathname === '/404') {
          // Redirect to the home page
          router.push('/');
        }
      }, [router]); // Ensure the useEffect runs when the router object changes

    // Return null (component doesn't render anything)
    return null;
}