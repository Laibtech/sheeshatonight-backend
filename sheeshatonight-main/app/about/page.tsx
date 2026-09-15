import { prisma } from "@/lib/prisma";
import AboutClient from "./AboutClient";

export const revalidate = 60;

export default async function AboutPage() {
  const page = await prisma.cmsPage.findUnique({
    where: { slug: "about" },
  }).catch(() => null);

  return <AboutClient cmsContent={page?.content || null} />;
}
