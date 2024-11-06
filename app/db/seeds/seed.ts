import { prisma } from "../prisma.server";
import storiesData from "../data/test-data/stories";

async function seed() {
  console.log("Seeding database...");

  await prisma.stories.deleteMany();

  await prisma.stories.createMany({
    data: storiesData,
  });

  console.log("Database seeded successfully!");
}

export default seed;
