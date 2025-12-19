import type { Request, Response } from "express";
import { verifyWebhook } from "@clerk/express/webhooks";
import type { WebhookEvent } from "@clerk/express";
import "dotenv/config";
import { prisma } from "../../lib/prisma";

const handleWebhook = async (req: Request, res: Response) => {
  try {
    const evt = (await verifyWebhook(req)) as WebhookEvent;
    const { id } = evt.data;
    const eventType = evt.type;
    
    console.log(`Received webhook with ID ${id} and event type of ${eventType}`);
    console.log("Webhook payload:", evt.data);

    // Handle different event types
    switch (eventType) {
      case "user.created":
        await handleUserCreated(evt);
        break;
      
      case "user.updated":
        await handleUserUpdated(evt);
        break;
      
      case "user.deleted":
        await handleUserDeleted(evt);
        break;
      
      default:
        console.log(`Unhandled event type: ${eventType}`);
    }

    return res.status(200).json({ received: true });
  } catch (err) {
    console.error("Error verifying webhook:", err);
    return res.status(400).json({ error: "Error verifying webhook" });
  }
};

// Handler for user.created
async function handleUserCreated(evt: WebhookEvent) {
    if (evt.type !== "user.created") return;

  const { id, first_name, last_name, username, email_addresses, image_url } = evt.data;

  try {
    const user = await prisma.user.create({
      data: {
        clerkId: id,
        username: username || "",
        firstname: first_name || "",
        lastname: last_name || "",
        email: email_addresses?.[0]?.email_address || "",
        imageUrl: image_url
      },
    });
    
    console.log("✅ Created user:", user);
  } catch (error) {
    console.error("❌ Error creating user:", error);
    throw error;
  }
}

// Handler for user.updated
async function handleUserUpdated(evt: WebhookEvent) {
     if (evt.type !== "user.updated") return;
  const { id, first_name, last_name, username, email_addresses, image_url} = evt.data;

  try {
    const user = await prisma.user.update({
      where: { clerkId: id },
      data: {
        username: username || "",
        firstname: first_name || "",
        lastname: last_name,
        email: email_addresses?.[0]?.email_address || "",
        imageUrl: image_url
      },
    });
    
    console.log("✅ Updated user:", user);
  } catch (error) {
    console.error("❌ Error updating user:", error);
    throw error;
  }
}

// Handler for user.deleted
async function handleUserDeleted(evt: WebhookEvent) {
  const { id } = evt.data;

  try {
    const user = await prisma.user.delete({
      where: { clerkId: id }
    });
    
    console.log("✅ Deleted user:", user);
  } catch (error) {
    console.error("❌ Error deleting user:", error);
    throw error;
  }
}

export default handleWebhook;