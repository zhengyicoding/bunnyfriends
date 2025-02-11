import { writeFileSync } from "fs";

// Extract real bunny names from the provided data
const bunnyNames = [
  "Horticus Hare",
  "Smudge Apricot Rabbit",
  "Smudge Rabbit",
  "Bashful Beige Bunny",
  "Bashful Silver Bunny",
  "Smudge Lavender Rabbit",
  "Blossom Beige Bunny 'Petal'",
  "Blossom Blush Bunny 'Cherry'",
  "Bashful Bunny 'Peony'",
  "Blossom Cream Bunny 'Berry'",
  "Blossom Silver Bunny 'Bloom'",
  "Bashful Luxe Amberley Bunny",
  "Bashful Red Love Heart Bunny",
  "Bashful Carrot Bunny",
  "Lottie Bunny Fairy",
  "Bashful Cream Bunny",
  "Bashful Blush Bunny",
  "Bashful Luxe Bunny Rosa",
  "Yummy Bunny",
  "Bashful Christmas Bunny Decoration",
  "Bashful Luxe Bunny Scarlett",
  "Bashful Cranberry Bunny",
  "Bashful Luxe Bunny Willow",
  "Bashful Nutmeg Bunny",
  "Bashful Christmas Bunny",
  "Bashful Ivy Bunny",
  "Bashful Luxe Bunny Nimbus",
  "Hibernating Bunny",
  "Bashful Bunny with Candy Cane",
  "Bashful Sorrel Bunny",
  "Rock-a-Bye Bunny",
  "Lottie Bunny Ballet",
  "Little Bunny",
  "Cuddlebud Bernard Bunny",
  "Bonnie Bunny with Egg",
  "Blossom Sage Bunny",
  "Blossom Cherry Bunny",
  "Blossom Blush Bunny",
  "Bashful Bunny with Present",
  "Bashful Viola Bunny",
  "Bashful Twinkle Bunny",
  "Bashful Moss Bunny",
  "Bashful Luxe Bunny Luna",
  "Bashful Luxe Bunny Azure",
  "Bashful Tulip Pink Bunny",
  "Ambrosie Hare",
  "Bashful Bunny with Christmas Tree",
  "Bashful Evey Bunny",
  "Bashful Pumpkin Bunny",
  "Bashful Bunny with Pencil",
  "Bashful Luxe Bunny Juniper",
  "Messenger Bunny",
];

const userNames = [
  "BunnyLover",
  "CarrotCrunch",
  "HoppityHop",
  "WhiskerWatcher",
  "BinkyBooster",
  "FlopEar",
  "HayMuncher",
  "BunParent",
  "LettuceLeaf",
  "CageClean",
  "BunnyBuddy",
  "VeggieFriend",
  "PawPrints",
  "NibblesAlot",
  "BunnyWhisperer",
];

const titleTemplates = [
  "First Day with BUNNY",
  "BUNNY's Morning Adventure",
  "Bonding Time with BUNNY",
  "BUNNY Discovers Something New",
  "A Special Moment with BUNNY",
  "BUNNY's Playful Day",
  "Adventures in the Garden with BUNNY",
  "BUNNY's New Toy",
  "Training Success with BUNNY",
  "BUNNY's Funny Habit",
];

const contentTemplates = [
  "BUNNY has been showing such personality today! TIME they ACTIVITY. It's amazing how each bunny has their own unique character.",
  "Spent the afternoon with BUNNY. TIME we worked on ACTIVITY. These moments are what make having a bunny so special.",
  "BUNNY surprised me today! TIME they started ACTIVITY. It's incredible to see them grow and learn new things.",
  "Had a breakthrough with BUNNY today. TIME I noticed they ACTIVITY. Every day brings something new with these wonderful pets.",
  "BUNNY's been extra cuddly today. TIME they ACTIVITY, melting my heart completely. These are the moments I cherish.",
  "Training session with BUNNY went great! TIME they mastered ACTIVITY. So proud of their progress!",
  "BUNNY showed their clever side today. TIME they figured out how to ACTIVITY. These little buns are so smart!",
  "Quality time with BUNNY is the best. TIME we spent the afternoon ACTIVITY. Couldn't ask for a better bunny companion.",
  "BUNNY's personality really shone today! TIME they decided to ACTIVITY. Always keeping me entertained!",
  "Made memories with BUNNY today. TIME they surprised me by ACTIVITY. These are the moments that make it all worthwhile.",
];

const activities = [
  "doing binkies in the living room",
  "exploring their new tunnel",
  "learning to use the litter box",
  "eating their first carrot",
  "grooming their new bunny friend",
  "playing with their favorite toy",
  "begging for treats",
  "following me around the house",
  "doing zoomies in the garden",
  "snuggling on the couch",
  "investigating new toys",
  "munching on fresh hay",
  "showing off their jumping skills",
  "discovering the joys of cardboard boxes",
  "mastering their trick training",
];

const timeOfDay = [
  "In the morning",
  "During the afternoon",
  "Just before sunset",
  "Early today",
  "After dinner",
  "During playtime",
  "While cleaning their cage",
  "At feeding time",
  "During free-roam hours",
  "Right after breakfast",
];

// Helper function to get random item from array
const getRandomItem = (arr) => arr[Math.floor(Math.random() * arr.length)];

// Helper function to generate random date
const getRandomDate = (start, end) => {
  const startTime = start.getTime();
  const endTime = end.getTime();
  return new Date(startTime + Math.random() * (endTime - startTime));
};

const generateStories = (count) => {
  const startDate = new Date("2023-01-01");
  const endDate = new Date("2024-02-10");

  const stories = [...Array(count)].map(() => {
    const randomDate = getRandomDate(startDate, endDate);
    const userName = `${getRandomItem(userNames)}${Math.floor(Math.random() * 999)}`;
    const bunnyName = getRandomItem(bunnyNames);

    const title = getRandomItem(titleTemplates).replace("BUNNY", bunnyName);
    const content = getRandomItem(contentTemplates)
      .replace("BUNNY", bunnyName)
      .replace("TIME", getRandomItem(timeOfDay))
      .replace("ACTIVITY", getRandomItem(activities));

    return {
      userName,
      title,
      bunnyName,
      content,
      createdAt: randomDate.toISOString(),
    };
  });

  // Sort by date descending
  return {
    stories: stories.sort(
      (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
    ),
  };
};

// Generate stories and save to file
try {
  const mockData = generateStories(1000);
  writeFileSync("stories.json", JSON.stringify(mockData, null, 2));
  console.log("✨ Successfully generated stories.json with 1000 stories!");
} catch (error) {
  console.error("Error generating stories:", error);
}
