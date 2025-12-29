import { postgresAdapter } from "@payloadcms/db-postgres";
import { lexicalEditor } from "@payloadcms/richtext-lexical";
import path from "path";
import { buildConfig } from "payload";
import { fileURLToPath } from "url";
import sharp from "sharp";
import { cloudStorage } from "@payloadcms/plugin-cloud-storage";
import { cloudinaryAdapter } from "@payloadcms/plugin-cloud-storage/cloudinary";

import { Users } from "./collections/Users";
import { Media } from "./collections/Media";
import { Hostels } from "./collections/Hostels";

const filename = fileURLToPath(import.meta.url);
const dirname = path.dirname(filename);

export default buildConfig({
  admin: {
    user: Users.slug,
    importMap: {
      baseDir: path.resolve(dirname),
    },
  },
  collections: [Users, Media, Hostels],
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
    cloudStorage({
      collections: {
        media: {
          adapter: cloudinaryAdapter({
            config: {
              cloud_name: process.env.CLOUDINARY_CLOUD_NAME || "",
              api_key: process.env.CLOUDINARY_API_KEY || "",
              api_secret: process.env.CLOUDINARY_API_SECRET || "",
            },
          }),
        },
      },
    }),
  ],
});