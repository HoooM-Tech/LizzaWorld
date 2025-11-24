import { defineConfig } from "sanity";
import { deskTool } from "sanity/desk";
import { visionTool } from "@sanity/vision";
import { schemaTypes } from "./schemas";

export default defineConfig({
  name: "default",
  title: "Lizzaworld Atelier Studio",
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET!,
  plugins: [
    deskTool({
      structure: (S:any) =>
        S.list()
          .title("Content")
          .items([
            S.listItem()
              .title("Singles")
              .child(
                S.list()
                  .title("Singles")
                  .items([
                    S.listItem().title("Site Settings").child(
                      S.document().schemaType("siteSettings").documentId("siteSettings")
                    ),
                    S.listItem().title("Home Page").child(
                      S.document().schemaType("homePage").documentId("homePage")
                    ),
                    S.listItem().title("Bespoke & Bridal Page").child(
                      S.document().schemaType("bespokePage").documentId("bespokePage")
                    ),
                    S.listItem().title("Founder Bio").child(
                      S.document().schemaType("founderBio").documentId("founderBio")
                    ),
                    S.listItem().title("Policies").child(
                      S.document().schemaType("policies").documentId("policies")
                    ),
                    S.listItem().title("Consultation Options").child(
                      S.document().schemaType("consultationOptions").documentId("consultationOptions")
                    ),
                  ])
              ),

            S.divider(),

            S.listItem()
              .title("Collections")
              .child(
                S.list()
                  .title("Collections")
                  .items([
                    S.documentTypeListItem("collection").title("Collections"),
                    S.documentTypeListItem("product").title("Products"),
                    S.documentTypeListItem("testimonial").title("Testimonials"),
                  ])
              ),
          ]),
    }),
    visionTool(),
  ],
  schema: { types: schemaTypes },
});
