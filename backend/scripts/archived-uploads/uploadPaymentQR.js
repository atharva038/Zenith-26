import {v2 as cloudinary} from "cloudinary";
import dotenv from "dotenv";

dotenv.config();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

async function uploadPaymentQR() {
  try {
    // Upload the payment QR code image (Sagar Ubale - sagarubale2004@oksbi)
    const result = await cloudinary.uploader.upload(
      "../frontend/public/img/QR.png",
      {
        folder: "zenith-26/img/payment",
        public_id: "payment-qr-sagar-ubale",
        transformation: [
          {width: 400, crop: "limit"},
          {quality: "auto:best"},
          {fetch_format: "auto"},
        ],
      }
    );

    console.log("✅ Payment QR code uploaded successfully!");
    console.log("Public ID:", result.public_id);
    console.log("Version:", result.version);
    console.log("Full URL:", result.secure_url);
    console.log("\n📋 Use this URL in your components:");
    console.log(result.secure_url);
    console.log("\n📋 Or use the optimized URL:");
    console.log(
      `https://res.cloudinary.com/dvmsho3pj/image/upload/f_auto,q_auto:best/v${result.version}/zenith-26/img/payment/payment-qr-sagar-ubale`
    );
  } catch (error) {
    console.error("❌ Upload failed:", error.message);
  }
}

uploadPaymentQR();
