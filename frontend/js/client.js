// 1. Utility Functions
// 1.1 load template
async function loadTemplate(name) {
  const response = await fetch(`/templates/${name}`);
  return await response.text();
}
// 1.2 Fetch and create bunny cards
async function fetchBunnies() {
  try {
    const response = await fetch("/api/bunnies");
    const data = await response.json();
    return data.bunnies;
  } catch (error) {
    console.error("Error fetching bunnies:", error);
    return [];
  }
}

// 2. Navigation functions
// 2.1 Show page event listener
document.querySelectorAll(".nav-link").forEach((link) => {
  link.addEventListener("click", async (e) => {
    e.preventDefault();
    const button = e.target.closest(".nav-link");
    const page = button.getAttribute("data-page");

    // Update active state immediately
    document
      .querySelectorAll(".nav-link")
      .forEach((l) => l.classList.remove("active"));
    button.classList.add("active");

    // Then load the page content
    await showPage(page);
  });
});
// 2.2 Show page function
async function showPage(page) {
  const gallerySection = document.getElementById("gallerySection");
  const forumSection = document.getElementById("forumSection");

  [gallerySection, forumSection].forEach((section) => {
    section.classList.add("section-hidden");
    section.classList.remove("section-visible");
  });

  if (page === "gallery") {
    requestAnimationFrame(() => {
      gallerySection.classList.remove("section-hidden");
      gallerySection.classList.add("section-visible");
    });
    await createBunnyCards();
  } else if (page === "forum") {
    requestAnimationFrame(() => {
      forumSection.classList.remove("section-hidden");
      forumSection.classList.add("section-visible");
    });
    await loadBunnies(document.getElementById("bunnySelect"));
    await createBunnyFilters();
    await loadStories();
  }
}

// 3. Gallery functions
// 3.1 Create bunny cards
async function createBunnyCards() {
  const gallery = document.getElementById("gallerySection");
  gallery.innerHTML = "";

  try {
    const [bunnies, template] = await Promise.all([
      fetchBunnies(),
      loadTemplate("bunny-card.html"),
    ]);

    bunnies.forEach((bunny) => {
      const card = document.createElement("div");
      card.className = "col-md-4 mb-4";

      let cardHtml = template;
      const price = parseFloat(bunny.price.replace("$", ""));

      // Replace template variables
      cardHtml = cardHtml
        .replace(/\${name}/g, bunny.name)
        .replace(/\${image}/g, bunny.image)
        .replace(/\${price}/g, price.toFixed(2))
        .replace(/\${link}/g, bunny.link || "");

      card.innerHTML = cardHtml;
      gallery.appendChild(card);
    });
  } catch (error) {
    console.error("Error creating bunny cards:", error);
  }
}

// 4. Forum functions

// 4.1 Load bunnies into select element
async function loadBunnies(selectElement, currentBunny = null) {
  const bunnies = await fetchBunnies();

  if (!selectElement) {
    console.error("No select element provided");
    return;
  }

  selectElement.innerHTML = '<option value="">Choose a bunny...</option>';

  bunnies.forEach((bunny) => {
    const option = document.createElement("option");
    option.value = bunny.name;
    option.textContent = bunny.name;
    if (currentBunny && bunny.name === currentBunny) {
      option.selected = true;
    }
    selectElement.appendChild(option);
  });
}
// 4.2 Filter stories functions
// 4.2.1 Global variable to store current filter
let currentBunnyFilter = null;

// 4.2.2 Function to create bunny filter tags
async function createBunnyFilters() {
  const bunnies = await fetchBunnies();
  const filterContainer = document.getElementById("bunnyFilterContainer");

  filterContainer.innerHTML = "";

  const allTag = document.createElement("button");
  allTag.className = "btn btn-sm bunny-tag active";
  allTag.textContent = "All";
  allTag.addEventListener("click", () => filterStories(null));
  filterContainer.appendChild(allTag);

  // Add filter for each bunny
  bunnies.forEach((bunny) => {
    const tag = document.createElement("button");
    tag.className = "btn btn-sm bunny-tag";
    tag.textContent = bunny.name;
    tag.addEventListener("click", () => filterStories(bunny.name));
    filterContainer.appendChild(tag);
  });
}

// 4.2.3 Function to filter stories
function filterStories(bunnyName) {
  currentBunnyFilter = bunnyName;

  // Update active state of filter tags
  document.querySelectorAll(".bunny-tag").forEach((tag) => {
    if (
      (bunnyName === null && tag.textContent === "All") ||
      tag.textContent === bunnyName
    ) {
      tag.classList.add("active");
    } else {
      tag.classList.remove("active");
    }
  });

  // Filter the stories
  const stories = document.querySelectorAll("#postsContainer .col-md-6");
  stories.forEach((story) => {
    const storyBunny = story
      .querySelector(".card-subtitle:nth-child(3)")
      .textContent.replace("Bunny: ", "")
      .trim();

    if (bunnyName === null || storyBunny === bunnyName) {
      story.classList.remove("story-hidden");
    } else {
      story.classList.add("story-hidden");
    }
  });
}

