import Cart from "../../models/cart.model.js";
import Product from "../../models/product.model.js";
import { successResponse, errorResponse } from "../../utils/responseHandler.js";
// ✅ Add item to cart
export const addToCart = async (req, res, next) => {
  try {
    const userId = req.user._id; 
    const { productId, quantity } = req.body;
   if (!productId || quantity === undefined) {
      return errorResponse(res, "ProductId and quantity are required", 400);
    }
    const product = await Product.findById(productId);
    if (!product) {
      return errorResponse(res, "Product not found", 404);
    }

    // 🟢 STOCK CHECK यहाँ
    if (product.stock < (quantity || 1)) {
      return errorResponse(res, "Not enough stock available", 400);
    }

    let cart = await Cart.findOne({ user: userId });
    if (!cart) {
      cart = new Cart({ user: userId, items: [] });
    }

    const existingItem = cart.items.find(
      (item) => item.product.toString() === productId
    );

    if (existingItem) {
      existingItem.quantity += quantity || 1;

      // 🟢 STOCK CHECK AGAIN (existing quantity + new quantity)
      if (existingItem.quantity > product.stock) {
        return errorResponse(res, "Exceeds available stock", 400);
      }
    } else {
      cart.items.push({ product: productId, quantity: quantity || 1 });
    }

    await cart.save();

    return successResponse(res, "Item added to cart", cart);
  } catch (err) {
    next(err);
  }
};


// ✅ Add item to cart

// ✅ Remove item from cart
export const removeFromCart = async (req, res, next) => {
  try {
    const userId = req.user._id;
    const { productId } = req.body;

    let cart = await Cart.findOne({ user: userId });
    if (!cart) {
      return errorResponse(res, "Cart not found", 404);
    }

    // filter करके product remove करो
    cart.items = cart.items.filter(
      (item) => item.product.toString() !== productId
    );

    await cart.save();

    return successResponse(res, "Item removed from cart", cart);
  } catch (err) {
    next(err);
  }
};
// ✅ Get user cart
export const getCart = async (req, res, next) => {
  try {
    const userId = req.user._id;

    const cart = await Cart.findOne({ user: userId })
      .populate("items.product", "name price images"); // product details भी लाओ

    if (!cart) {
      return successResponse(res, "Cart is empty", { items: [], totalPrice: 0 });
    }

    return successResponse(res, "Cart fetched successfully", cart);
  } catch (err) {
    next(err);
  }
};


// ✅ Update quantity in cart
export const updateCartItem = async (req, res, next) => {
  try {
    const { productId, quantity } = req.body;

    if (!productId || quantity === undefined) {
      return errorResponse(res, "ProductId and quantity are required", 400);
    }

    const product = await Product.findById(productId);
    if (!product) return errorResponse(res, "Product not found", 404);

    // 🟢 STOCK CHECK
    if (product.stock < quantity) {
      return errorResponse(res, "Not enough stock available", 400);
    }

    const cart = await Cart.findOne({ user: req.user._id });
    if (!cart) return errorResponse(res, "Cart not found", 404);

    const itemIndex = cart.items.findIndex(
      (item) => item.product.toString() === productId
    );

    if (itemIndex === -1) {
      return errorResponse(res, "Item not in cart", 404);
    }

    if (quantity <= 0) {
      cart.items.splice(itemIndex, 1);
    } else {
      cart.items[itemIndex].quantity = quantity;
    }

    await cart.save();
    return successResponse(res, "Cart updated successfully", cart);
  } catch (err) {
    next(err);
  }
};


// Update quantity in cart
// export const updateCartItem = async (req, res, next) => {
//   try {
//     const { productId, quantity } = req.body;

//     if (!productId || quantity === undefined) {
//       return errorResponse(res, "ProductId and quantity are required", 400);
//     }

//     const cart = await Cart.findOne({ user: req.user._id });
//     if (!cart) return errorResponse(res, "Cart not found", 404);

//     const itemIndex = cart.items.findIndex(
//       (item) => item.product.toString() === productId
//     );

//     if (itemIndex === -1) {
//       return errorResponse(res, "Item not in cart", 404);
//     }

//     if (quantity <= 0) {
//       // remove item if quantity = 0
//       cart.items.splice(itemIndex, 1);
//     } else {
//       cart.items[itemIndex].quantity = quantity;
//     }

//     await cart.save();
//     return successResponse(res, "Cart updated successfully", cart);
//   } catch (err) {
//     next(err);
//   }
// };
