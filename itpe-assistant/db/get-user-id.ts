/**
 * Get the first user ID from the database
 */

import { db, user } from "./index";

async function getUserId() {
  try {
    const users = await db.select().from(user).limit(1);

    if (users.length === 0) {
      console.log("❌ No users found in database");
      console.log("Please create a user account first by signing in to the app");
      process.exit(1);
    }

    console.log("✅ Found user:");
    console.log("   ID:", users[0].id);
    console.log("   Name:", users[0].name);
    console.log("   Email:", users[0].email);
    console.log("");
    console.log("Use this command to seed DevOps data:");
    console.log(`SEED_USER_ID="${users[0].id}" pnpm db:seed-devops`);

    process.exit(0);
  } catch (error) {
    console.error("❌ Error:", error);
    process.exit(1);
  }
}

getUserId();
