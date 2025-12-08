// app/api/verify-payment/route.ts
import { NextRequest, NextResponse } from 'next/server';

async function verifyPayment(reference: string) {
  const secretKey = process.env.PAYSTACK_SECRET_KEY;
  
  if (!secretKey) {
    console.error('PAYSTACK_SECRET_KEY not configured');
    throw new Error('Server configuration error');
  }

  console.log('Verifying payment with reference:', reference);

  const response = await fetch(
    `https://api.paystack.co/transaction/verify/${reference}`,
    {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${secretKey}`,
        'Content-Type': 'application/json',
      },
    }
  );

  const data = await response.json();
  console.log('Paystack verification response:', data);

  if (!response.ok) {
    console.error('Paystack API error:', data);
    throw new Error('Payment verification failed');
  }

  return data;
}

export async function POST(request: NextRequest) {
  try {
    const { reference } = await request.json();
    
    if (!reference) {
      return NextResponse.json(
        { status: false, message: 'Reference is required' },
        { status: 400 }
      );
    }

    const data = await verifyPayment(reference);

    if (data.status && data.data?.status === 'success') {
      console.log('Payment verified successfully:', reference);
      
      return NextResponse.json({
        status: true,
        message: 'Payment verified successfully',
        data: data.data
      });
    } else {
      console.log('Payment verification failed - not successful:', data);
      return NextResponse.json({
        status: false,
        message: 'Payment was not successful',
        data: data.data
      });
    }
  } catch (error) {
    console.error('Verification error:', error);
    return NextResponse.json(
      { 
        status: false,
        message: 'Error verifying payment',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const reference = searchParams.get('reference');
    
    if (!reference) {
      return NextResponse.json(
        { status: false, message: 'Reference is required' },
        { status: 400 }
      );
    }

    const data = await verifyPayment(reference);

    if (data.status && data.data?.status === 'success') {
      return NextResponse.json({
        status: true,
        message: 'Payment verified successfully',
        data: data.data
      });
    } else {
      return NextResponse.json({
        status: false,
        message: 'Payment was not successful',
        data: data.data
      });
    }
  } catch (error) {
    console.error('Verification error:', error);
    return NextResponse.json(
      { 
        status: false,
        message: 'Error verifying payment',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}