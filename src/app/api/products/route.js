
import { NextResponse } from 'next/server';
import dbConnect from '../../Deshboard/deshboard/database/db';
import Product from '../../../models/product';
import cloudinary from '../../../components/cloudnary/cloudnary';
import { Types } from 'mongoose';

// Helper function to create error response
const createErrorResponse = (message, status = 400) => {
  return NextResponse.json(
    { success: false, error: message },
    { status, headers: { 'Content-Type': 'application/json' } }
  );
};

// Helper function to create success response
const createSuccessResponse = (data, status = 200) => {
  return NextResponse.json(
    { success: true, data },
    { status, headers: { 'Content-Type': 'application/json' } }
  );
};

export async function POST(request) {
  try {
    await dbConnect();
    let body = await request.json();

    // Create a clean copy of the body without _id for new products
    const { _id, ...productData } = body;

    // Check if image is base64
    let imageUrl = '';
    if (productData.image?.startsWith('data:image')) {
      const uploadRes = await cloudinary.uploader.upload(productData.image, {
        folder: 'products',
      });
      imageUrl = uploadRes.secure_url;
    }

    // Create the product without explicitly setting _id
    const product = await Product.create({
      ...productData,
      image: imageUrl || productData.image,
    });

    return createSuccessResponse(product, 201);
  } catch (error) {
    console.error('DB Create Error:', error);
    console.error('Error creating product:', error);
    return createErrorResponse(
      error.message || 'Failed to create product',
      error.name === 'ValidationError' ? 400 : 500
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

    return createSuccessResponse({
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
    console.error('Error fetching products:', error);
    return createErrorResponse('Failed to fetch products', 500);
  }
}
