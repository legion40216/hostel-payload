import { postgresAdapter } from "@payloadcms/db-postgres";
import { lexicalEditor } from "@payloadcms/richtext-lexical";
import path from "path";
import { buildConfig } from "payload";
import { fileURLToPath } from "url";
import sharp from "sharp";
import { cloudinaryStorage } from "@pemol/payload-cloudinary"; // Add this import

import { Users } from "./collections/Users";
import { Media } from "./collections/Media";
import { Hostels } from "./collections/Hostels";
import { Tenants } from "./collections/Tenants";
import { Payments } from "./collections/Payments";

const filename = fileURLToPath(import.meta.url);
const dirname = path.dirname(filename);

export default buildConfig({
  admin: {
    user: Users.slug,
    importMap: {
      baseDir: path.resolve(dirname),
    },
  },
  collections: [Users, Media, Hostels, Tenants, Payments],
  editor: lexicalEditor(),
  secret: process.env.PAYLOAD_SECRET || "",
  typescript: {
    outputFile: path.resolve(dirname, "payload-types.ts"),
  },
  db: postgresAdapter({
    pool: {
      connectionString: process.env.DATABASE_URL || "",
    },
  }),
  sharp,
plugins: [
    cloudinaryStorage({
      config: {
        // Adding || "" tells TypeScript: "If the env is missing, use an empty string"
        cloud_name: process.env.CLOUDINARY_CLOUD_NAME || "",
        api_key: process.env.CLOUDINARY_API_KEY || "",
        api_secret: process.env.CLOUDINARY_API_SECRET || "",
      },
      collections: {
        media: true, 
      },
    }),
  ],
});