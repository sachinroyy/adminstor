import { NextResponse } from 'next/server';
import dbConnect from '../../../../Deshboard/deshboard/database/db';
import Product from '../../../../models/product';
import cloudinary from '../../../../components/cloudnary/cloudnary';
import { Types } from 'mongoose';

// Helper function to validate ObjectId
const isValidObjectId = (id) => {
  return Types.ObjectId.isValid(id) && (String)(new Types.ObjectId(id)) === id;
};

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

export async function GET(request, { params }) {
  try {
    await dbConnect();
    
    const { id } = params;
    
    // Validate ObjectId
    if (!isValidObjectId(id)) {
      return createErrorResponse('Invalid product ID');
    }
    
    const product = await Product.findById(id);
    
    if (!product) {
      return createErrorResponse('Product not found', 404);
    }
    
    return createSuccessResponse(product);
    
  } catch (error) {
    console.error('Error fetching product:', error);
    return createErrorResponse('Failed to fetch product', 500);
  }
}

export async function PUT(request, { params }) {
  try {
    await dbConnect();
    
    const { id } = params;
    
    // Validate ObjectId
    if (!isValidObjectId(id)) {
      return createErrorResponse('Invalid product ID');
    }
    
    const updateData = await request.json();
    
    // If there's an image update, handle Cloudinary upload
    if (updateData.image?.startsWith('data:image')) {
      const uploadRes = await cloudinary.uploader.upload(updateData.image, {
        folder: 'products',
      });
      updateData.image = uploadRes.secure_url;
    }
    
    const product = await Product.findByIdAndUpdate(
      id,
      updateData,
      { new: true, runValidators: true }
    );
    
    if (!product) {
      return createErrorResponse('Product not found', 404);
    }
    
    return createSuccessResponse(product);
    
  } catch (error) {
    console.error('Error updating product:', error);
    return createErrorResponse(
      error.message || 'Failed to update product',
      error.name === 'ValidationError' ? 400 : 500
    );
  }
}

export async function DELETE(request, { params }) {
  try {
    await dbConnect();
    
    const { id } = params;
    
    // Validate ObjectId
    if (!isValidObjectId(id)) {
      return createErrorResponse('Invalid product ID');
    }
    
    const deletedProduct = await Product.findByIdAndDelete(id);
    
    if (!deletedProduct) {
      return createErrorResponse('Product not found', 404);
    }
    
    return createSuccessResponse(
      { id: deletedProduct._id },
      200,
      'Product deleted successfully'
    );
    
  } catch (error) {
    console.error('Error deleting product:', error);
    return createErrorResponse('Failed to delete product', 500);
  }
}
