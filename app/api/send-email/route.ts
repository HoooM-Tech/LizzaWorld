import { NextRequest, NextResponse } from 'next/server';
import { sendConsultationConfirmation, sendOrderConfirmation, sendAdminNotification } from '@/lib/email-service';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { type, data } = body;

    if (type === 'consultation') {
      await sendConsultationConfirmation(data);
      await sendAdminNotification('consultation', data);
    } else if (type === 'order') {
      await sendOrderConfirmation(data);
      await sendAdminNotification('order', data);
    } else {
      return NextResponse.json({ error: 'Invalid email type' }, { status: 400 });
    }

    return NextResponse.json({ success: true, message: 'Email sent successfully' });
  } catch (error) {
    console.error('Email error:', error);
    return NextResponse.json(
      { error: 'Failed to send email', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}