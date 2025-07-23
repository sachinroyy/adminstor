
import { NextResponse } from 'next/server';
import dbConnect from '../../Deshboard/deshboard/database/db';
import Product from '../../../models/product';
import cloudinary from '../../../components/cloudnary/cloudnary';
import { Types } from 'mongoose';

export async function POST(request) {
  try {
    await dbConnect();
    const body = await request.json();

    // Check if image is base64
    let imageUrl = '';
    if (body.image?.startsWith('data:image')) {
      const uploadRes = await cloudinary.uploader.upload(body.image, {
        folder: 'products',
      });
      imageUrl = uploadRes.secure_url;
    }

    const product = await Product.create({
      ...body,
      image: imageUrl, // store Cloudinary image URL
    });

    return NextResponse.json(
      { success: true, data: product },
      { status: 201 }
    );
  } catch (error) {
    console.error('DB Create Error:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: error.message || 'Failed to create product',
        details: error.errors ? Object.values(error.errors).map(e => e.message) : null
      },
      { status: 400 }
    );
  }
}

export async function GET(request) {
  try {
    await dbConnect();
    
    // Get query parameters
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const category = searchParams.get('category');
    const search = searchParams.get('search');
    const skip = (page - 1) * limit;

    // Build query
    const query = {};
    
    // Filter by category if provided
    if (category && Types.ObjectId.isValid(category)) {
      query.categories = category;
    }

    // Search in name and description if search term is provided
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } }
      ];
    }

    // Get total count for pagination
    const total = await Product.countDocuments(query);
    
    // Fetch products with pagination and populate categories
    const products = await Product.find(query)
      .populate('categories', 'name') // Only include category names
      .sort({ createdAt: -1 }) // Sort by newest first
      .skip(skip)
      .limit(limit);

    return NextResponse.json({
      success: true,
      data: products,
      pagination: {
        total,
        page,
        pages: Math.ceil(total / limit),
        limit
      }
    });

  } catch (error) {
    console.error('Error fetching products:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: error.message || 'Failed to fetch products'
      },
      { status: 500 }
    );
  }
}
