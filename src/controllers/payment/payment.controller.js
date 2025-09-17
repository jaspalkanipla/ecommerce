import Razorpay from "razorpay";
import crypto from "crypto";
import { successResponse, errorResponse } from "../../utils/responseHandler.js";

// Razorpay instance
const razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET,
});

// ✅ Create Razorpay Order
export const createRazorpayOrder = async (req, res) => {
    try {
        const { amount, currency } = req.body;

        const options = {
            amount: amount * 100, // paise me hota hai (50000 = ₹500)
            currency: currency || "INR",
            receipt: `receipt_${Date.now()}`,
        };

        const order = await razorpay.orders.create(options);
        console.log("order: ", order);

        return successResponse(res, "Razorpay order created", order);
    } catch (error) {
        console.error(error);
        return errorResponse(res, "Failed to create order", 500);
    }
};

// ✅ Verify Payment Signature
// export const verifyPayment = async (req, res) => {
//     try {
//         const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;
//         console.log("razorpay_order_id: ", razorpay_order_id);
//         console.log("razorpay_payment_id: ", razorpay_payment_id);
//         console.log("razorpay_signature: ", razorpay_signature);

//         const sign = razorpay_order_id + "|" + razorpay_payment_id;
//         console.log("sign: ", sign);
//         const expectedSign = crypto
//             .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
//             .update(sign.toString())
//             .digest("hex");


//         console.log("expectedSign: ", expectedSign);
//         if (razorpay_signature === expectedSign) {
//             return successResponse(res, "Payment verified successfully", {
//                 razorpay_order_id,
//                 razorpay_payment_id,
//             });
//         } else {
//             return errorResponse(res, "Invalid signature, payment failed", 400);
//         }
//     } catch (error) {
//         return errorResponse(res, "Payment verification failed", 500);
//     }
// };



export const verifyPayment = async (req, res) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature, dbOrderId } = req.body;

    const sign = razorpay_order_id + "|" + razorpay_payment_id;
    const expectedSign = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(sign.toString())
      .digest("hex");

    if (razorpay_signature === expectedSign) {
      // ✅ Update DB Order
      const order = await Order.findByIdAndUpdate(
        dbOrderId,
        {
          status: "paid",
          razorpayPaymentId: razorpay_payment_id,
          razorpaySignature: razorpay_signature,
        },
        { new: true }
      );

      return successResponse(res, "Payment verified and order updated", order);
    } else {
      return errorResponse(res, "Invalid signature, payment failed", 400);
    }
  } catch (error) {
    return errorResponse(res, "Payment verification failed", 500);
  }
};
