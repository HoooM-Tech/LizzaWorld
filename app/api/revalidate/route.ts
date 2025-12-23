// app/api/revalidate/route.ts
import { revalidatePath, revalidateTag } from 'next/cache';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Verify the request is from Sanity
    const secret = request.nextUrl.searchParams.get('secret');
    if (secret !== process.env.SANITY_REVALIDATE_SECRET) {
      console.error('Invalid revalidation secret');
      return NextResponse.json({ message: 'Invalid secret' }, { status: 401 });
    }

    const { _type, _id, slug } = body;
    console.log('🔄 Revalidation triggered:', { _type, _id, slug });

    // Track what we revalidated
    const revalidated: string[] = [];

    // Revalidate based on content type
    switch (_type) {
      case 'product':
        // Revalidate shop page and any product detail pages
        revalidatePath('/shop');
        revalidated.push('/shop');
        
        if (slug?.current) {
          revalidatePath(`/shop/${slug.current}`);
          revalidated.push(`/shop/${slug.current}`);
        }
        
        // Revalidate tags for more granular control
        revalidateTag('product');
        revalidateTag('shop');
        break;
      
      case 'collection':
        // Revalidate shop page and collection pages
        revalidatePath('/shop');
        revalidated.push('/shop');
        
        if (slug?.current) {
          revalidatePath(`/collections/${slug.current}`);
          revalidated.push(`/collections/${slug.current}`);
        }
        
        revalidateTag('collection');
        revalidateTag('shop');
        break;
      
      case 'homePage':
        // Revalidate home page
        revalidatePath('/');
        revalidated.push('/');
        revalidateTag('home');
        break;
      
      case 'bespokePage':
        // Revalidate bespoke page
        revalidatePath('/bespoke');
        revalidated.push('/bespoke');
        revalidateTag('bespoke');
        break;
      
      case 'consultationOptions':
        // Revalidate consultation page
        revalidatePath('/consultation');
        revalidated.push('/consultation');
        revalidateTag('consultation');
        break;
      
      case 'testimonial':
        // Testimonials might appear on multiple pages
        revalidatePath('/');
        revalidatePath('/bespoke');
        revalidated.push('/', '/bespoke');
        revalidateTag('testimonial');
        break;
      
      case 'founderBio':
        // Revalidate about page or wherever founder bio appears
        revalidatePath('/about');
        revalidated.push('/about');
        revalidateTag('founder');
        break;
      
      case 'policies':
        // Revalidate policies page
        revalidatePath('/policies');
        revalidated.push('/policies');
        revalidateTag('policies');
        break;
      
      case 'siteSettings':
        // Site settings affect the entire site
        // Revalidate the layout which affects all pages
        revalidatePath('/', 'layout');
        revalidated.push('all pages (layout)');
        revalidateTag('settings');
        break;
      
      default:
        // If we don't know the type, revalidate common pages
        console.warn(`Unknown content type: ${_type}, revalidating common pages`);
        revalidatePath('/');
        revalidatePath('/shop');
        revalidatePath('/bespoke');
        revalidatePath('/consultation');
        revalidated.push('/', '/shop', '/bespoke', '/consultation');
    }

    console.log('✅ Revalidation complete:', revalidated);

    return NextResponse.json({ 
      revalidated: true, 
      paths: revalidated,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('❌ Revalidation error:', error);
    return NextResponse.json(
      { 
        revalidated: false,
        message: 'Error revalidating',
        error: error instanceof Error ? error.message : String(error)
      },
      { status: 500 }
    );
  }
}

// Optional: Add GET endpoint to test the webhook
export async function GET(request: NextRequest) {
  const secret = request.nextUrl.searchParams.get('secret');
  
  if (secret !== process.env.SANITY_REVALIDATE_SECRET) {
    return NextResponse.json({ message: 'Invalid secret' }, { status: 401 });
  }

  return NextResponse.json({ 
    message: 'Revalidation API is working!',
    timestamp: new Date().toISOString()
  });
}