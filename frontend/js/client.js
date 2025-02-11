// Navigation handling
document.querySelectorAll(".nav-link").forEach((link) => {
  link.addEventListener("click", async (e) => {
    e.preventDefault();
    const page = e.target.getAttribute("data-page");
    await showPage(page);

    // Update active state
    document
      .querySelectorAll(".nav-link")
      .forEach((l) => l.classList.remove("active"));
    e.target.classList.add("active");
  });
});

async function showPage(page) {
  const gallerySection = document.getElementById("gallerySection");
  const forumSection = document.getElementById("forumSection");

  if (page === "gallery") {
    gallerySection.style.display = "flex";
    forumSection.style.display = "none";
    await createBunnyCards(); // Reload gallery content
  } else if (page === "forum") {
    gallerySection.style.display = "none";
    forumSection.style.display = "block";
    await loadBunnies(); // Reload bunnies for select
    await loadStories(); // Reload stories
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
async function loadBunnies() {
  try {
    const response = await fetch("/api/bunnies/");
    const data = await response.json();

    const select = document.getElementById("bunnySelect");

    if (!select) {
      console.error("Could not find bunnySelect element");
      return;
    }

    select.innerHTML = '<option value="">Choose a bunny...</option>';

    data.bunnies.forEach((bunny) => {
      const option = document.createElement("option");
      option.value = bunny.name;
      option.textContent = bunny.name;
      select.appendChild(option);
    });
  } catch (error) {
    console.error("Error loading bunnies:", error);
  }
}
// load and render stories in the database on the forum page
async function loadStories() {
  console.log("Loading stories..."); // Debug log
  try {
    const response = await fetch("/api/stories");
    const stories = await response.json();
    console.log("Stories fetched:", stories); // Debug log

    const storiesContainer = document.getElementById("postsContainer");
    storiesContainer.innerHTML = "";

    stories.forEach((story) => {
      const storyElement = createStoryElement(story);
      storiesContainer.appendChild(storyElement);
    });
  } catch (error) {
    console.error("Error loading stories:", error);
  }
}
function createStoryElement(story) {
  if (!story) {
    console.error("No story data provided to createStoryElement");
    return null;
  }

  const storyElement = document.createElement("div");
  storyElement.className = "card mb-3";
  storyElement.setAttribute("data-story-id", story._id || "");

  const title = story?.title ?? "Untitled";
  const userName = story?.userName ?? "Anonymous";
  const bunnyName = story?.bunnyName ?? "Not specified";
  const content = story?.content ?? "";
  const createdAt = story?.createdAt
    ? new Date(story.createdAt).toLocaleDateString()
    : "Just now";

  storyElement.innerHTML = `
    <div class="card-body">
      <h5 class="card-title">${title}</h5>
      <h6 class="card-subtitle mb-2 text-muted">By ${userName}</h6>
      <h6 class="card-subtitle mb-2 text-muted">Bunny: ${bunnyName}</h6>
      <p class="card-text">${content}</p>
      <small class="text-muted">Posted ${createdAt}</small>
      <div class="mt-3">
        <button class="btn btn-warning btn-sm edit-btn">Edit</button>
        <button class="btn btn-danger btn-sm delete-btn">Delete</button>
      </div>
      <div class="edit-form mt-3" style="display:none">
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
  return storyElement;
}

document.getElementById("postForm").addEventListener("submit", async (e) => {
  e.preventDefault();

  // Get form elements with validation
  const userNameInput = document.getElementById("userName");
  const titleInput = document.getElementById("postTitle");
  const bunnyInput = document.getElementById("bunnySelect");
  const contentInput = document.getElementById("postContent");

  const storyData = {
    userName: userNameInput.value,
    title: titleInput.value,
    bunnyName: bunnyInput.value,
    content: contentInput.value,
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
    e.target.reset();
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
          storyElement.remove();
        }
      } catch (error) {
        console.error("Error deleting story:", error);
      }
    }
  });

  editBtn.addEventListener("click", async () => {
    editForm.style.display = "block";

    // Populate bunny select dropdown
    try {
      const response = await fetch("/api/bunnies/");
      const data = await response.json();
      const bunnySelect = editForm.querySelector(".edit-bunny");
      bunnySelect.innerHTML = '<option value="">Choose a bunny...</option>';

      const currentBunny = storyElement
        .querySelector(".card-subtitle:nth-child(3)")
        .textContent.replace("Bunny: ", "");

      data.bunnies.forEach((bunny) => {
        const option = document.createElement("option");
        option.value = bunny.name;
        option.textContent = bunny.name;
        if (bunny.name === currentBunny) {
          option.selected = true;
        }
        bunnySelect.appendChild(option);
      });
    } catch (error) {
      console.error("Error loading bunnies:", error);
    }

    // Focus on the username input
    editForm.querySelector(".edit-username").focus();
  });

  cancelBtn.addEventListener("click", () => {
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
