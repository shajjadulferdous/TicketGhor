import { betterAuth } from "better-auth";
import { MongoClient } from "mongodb";
import { mongodbAdapter } from "better-auth/adapters/mongodb";
import { jwt } from "better-auth/plugins"
const client = new MongoClient(process.env.MONGODB_URI);
const db = client.db('ticketGhor');

export const auth = betterAuth({
  emailAndPassword: { 
    enabled: true, 
  }, 
  user: {
       additionalFields: {
          role: {
              defaultValue:"user"
            } 
        }
    },
     plugins: [
        jwt(), 
    ],
   session: {
        cookieCache: {
            enabled: true,
            maxAge: 5 * 60,
            strategy: "jwt" 
        }
    },
  database: mongodbAdapter(db, {
    // Optional: if you don't provide a client, database transactions won't be enabled.
    client
  }),
});