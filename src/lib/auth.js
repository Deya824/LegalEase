
import dns from "node:dns";
dns.setServers(["8.8.8.8", "8.8.4.4"]);
dns.setDefaultResultOrder("ipv4first");
import { betterAuth } from "better-auth";
import { MongoClient } from "mongodb";
import { mongodbAdapter } from "better-auth/adapters/mongodb";
import { jwt } from "better-auth/plugins";


const client = new MongoClient(process.env.MONGO_DB_URI);
await client.connect(); 
const db = client.db(process.env.AUTH_DB_NAME);

export const auth = betterAuth({
    baseURL: process.env.BETTER_AUTH_URL,
    
    emailAndPassword: {
        enabled: true,
    },
     socialProviders: {
        google: { 
            clientId: process.env.GOOGLE_CLIENT_ID , 
            clientSecret: process.env.GOOGLE_SECRET, 
        }, 
    },
    database: mongodbAdapter(db, {
        // Optional: if you don't provide a client, database transactions won't be enabled.
        client
    }),
    user: {
        additionalFields: {
            role: {
                type: "string",
              
                default: "seeker"
            }
        }
    }
    ,
    session: {
    cookieCache: {
      enabled: true,
      strategy: "jwt",
      maxAge: 60 * 24 * 60,
    },
  },
  plugins: [jwt()],
}
);