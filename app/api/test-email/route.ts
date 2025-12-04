import { NextResponse } from 'next/server';
import { sendConsultationConfirmation } from '@/lib/email-service';

export async function GET() {
  try {
    await sendConsultationConfirmation({
      email: 'your-test-email@example.com',
      fullName: 'Test User',
      consultationType: 'Online Consultation',
      preferredDate: '2025-01-15',
      preferredTime: '14:00',
      category: 'Bridal',
      reference: 'TEST-123',
      amount: 25000,
    });

    return NextResponse.json({ success: true, message: 'Test email sent!' });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to send test email', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}