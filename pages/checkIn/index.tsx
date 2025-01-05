import React, { useState } from 'react';
import { useRouter } from 'next/router';
import { WithDefaultLayout } from '../../components/DefautLayout';
import { Page } from '@/types/Page';
import { BackendApiUrl } from '@/functions/BackendApiUrl';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronLeft } from '@fortawesome/free-solid-svg-icons';
import { Input } from 'antd';
import { useFetchWithAccessToken } from '@/functions/useFetchWithAccessToken';
import { useSession } from 'next-auth/react';

const CheckInPage: Page = () => {
    const router = useRouter();
    useSession(); // To get the session or user information
    const [inputValue, setInputValue] = useState<string>(''); // State to store input value
    const [isLoading, setIsLoading] = useState(false); // To handle loading state
    const [error, setError] = useState<string | null>(null); // To handle error messages
    const [successMessage, setSuccessMessage] = useState<string>(''); // To show success message

    const { fetchPOST } = useFetchWithAccessToken();
    // Handle input change
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setInputValue(e.target.value);
    };

    // Handle back button click
    const handleBackButton = () => {
        router.back();
    };

    // Handle Check-In
    const handleCheckIn = async () => {
        // Don't proceed if input is empty
        if (!inputValue) {
            setError("Please provide the required input.");
            return;
        }

        setIsLoading(true);
        setError(null); // Reset any previous errors

        const payload = {
            bookingId: inputValue
        }
        try {
            // Make POST request using `useFetchWithAccessToken`
            const response = await fetchPOST(BackendApiUrl.checkIn, payload)
            if (response.data) {
                setSuccessMessage("Check-In successful!");
                router.push('/dashboardApprover')
            } else {
                setError("Failed to check-in. Please try again.");
            }
        } catch (err) {
            console.error("Check-in error:", err);
            setError("An error occurred during check-in.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="mt-4">
            <button className="bg-white rounded-full w-10 h-10 flex items-center justify-center mb-10" onClick={handleBackButton}>
                <FontAwesomeIcon icon={faChevronLeft} className="inline" />
            </button>
            <img
            src="/Assets/images/check-in.png"
            alt=""
            className="mb-6 h-12"
          />

            <div className="h-[670px] grid grid-rows-2">
                <div className="flex flex-col gap-6 items-center justify-end">
                    <Input
                        type="text"
                        className="w-4/5 h-[50px] text-lg"
                        value={inputValue}
                        onChange={handleInputChange}
                        placeholder="Enter Check-In Data"
                    />

                    {error && <p className="text-red-500">{error}</p>}
                    {successMessage && <p className="text-green-500">{successMessage}</p>}

                    <button
                        className="bg-[#EB8317] border-4 border-[#d68530] text-3xl w-[200px] font-semibold text-white rounded-xl py-1"
                        onClick={handleCheckIn}
                        disabled={isLoading} // Disable button while loading
                    >
                        {isLoading ? 'Checking In...' : 'Check-in'}
                    </button>
                </div>
            </div>
        </div>
    );
};

CheckInPage.layout = WithDefaultLayout;
export default CheckInPage;
