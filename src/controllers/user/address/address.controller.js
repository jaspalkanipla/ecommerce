import { errorResponse, successResponse } from "../../../utils/responseHandler.js";

// 🟢 Add Address
export const addAddress = async (req, res, next) => {
  try {
    const { label, name, phone, line1, line2, city, state, postalCode, country, isDefault } = req.body;

    // req.user already protected middleware se aaya hai
    const user = req.user;

    // agar default address add ho raha hai to baaki ke sab false kar do
    if (isDefault) {
      user.addresses.forEach(addr => addr.isDefault = false);
    }

    user.addresses.push({ label, name, phone, line1, line2, city, state, postalCode, country, isDefault });
    await user.save();

    return successResponse(res, "Address added successfully", user.addresses, 201);
  } catch (err) {
    next(err);
  }
};

// 🟡 Update Address
export const updateAddress = async (req, res, next) => {
  try {
    const { addressId } = req.params;
    const { label, name, phone, line1, line2, city, state, postalCode, country, isDefault } = req.body;

    const user = req.user;
    const address = user.addresses.id(addressId);
    if (!address) return errorResponse(res, "Address not found", 404);

    if (isDefault) {
      user.addresses.forEach(addr => addr.isDefault = false);
    }

    address.label = label || address.label;
    address.name = name || address.name;
    address.phone = phone || address.phone;
    address.line1 = line1 || address.line1;
    address.line2 = line2 || address.line2;
    address.city = city || address.city;
    address.state = state || address.state;
    address.postalCode = postalCode || address.postalCode;
    address.country = country || address.country;
    address.isDefault = isDefault ?? address.isDefault;

    await user.save();
    return successResponse(res, "Address updated successfully", user.addresses, 200);
  } catch (err) {
    next(err);
  }
};

// 🔴 Delete Address
export const deleteAddress = async (req, res, next) => {
  try {
    const { addressId } = req.params;

    const user = req.user;
    const address = user.addresses.id(addressId);
    if (!address) return errorResponse(res, "Address not found", 404);

    address.deleteOne(); // mongoose subdoc delete
    await user.save();

    return successResponse(res, "Address deleted successfully", user.addresses, 200);
  } catch (err) {
    next(err);
  }
};

// 🟢 Get All Addresses
export const getAddresses = async (req, res, next) => {
  try {
    // const user = req.user;
    return successResponse(res, "Addresses fetched successfully", req.user.addresses, 200);
  } catch (err) {
    next(err);
  }
};



// import User from "../models/user.model.js";
// import { errorResponse, successResponse } from "../utils/response.js";

// // ✅ Add Address
// export const addAddress = async (req, res, next) => {
//   try {
//     const userId = req.user.id;
//     const { label, name, phone, line1, line2, city, state, postalCode, country, isDefault } = req.body;

//     if (!label || !name || !phone || !line1 || !city || !state || !postalCode) {
//       return errorResponse(res, "All required address fields must be provided", 400);
//     }

//     const user = await User.findById(userId);
//     if (!user) return errorResponse(res, "User not found", 404);

//     // if new address is default, remove previous defaults
//     if (isDefault) {
//       user.addresses.forEach(addr => (addr.isDefault = false));
//     }

//     user.addresses.push({ label, name, phone, line1, line2, city, state, postalCode, country, isDefault });
//     await user.save();

//     return successResponse(res, "Address added successfully", user.addresses, 201);
//   } catch (err) {
//     next(err);
//   }
// };

// // ✅ Get All Addresses
// export const getAddresses = async (req, res, next) => {
//   try {
//     const user = await User.findById(req.user.id).select("addresses");
//     if (!user) return errorResponse(res, "User not found", 404);

//     return successResponse(res, "Addresses fetched successfully", user.addresses, 200);
//   } catch (err) {
//     next(err);
//   }
// };

// // ✅ Update Address
// export const updateAddress = async (req, res, next) => {
//   try {
//     const { addressId } = req.params;
//     const updates = req.body;

//     const user = await User.findById(req.user.id);
//     if (!user) return errorResponse(res, "User not found", 404);

//     const address = user.addresses.id(addressId);
//     if (!address) return errorResponse(res, "Address not found", 404);

//     // if this one is marked default, reset all others
//     if (updates.isDefault) {
//       user.addresses.forEach(addr => (addr.isDefault = false));
//     }

//     Object.assign(address, updates); // merge new values
//     await user.save();

//     return successResponse(res, "Address updated successfully", user.addresses, 200);
//   } catch (err) {
//     next(err);
//   }
// };

// // ✅ Delete Address
// export const deleteAddress = async (req, res, next) => {
//   try {
//     const { addressId } = req.params;

//     const user = await User.findById(req.user.id);
//     if (!user) return errorResponse(res, "User not found", 404);

//     const address = user.addresses.id(addressId);
//     if (!address) return errorResponse(res, "Address not found", 404);

//     address.deleteOne(); // remove subdocument
//     await user.save();

//     return successResponse(res, "Address deleted successfully", user.addresses, 200);
//   } catch (err) {
//     next(err);
//   }
// };
