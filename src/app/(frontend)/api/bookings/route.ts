// app/api/bookings/route.ts
import { NextRequest, NextResponse } from "next/server";
import { getPayload } from "payload";
import config from "@payload-config";
import { format } from "date-fns";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const payload = await getPayload({ config });

    // 1. Create booking in Payload
    const booking = await payload.create({
      collection: "bookings",
      data: body,
    });

    // 2. Fetch room details
    const room = await payload.findByID({
      collection: "rooms",
      id: body.room,
    });

    const checkInFormatted = format(new Date(body.checkIn), "EEEE, MMMM d, yyyy");
    const checkOutFormatted = format(new Date(body.checkOut), "EEEE, MMMM d, yyyy");

    // —————————————————————————————
    // 3. Send CONFIRMATION to GUEST
    // —————————————————————————————
    await payload.sendEmail({
      from: `"Pallete Suites" <${process.env.SMTP_USER}>`,
      to: body.email,
      subject: `Booking Confirmed: ${room.name} – Pallete Suites`,
      html: getGuestEmailHTML({ ...body, roomName: room.name, checkInFormatted, checkOutFormatted }),
    });

    // —————————————————————————————
    // 4. Send NOTIFICATION to STAFF (multiple recipients)
    // —————————————————————————————
    const staffEmails = [
      "awajimijandev@gmail.com",
     
      // Add more as needed
    ].filter(Boolean);

    if (staffEmails.length > 0) {
      await payload.sendEmail({
        from: `"New Booking Alert" <${process.env.SMTP_USER}>`,
        to: staffEmails, // Can be array!
        subject: `New Booking: ${room.name} – ${body.firstName} ${body.lastName}`,
        html: getStaffEmailHTML({ ...body, roomName: room.name, checkInFormatted, checkOutFormatted }),
      });
    }

    return NextResponse.json({ success: true, booking }, { status: 201 });
  } catch (error: any) {
    console.error("Booking or email failed:", error);
    return NextResponse.json(
      { error: "Failed to process booking", details: error.message },
      { status: 500 }
    );
  }
}

// —————————————————————————————
// GUEST EMAIL TEMPLATE
// —————————————————————————————
function getGuestEmailHTML({
  firstName,
  roomName,
  checkInFormatted,
  checkOutFormatted,
  guests,
  totalNights,
  totalPrice,
}: any) {
  return `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 20px auto; padding: 30px; background: #0f0f0f; color: #f0f0f0; border-radius: 16px;">
      <h1 style="color: #D4AF37; text-align: center; font-size: 28px;">Welcome, ${firstName}!</h1>
      <p style="text-align: center; font-size: 16px;">Your stay at Pallete Suites has been confirmed.</p>
      
      <div style="background: #1a1a1a; padding: 24px; border-radius: 12px; margin: 24px 0;">
        <h2 style="color: #D4AF37; margin: 0 0 16px;">Booking Details</h2>
        <p><strong>Room:</strong> ${roomName}</p>
        <p><strong>Check-in:</strong> ${checkInFormatted}</p>
        <p><strong>Check-out:</strong> ${checkOutFormatted}</p>
        <p><strong>Guests:</strong> ${guests}</p>
        <p><strong>Duration:</strong> ${totalNights} night${totalNights > 1 ? "s" : ""}</p>
        <p style="font-size: 20px; color: #D4AF37; margin-top: 20px;"><strong>Total: $${totalPrice}</strong></p>
      </div>

      <div style="text-align: center; margin: 32px 0;">
        <a href="https://palletesuites.com/my-bookings" style="background: #D4AF37; color: #121212; padding: 14px 32px; text-decoration: none; border-radius: 8px; font-weight: bold;">View Your Booking</a>
      </div>

      <p style="text-align: center; color: #999; font-size: 14px;">
        Questions? Reply or call +234 812 345 6789<br>
        © 2025 Pallete Suites. A legacy since 1928.
      </p>
    </div>
  `;
}

// —————————————————————————————
// STAFF NOTIFICATION TEMPLATE
// —————————————————————————————
function getStaffEmailHTML({
  firstName,
  lastName,
  email,
  phone,
  roomName,
  checkInFormatted,
  checkOutFormatted,
  guests,
  totalNights,
  totalPrice,
}: any) {
  return `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 20px auto; padding: 30px; background: #ffffff; border: 2px solid #D4AF37; border-radius: 12px;">
      <h1 style="color: #D4AF37; text-align: center;">New Booking Received!</h1>
      
      <div style="background: #f9f9f9; padding: 20px; border-radius: 8px; margin: 20px 0;">
        <p><strong>Guest:</strong> ${firstName} ${lastName}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Phone:</strong> ${phone || "Not provided"}</p>
        <hr style="border: 1px dashed #ddd; margin: 16px 0;">
        <p><strong>Room:</strong> ${roomName}</p>
        <p><strong>Check-in:</strong> ${checkInFormatted}</p>
        <p><strong>Check-out:</strong> ${checkOutFormatted}</p>
        <p><strong>Guests:</strong> ${guests}</p>
        <p><strong>Duration:</strong> ${totalNights} night${totalNights > 1 ? "s" : ""}</p>
        <p style="font-size: 18px; color: #D4AF37;"><strong>Total Amount: $${totalPrice}</strong></p>
      </div>

      <div style="text-align: center; margin-top: 24px;">
        <a href="http://localhost:3000/admin/collections/bookings" 
           style="background: #121212; color: #D4AF37; padding: 12px 28px; text-decoration: none; border-radius: 8px; font-weight: bold;">
          View in Admin Panel
        </a>
      </div>

      <p style="text-align: center; color: #666; font-size: 12px; margin-top: 30px;">
        This is an automated alert from Pallete Suites booking system.
      </p>
    </div>
  `;
}