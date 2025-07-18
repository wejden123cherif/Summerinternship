// pages/success.js
"use client";
import { useEffect } from 'react';
import { useSearchParams } from 'next/navigation';

export default function Success() {
  const searchParams = useSearchParams();
  const sessionId = searchParams.get('session_id');

  useEffect(() => {
    if (sessionId) {
      verifyPayment(sessionId);
    }
  }, [sessionId]);

  const verifyPayment = async (sessionId) => {
    try {
      const response = await fetch('http://${process.env.BACKEND_URL}:5000/api/verify-payment', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sessionId }),
      });
      const data = await response.json();
      console.log('Verification response:', data);
      if (data.status === 'Payment verified') {
        alert('Payment successfully verified!');
      } else if (data.status === 'Payment pending') {
        alert('Payment is still processing.');
      } else {
        alert('Payment verification failed.');
      }
    } catch (error) {
      console.error('Error verifying payment:', error);
      alert('Error verifying payment. Please try again.');
    }
  };

  return (
    <div>
      <h1>Payment Success</h1>
      <p>Session ID: {sessionId}</p>
    </div>
  );
}