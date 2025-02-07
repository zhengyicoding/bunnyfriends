// Navigation handling
document.querySelectorAll(".nav-link").forEach((link) => {
  link.addEventListener("click", (e) => {
    e.preventDefault();
    const page = e.target.getAttribute("data-page");
    showPage(page);

    // Update active state
    document
      .querySelectorAll(".nav-link")
      .forEach((l) => l.classList.remove("active"));
    e.target.classList.add("active");
  });
});

function showPage(page) {
  const gallerySection = document.getElementById("gallerySection");
  const forumSection = document.getElementById("forumSection");

  if (page === "gallery") {
    gallerySection.style.display = "flex";
    forumSection.style.display = "none";
  } else {
    gallerySection.style.display = "none";
    forumSection.style.display = "block";
  }
}

async function getBunnies() {
  const res = await fetch("/api/bunnies");
  const data = await res.json();
  console.log("Got bunnies", data);
  bunnies = data.bunnies;
}

// Create bunny cards
// Fetch and create bunny cards
async function fetchBunnies() {
  try {
    const response = await fetch("/api/bunnies");
    const bunnies = await response.json();
    return bunnies;
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
    const card = document.createElement("div");
    card.className = "col-md-4 mb-4";
    card.innerHTML = `
        <div class="card bunny-card h-100">
          <div class="card-img-container">
            <img src="${bunny.image}" class="card-img-top" alt="${bunny.name}">
          </div>
          <div class="card-body">
            <h5 class="card-title">${bunny.name}</h5>
            <p class="card-text">$${bunny.price.toFixed(2)}</p>
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

// Handle forum post submission
document.getElementById("postForm").addEventListener("submit", (e) => {
  e.preventDefault();
  const title = document.getElementById("postTitle").value;
  const content = document.getElementById("postContent").value;

  addForumPost(title, content);

  // Clear form
  e.target.reset();
});

function addForumPost(title, content) {
  const postsContainer = document.getElementById("postsContainer");
  const postElement = document.createElement("div");
  postElement.className = "card mb-3";

  // Add unique ID to each post
  const postId = Date.now();
  postElement.setAttribute("data-post-id", postId);

  postElement.innerHTML = `
      <div class="card-body">
        <h5 class="card-title">${title}</h5>
        <p class="card-text">${content}</p>
        <small class="text-muted">Posted ${new Date().toLocaleDateString()}</small>
        <div class="mt-3">
          <button class="btn btn-warning btn-sm edit-btn">Edit</button>
          <button class="btn btn-danger btn-sm delete-btn">Delete</button>
        </div>
        <div class="edit-form" style="display:none">
          <input type="text" class="form-control mb-2" value="${title}">
          <textarea class="form-control mb-2">${content}</textarea>
          <button class="btn btn-success btn-sm save-btn">Save</button>
          <button class="btn btn-secondary btn-sm cancel-btn">Cancel</button>
        </div>
      </div>
    `;

  // Add event listeners
  const deleteBtn = postElement.querySelector(".delete-btn");
  deleteBtn.addEventListener("click", () => {
    if (confirm("Delete this post?")) {
      postElement.remove();
    }
  });

  const editBtn = postElement.querySelector(".edit-btn");
  const editForm = postElement.querySelector(".edit-form");
  const saveBtn = postElement.querySelector(".save-btn");
  const cancelBtn = postElement.querySelector(".cancel-btn");

  editBtn.addEventListener("click", () => {
    editForm.style.display = "block";
  });

  cancelBtn.addEventListener("click", () => {
    editForm.style.display = "none";
  });

  saveBtn.addEventListener("click", () => {
    const newTitle = editForm.querySelector("input").value;
    const newContent = editForm.querySelector("textarea").value;

    postElement.querySelector(".card-title").textContent = newTitle;
    postElement.querySelector(".card-text").textContent = newContent;

    editForm.style.display = "none";
  });

  postsContainer.prepend(postElement);
}

// Initialize the page
createBunnyCards();
