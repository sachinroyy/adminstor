

import { NextResponse } from 'next/server';
import Deal from '../../../models/Deal';
import dbConnect from '../../Deshboard/deshboard/database/db';
import { uploadImage } from '../../../components/cloudnary/cloudnary';

// Connect to MongoDB
await dbConnect();

// GET /api/deals - Get all deals
export async function GET() {
  try {
    const deals = await Deal.find().sort({ createdAt: -1 });
    return NextResponse.json({ success: true, data: deals });
  } catch (error) {
    console.error('Error fetching deals:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch deals' },
      { status: 500 }
    );
  }
}

// POST /api/deals - Create a new deal
export async function POST(request) {
  try {
    const body = await request.json();
    
    // Validate required fields
    if (!body.name || !body.offer || !body.price || !body.image) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Upload image to Cloudinary if it's a base64 string
    let imageUrl = body.image;
    if (typeof body.image === 'string' && body.image.startsWith('data:image')) {
      try {
        imageUrl = await uploadImage(body.image);
      } catch (uploadError) {
        console.error('Error uploading image to Cloudinary:', uploadError);
        return NextResponse.json(
          { success: false, error: 'Failed to upload image' },
          { status: 500 }
        );
      }
    }

    // Create new deal
    const deal = new Deal({
      name: body.name.trim(),
      offer: body.offer.trim(),
      description: body.description ? body.description.trim() : '',
      price: parseFloat(body.price),
      image: imageUrl
    });

    // Save to database
    const savedDeal = await deal.save();

    return NextResponse.json({ 
      success: true, 
      data: savedDeal 
    });

  } catch (error) {
    console.error('Error creating deal:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: error.message || 'Failed to create deal',
        ...(process.env.NODE_ENV === 'development' && { stack: error.stack })
      },
      { status: 500 }
    );
  }
}


