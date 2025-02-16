// Navigation handling
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

// Fetch and create bunny cards
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

async function createBunnyCards() {
  const gallery = document.getElementById("gallerySection");
  gallery.innerHTML = ""; // Clear existing cards

  const bunnies = await fetchBunnies();
  bunnies.forEach((bunny) => {
    const price = parseFloat(bunny.price.replace("$", ""));
    const card = document.createElement("div");
    card.className = "col-md-4 mb-4";
    card.innerHTML = `
        <div class="card bunny-card h-100">
          <div class="card-img-container">
            <img src="${bunny.image}" class="card-img-top" alt="${bunny.name}">
          </div>
          <div class="card-body">
            <h5 class="card-title">${bunny.name}</h5>
            <p class="card-text">$${price.toFixed(2)}</p>
                 ${
                   bunny.link
                     ? `<a href="${bunny.link}" class="btn btn-primary" target="_blank">View Details</a>`
                     : ""
                 }
          </div>
        </div>
      `;
    gallery.appendChild(card);
  });
}

// Handle forum part
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

// Global variable to store current filter
let currentBunnyFilter = null;

// Function to create bunny filter tags
async function createBunnyFilters() {
  const bunnies = await fetchBunnies();
  const filterContainer = document.getElementById("bunnyFilterContainer");

  // Clear existing filters
  filterContainer.innerHTML = "";

  // Add "All" filter
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

// Function to filter stories
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
// load and render stories in the database on the forum page
async function loadStories() {
  try {
    const response = await fetch("/api/stories");
    const stories = await response.json();

    const storiesContainer = document.getElementById("postsContainer");
    storiesContainer.innerHTML = "";

    const row = document.createElement("div");
    row.className = "row g-4";

    stories.forEach((story) => {
      const storyElement = createStoryElement(story);
      if (storyElement) {
        // Apply current filter if exists
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
function createStoryElement(story) {
  if (!story) {
    console.error("No story data provided to createStoryElement");
    return null;
  }

  // Create column wrapper for the story card
  const columnWrapper = document.createElement("div");
  columnWrapper.className = "col-md-6"; // Makes it take up half the row on medium screens and larger

  const storyElement = document.createElement("div");
  storyElement.className = "card h-100"; // Added h-100 to make cards in the same row equal height
  storyElement.setAttribute("data-story-id", story._id || "");

  const title = story?.title ?? "Untitled";
  const userName = story?.userName ?? "Anonymous";
  const bunnyName = story?.bunnyName ?? "Not specified";
  const content = story?.content ?? "";
  const createdAt = story?.createdAt
    ? new Date(story.createdAt).toLocaleDateString()
    : "Just now";

  storyElement.innerHTML = `
    <div class="card-body d-flex flex-column">
      <h5 class="card-title">${title}</h5>
      <h6 class="card-subtitle mb-2 text-muted">By ${userName}</h6>
      <h6 class="card-subtitle mb-2 text-muted">Bunny: ${bunnyName}</h6>
      <p class="card-text flex-grow-1">${content}</p>
      <div class="mt-auto">
        <small class="text-muted d-block mb-2">Posted ${createdAt}</small>
        <div class="d-flex gap-2">
          <button class="btn btn-warning btn-sm edit-btn">Edit</button>
          <button class="btn btn-danger btn-sm delete-btn">Delete</button>
        </div>
      </div>
      <div class="edit-form mt-3">
        <form class="card p-3 bg-light">
          <div class="mb-3">
            <label for="edit-username-${story._id}" class="form-label">Your Name</label>
            <input 
              type="text" 
              class="form-control edit-username" 
              id="edit-username-${story._id}" 
              value="${userName}"
              required
            >
          </div>
          <div class="mb-3">
            <label for="edit-title-${story._id}" class="form-label">Story Title</label>
            <input 
              type="text" 
              class="form-control edit-title" 
              id="edit-title-${story._id}" 
              value="${title}"
              required
            >
          </div>
          <div class="mb-3">
            <label for="edit-bunny-${story._id}" class="form-label">Select Bunny</label>
            <select 
              class="form-control edit-bunny" 
              id="edit-bunny-${story._id}"
              required
            >
              <option value="">Choose a bunny...</option>
            </select>
          </div>
          <div class="mb-3">
            <label for="edit-content-${story._id}" class="form-label">Your Story</label>
            <textarea 
              class="form-control edit-content" 
              id="edit-content-${story._id}" 
              rows="4"
              required
            >${content}</textarea>
          </div>
          <div class="d-flex gap-2">
            <button type="button" class="btn btn-success btn-sm save-btn">Save Changes</button>
            <button type="button" class="btn btn-secondary btn-sm cancel-btn">Cancel</button>
          </div>
        </form>
      </div>
    </div>
  `;

  addStoryEventListeners(storyElement, story._id);
  columnWrapper.appendChild(storyElement);
  return columnWrapper;
}

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

    const newStory = await response.json();
    console.log("Server response:", newStory);

    // Refresh the stories list and show the forum section
    await showPage("forum");
    await loadStories();

    // Clear the form
    form.reset();
  } catch (error) {
    console.error("Error creating story:", error);
  }
});

function addStoryEventListeners(storyElement, storyId) {
  const deleteBtn = storyElement.querySelector(".delete-btn");
  const editBtn = storyElement.querySelector(".edit-btn");
  const editForm = storyElement.querySelector(".edit-form");
  const saveBtn = storyElement.querySelector(".save-btn");
  const cancelBtn = storyElement.querySelector(".cancel-btn");

  deleteBtn.addEventListener("click", async () => {
    if (confirm("Delete this story?")) {
      try {
        const response = await fetch(`/api/stories/${storyId}/delete`, {
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
    // Show the edit form
    editForm.style.display = "block";

    // Get current bunny name from the story card
    const currentBunny = storyElement
      .querySelector(".card-subtitle:nth-child(3)")
      .textContent.replace("Bunny: ", "")
      .trim();

    // Load and populate bunny select options
    const bunnySelect = editForm.querySelector(".edit-bunny");
    await loadBunnies(bunnySelect, currentBunny);

    // Show the form and focus on username input
    editForm.classList.add("show");
    editForm.querySelector(".edit-username").focus();
  });

  cancelBtn.addEventListener("click", () => {
    editForm.classList.remove("show");
    editForm.style.display = "none";
  });

  saveBtn.addEventListener("click", async () => {
    const newUserName = editForm.querySelector(".edit-username").value.trim();
    const newTitle = editForm.querySelector(".edit-title").value.trim();
    const newBunny = editForm.querySelector(".edit-bunny").value.trim();
    const newContent = editForm.querySelector(".edit-content").value.trim();

    if (!newUserName || !newTitle || !newBunny || !newContent) {
      alert("All fields are required.");
      return;
    }

    try {
      const response = await fetch(`/api/stories/${storyId}/update`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userName: newUserName,
          title: newTitle,
          bunnyName: newBunny,
          content: newContent,
        }),
      });

      if (response.ok) {
        // Update all fields in the display
        storyElement.querySelector(".card-title").textContent = newTitle;
        storyElement.querySelector(".card-subtitle:nth-child(2)").textContent =
          `By ${newUserName}`;
        storyElement.querySelector(".card-subtitle:nth-child(3)").textContent =
          `Bunny: ${newBunny}`;
        storyElement.querySelector(".card-text").textContent = newContent;

        // Hide the edit form
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
}
// Initialize
document.addEventListener("DOMContentLoaded", async () => {
  // Show gallery by default
  await showPage("gallery");

  // Set gallery link as active
  document.getElementById("galleryLink").classList.add("active");
});
