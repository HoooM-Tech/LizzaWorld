// app/api/send-email/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { 
  sendConsultationConfirmation, 
  sendOrderConfirmation, 
  sendAdminNotification,
  sendInternationalShippingInquiry 
} from '@/lib/email-service';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { type, data } = body;

    console.log('Attempting to send email:', { type, to: data.email });

    if (type === 'consultation') {
      await sendConsultationConfirmation(data);
      await sendAdminNotification('consultation', data);
    } else if (type === 'order') {
      await sendOrderConfirmation(data);
      await sendAdminNotification('order', data);
    } else if (type === 'international_inquiry') {
      await sendInternationalShippingInquiry(data);
    } else {
      return NextResponse.json({ error: 'Invalid email type' }, { status: 400 });
    }

    console.log('Email sent successfully');
    return NextResponse.json({ success: true, message: 'Email sent successfully' });
  } catch (error) {
    console.error('Email error details:', error); 
    return NextResponse.json(
      { 
        error: 'Failed to send email', 
        details: error instanceof Error ? error.message : 'Unknown error',
        stack: error instanceof Error ? error.stack : undefined
      },
      { status: 500 }
    );
  }
}