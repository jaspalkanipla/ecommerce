import Order from "../../models/order.model.js";
import Cart from "../../models/cart.model.js";
import { successResponse, errorResponse } from "../../utils/responseHandler.js";
import Razorpay from "razorpay";

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

// Checkout with Razorpay
export const checkoutWithRazorpay = async (req, res, next) => {
  try {
    const userId = req.user._id;
    const { addressId, paymentMethod } = req.body;

    // 1. Address check
    const address = req.user.addresses.id(addressId);
    if (!address) return errorResponse(res, "Invalid address", 400);

    // 2. Cart fetch
    const cart = await Cart.findOne({ user: userId }).populate("items.product");
    if (!cart || cart.items.length === 0) {
      return errorResponse(res, "Cart is empty", 400);
    }

    // 3. Snapshot
    const orderItems = cart.items.map((item) => ({
      product: item.product._id,
      name: item.product.name,
      price: item.product.price,
      quantity: item.quantity,
    }));

    const totalAmount = orderItems.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
    );

    // 4. Razorpay Order create
    const options = {
      amount: totalAmount * 100,
      currency: "INR",
      receipt: `receipt_${Date.now()}`,
    };
    const razorpayOrder = await razorpay.orders.create(options);

    // 5. DB Order create
    const order = await Order.create({
      user: userId,
      items: orderItems,
      shippingAddress: address.toObject(),
      paymentMethod: paymentMethod || "Card",
      totalAmount,
      status: "pending",
      razorpayOrderId: razorpayOrder.id,
    });

    // 6. Cart clear
    cart.items = [];
    cart.totalPrice = 0;
    await cart.save();

    return successResponse(res, "Checkout initiated", {
      dbOrderId: order._id,
      razorpayOrderId: razorpayOrder.id,
      amount: razorpayOrder.amount,
      currency: razorpayOrder.currency,
    });
  } catch (err) {
    next(err);
  }
};



//  Normal Checkout (self)
export const createOrder = async (req, res, next) => {
    try {
        const userId = req.user._id;
        const { addressId, paymentMethod } = req.body;
        //  1. Address check 
        const address = req.user.addresses.id(addressId);
        if (!address) return errorResponse(res, "Invalid address", 400);

        //  2. Cart fetch
        const cart = await Cart.findOne({ user: userId }).populate("items.product");
        // const cart = await Cart.findOne({ user: userId }).populate("items.product", "name price");
        if (!cart || cart.items.length === 0) {
            return errorResponse(res, "Cart is empty", 400);
        }

        //  3. Snapshot बनाओ
        const orderItems = cart.items.map((item) => ({
            product: item.product._id,
            name: item.product.name,
            price: item.product.price,
            quantity: item.quantity
        }));

        const totalAmount = orderItems.reduce(
            (sum, item) => sum + item.price * item.quantity,
            0
        );

        // ✅ 4. Order save
        const order = await Order.create({
            user: userId,
            items: orderItems,
            shippingAddress: address.toObject(),
            paymentMethod: paymentMethod || "COD",
            totalAmount,
            status: "pending"
        });

        // ✅ 5. Cart clear
        cart.items = [];
        cart.totalPrice = 0;
        await cart.save();

        return successResponse(res, "Order placed successfully", order);
    } catch (err) {
        next(err);
    }
};



// 🟢 Get all orders for logged-in user
export const getMyOrders = async (req, res, next) => {
    try {
        const orders = await Order.find({ user: req.user._id })
            .sort({ createdAt: -1 }); // latest first

        return successResponse(res, "My orders fetched successfully", orders);
    } catch (err) {
        next(err);
    }
};

// 🟢 Get specific order by ID (only if it belongs to user)
export const getOrderById = async (req, res, next) => {
    try {
        const { id } = req.params;

        const order = await Order.findById(id);

        if (!order) return errorResponse(res, "Order not found", 404);

        // User should only see their own orders
        if (order.user.toString() !== req.user._id.toString()) {
            return errorResponse(res, "Not authorized to view this order", 403);
        }
        return successResponse(res, "Order details fetched successfully", order);
    } catch (err) {
        next(err);
    }
};