// 4.3 Forum Function for story management
// 4.3.1 Load stories
async function loadStories() {
  try {
    const response = await fetch("/api/stories");
    const stories = await response.json();

    const storiesContainer = document.getElementById("postsContainer");
    storiesContainer.innerHTML = "";

    const row = document.createElement("div");
    row.className = "row g-4";

    stories.forEach(async (story) => {
      const storyElement = await createStoryElement(story); // Wait for element creation
      if (storyElement) {
        if (currentBunnyFilter) {
          const storyBunny = story.bunnyName;
          if (storyBunny !== currentBunnyFilter) {
            storyElement.classList.add("story-hidden");
          }
        }
        row.appendChild(storyElement);
      }
    });

    storiesContainer.appendChild(row);
  } catch (error) {
    console.error("Error loading stories:", error);
  }
}

//4.3.2 Function to create story element
async function createStoryElement(story) {
  if (!story) {
    console.error("No story data provided to createStoryElement");
    return null;
  }

  try {
    // Fetch template
    const template = await loadTemplate("story-card.html");

    // Create column wrapper for the story card
    const columnWrapper = document.createElement("div");
    columnWrapper.className = "col-md-6";

    const storyElement = document.createElement("div");
    storyElement.className = "card h-100";
    storyElement.setAttribute("data-story-id", story._id || "");

    // Prepare data for template
    const data = {
      title: story?.title ?? "Untitled",
      userName: story?.userName ?? "Anonymous",
      bunnyName: story?.bunnyName ?? "Not specified",
      content: story?.content ?? "",
      createdAt: story?.createdAt
        ? new Date(story.createdAt).toLocaleDateString()
        : "Just now",
      storyId: story._id || "",
    };

    // Replace all placeholders in template
    let html = template;
    Object.keys(data).forEach((key) => {
      const regex = new RegExp(`\\$\\{${key}\\}`, "g");
      html = html.replace(regex, data[key]);
    });

    storyElement.innerHTML = html;

    // Add event listeners
    const deleteBtn = storyElement.querySelector(".delete-btn");
    const editBtn = storyElement.querySelector(".edit-btn");
    const editForm = storyElement.querySelector(".edit-form");
    const saveBtn = storyElement.querySelector(".save-btn");

    deleteBtn.addEventListener("click", async () => {
      if (confirm("Delete this story?")) {
        try {
          const response = await fetch(`/api/stories/${story._id}/delete`, {
            method: "POST",
          });
          if (response.ok) {
            await loadStories();
          }
        } catch (error) {
          console.error("Error deleting story:", error);
        }
      }
    });

    editBtn.addEventListener("click", async () => {
      editForm.style.display = "block";

      const currentBunny = storyElement
        .querySelector(".card-subtitle:nth-child(3)")
        .textContent.replace("Bunny: ", "")
        .trim();

      // Get the form and bunny select by name
      const form = editForm.querySelector("form");
      await loadBunnies(form.bunnyName, currentBunny);

      const cancelBtn = editForm.querySelector(".cancel-btn");
      cancelBtn.onclick = () => {
        editForm.classList.remove("show");
        editForm.style.display = "none";
      };

      editForm.classList.add("show");
      form.userName.focus();
    });

    saveBtn.addEventListener("click", async () => {
      const form = editForm.querySelector("form");
      const formData = {
        userName: form.userName.value.trim(),
        title: form.title.value.trim(),
        bunnyName: form.bunnyName.value.trim(),
        content: form.content.value.trim(),
      };

      if (Object.values(formData).some((value) => !value)) {
        alert("All fields are required.");
        return;
      }

      try {
        const response = await fetch(`/api/stories/${story._id}/update`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData),
        });

        if (response.ok) {
          // Update display
          storyElement.querySelector(".card-title").textContent =
            formData.title;
          storyElement.querySelector(
            ".card-subtitle:nth-child(2)"
          ).textContent = `By ${formData.userName}`;
          storyElement.querySelector(
            ".card-subtitle:nth-child(3)"
          ).textContent = `Bunny: ${formData.bunnyName}`;
          storyElement.querySelector(".card-text").textContent =
            formData.content;

          // Hide form
          editForm.classList.remove("show");
          editForm.style.display = "none";
        } else {
          const errorData = await response.json();
          alert(errorData.error || "Failed to update story");
        }
      } catch (error) {
        console.error("Error updating story:", error);
        alert("Failed to update story. Please try again.");
      }
    });

    columnWrapper.appendChild(storyElement);
    return columnWrapper;
  } catch (error) {
    console.error("Error creating story element:", error);
    return null;
  }
}

// 4.3.3 Handle create new story form submission
document.getElementById("postForm").addEventListener("submit", async (e) => {
  e.preventDefault();

  const form = e.target;
  const storyData = {
    userName: form.userName.value,
    title: form.postTitle.value,
    bunnyName: form.bunnySelect.value,
    content: form.postContent.value,
  };

  try {
    const response = await fetch("/api/stories", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(storyData),
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error("Server error response:", errorData);
      throw new Error(errorData.error || "Failed to create story");
    }

    // Wait for the new story to be created
    const newStory = await response.json();
    console.log("Server response:", newStory);

    // Clear the form before loading new content
    form.reset();

    // Update the forum section
    const forumSection = document.getElementById("forumSection");
    forumSection.classList.remove("section-hidden");
    forumSection.classList.add("section-visible");

    // Ensure bunny filters are created before loading stories
    await createBunnyFilters();

    // Finally load the stories
    await loadStories();
  } catch (error) {
    console.error("Error creating story:", error);
  }
});

// 5. Page initialize
document.addEventListener("DOMContentLoaded", async () => {
  // Show gallery by default
  await showPage("gallery");

  // Set gallery link as active
  document.getElementById("galleryLink").classList.add("active");
});
