document.addEventListener('DOMContentLoaded', () => {
    // Fetch and load JSON data into the catalog page
    createThemeToggle();
    let mangaData = [];
    let BookData = [];

    function fetchDataManga() {
        fetch("./BookManga.json")
            .then(response => response.json())
            .then(data => {
                mangaData = data.mangas;
                loadContent(mangaData);

            })
            .catch(error => console.error('Error fetching JSON:', error));
    }

    function fetchDataBook() {
        fetch("./BookManga.json")
            .then(response => response.json())
            .then(data => {
                BookData = data.books;
                loadContent(BookData);

            })
            .catch(error => console.error('Error fetching JSON:', error));
    }

    // Load content from JSON and add to the catalog display
    function loadContent(data) {
        const container = document.querySelector(".row.row-cols-1.row-cols-sm-2.row-cols-md-3.g-3");
        container.innerHTML = "";
        data.forEach(item => {
            const card = `
                <div class="col">
                    <div class="card shadow-sm image-container position-relative">
                        <img src="${item.cover}" alt="${item.title}" class="pictureOfBook"/>
                        <div class="card-body">
                            <h1 class="card-text">
                                <strong>${item.title}</strong></h1>
                            <h2>${item.author}</h2><br>
                            <div class="d-flex justify-content-between align-items-center">
                                <small class="text-body-secondary">${item["#chapters"] ? item["#chapters"] + ' chapters' : ''}</small>
                            </div>
                        </div>
                        <div class="popup position-absolute">
                            <div class="popup-info bg-secondary-transparent">
                                <p>${item.description}</p>
                            </div>
                        </div>
                    </div>
                </div>`;
            container.innerHTML += card;
        });

        const cols = document.querySelectorAll('.col');
        cols.forEach((col, index) => {
            col.addEventListener('click', () => {
                // When a column is clicked, populate the modal with the corresponding item data
                const item = data[index];
                populateModal(item.cover, item.title, item.author, item.rating, item.release_date, item.status, item["#chapters"], item.description, item.genre.join(', '));
            });
        });

        if (!document.getElementById('mangaModal')) {
            const modalHTML = `
            <div class="modal fade" id="mangaModal" tabindex="-1" aria-labelledby="mangaModalLabel" aria-hidden="true">
              <div class="modal-dialog modal-lg">
                <div class="modal-content">
                  <div class="modal-header">
                    <h5 class="modal-title" id="mangaModalLabel"></h5>
                    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                  </div>
                  <div class="modal-body">
                    <img id="modal-cover" src="" alt="Manga Cover" class="img-fluid mx-auto d-block mb-3" style="max-height: 80vh; object-fit: contain; padding: 20px;">
                    <div class="text-on-gray" style="background-color: #f8f9fa; padding: 15px;">
                      <h5>Author: <span id="modal-author"></span></h5>
                      <h6>Rating: <span id="modal-rating"></span></h6>
                      <h6>Release Date: <span id="modal-release-date"></span></h6>
                      <h6>Status: <span id="modal-status"></span></h6>
                      <h6>Chapters: <span id="modal-chapters"></span></h6>
                      <h6>Genres: <span id="modal-genre"></span></h6>
                      <p id="modal-description"></p>
                    </div>
                  </div>
                </div>
              </div>
            </div>`;
            document.body.insertAdjacentHTML('beforeend', modalHTML);
        }

        // Apply hover effect after content is loaded
        hoverLoadContent();
    }

    function hoverLoadContent() {
        const imageContainers = document.querySelectorAll('.image-container');

        imageContainers.forEach(container => {
            const popup = container.querySelector('.popup');
            popup.style.visibility = 'hidden';

            container.addEventListener('mouseenter', function() {
                popup.style.visibility = 'visible';
                popup.style.opacity = '1';
            });

            container.addEventListener('mouseleave', function() {

                popup.style.visibility = 'hidden';
                popup.style.opacity = '0';
            });

            popup.addEventListener('click', function() {
                popup.style.visibility = 'hidden';
                popup.style.opacity = '0';
            });
        });
    }

    function populateModal(cover, title, author, rating, release_date, status, chapters, description, genre) {
        const modalElement = new bootstrap.Modal(document.getElementById('mangaModal'), {
            keyboard: true,
            backdrop: true
        });
        // Populate the modal content
        document.getElementById('modal-cover').src = cover;
        document.getElementById('mangaModalLabel').innerText = title;
        document.getElementById('modal-author').innerText = author;
        document.getElementById('modal-rating').innerText = rating;
        document.getElementById('modal-release-date').innerText = release_date;
        document.getElementById('modal-status').innerText = status;
        document.getElementById('modal-chapters').innerText = chapters ? chapters + ' chapters' : 'N/A';
        document.getElementById('modal-genre').innerText = genre;
        document.getElementById('modal-description').innerText = description;

        // Show the modal
        modalElement.show();
    }
    // Search and filter items by title and genre
    function searchAndFilter() {
        const searchText = document.getElementById('descriptionInput').value.toLowerCase();
        const selectedGenre = document.getElementById('genreSelect').value;

        const filteredData = mangaData.filter(item => {
            const matchesTitle = item.title.toLowerCase().includes(searchText);
            const matchesGenre = selectedGenre === "All" || item.genre.some(genre => genre.toLowerCase() === selectedGenre.toLowerCase());
            return matchesTitle && matchesGenre;
        });

        loadContent(filteredData);
    }
    document.getElementById('filterGenreButton').addEventListener('click', searchAndFilter);
    document.getElementById('sortOptionButton').addEventListener('click', () => sortBy(document.getElementById('sortSelect').value));

    // Sort catalog items by selected option (title or chapter count)
    function sortBy(option) {
        const container = document.querySelector(".row.row-cols-1.row-cols-sm-2.row-cols-md-3.g-3");
        const itemsArray = Array.from(container.children);

        itemsArray.sort((a, b) => {
            if (option === 'title') {
                return a.querySelector('.card-text strong').textContent.localeCompare(b.querySelector('.card-text strong').textContent);
            } else if (option === 'chapters') {
                const aChapters = parseInt(a.querySelector('.text-body-secondary').textContent);
                const bChapters = parseInt(b.querySelector('.text-body-secondary').textContent);
                return aChapters - bChapters;
            }
        });

        itemsArray.forEach(item => {
            container.appendChild(item);
        });
    }
    // // Handle theme toggle
    // function handleThemeChange(theme) {
    //     document.documentElement.setAttribute('data-bs-theme', theme);
    //     localStorage.setItem('theme', theme);
    // }

    // // Apply saved theme on page load
    // function applySavedTheme() {
    //     const savedTheme = localStorage.getItem('theme') || 'auto';
    //     handleThemeChange(savedTheme);
    // }

    // // Theme toggle event listeners
    // document.querySelectorAll('[data-bs-theme-value]').forEach(button => {
    //     button.addEventListener('click', () => {
    //         const theme = button.getAttribute('data-bs-theme-value');
    //         handleThemeChange(theme);
    //     });
    // });

    // // Apply saved theme on loadz
    // applySavedTheme();

    function createThemeToggle() {
        const themeToggleHTML = `
        <div class="dropdown position-fixed bottom-0 end-0 mb-3 me-3 bd-mode-toggle">
            <button class="btn btn-bd-primary py-2 dropdown-toggle d-flex align-items-center" id="bd-theme" type="button" aria-expanded="false" data-bs-toggle="dropdown" aria-label="Toggle theme (auto)">
                <svg class="bi my-1 theme-icon-active" width="1em" height="1em">
                    <use href="#circle-half"></use>
                </svg>
                <span class="visually-hidden" id="bd-theme-text">Toggle theme</span>
            </button>
            <ul class="dropdown-menu dropdown-menu-end shadow" aria-labelledby="bd-theme-text">
                <li>
                    <button type="button" class="dropdown-item d-flex align-items-center" data-bs-theme-value="light" aria-pressed="false">
                        <svg class="bi me-2 opacity-50" width="1em" height="1em">
                            <use href="#sun-fill"></use>
                        </svg>
                        Light
                        <svg class="bi ms-auto d-none" width="1em" height="1em">
                            <use href="#check2"></use>
                        </svg>
                    </button>
                </li>
                <li>
                    <button type="button" class="dropdown-item d-flex align-items-center" data-bs-theme-value="dark" aria-pressed="false">
                        <svg class="bi me-2 opacity-50" width="1em" height="1em">
                            <use href="#moon-stars-fill"></use>
                        </svg>
                        Dark
                        <svg class="bi ms-auto d-none" width="1em" height="1em">
                            <use href="#check2"></use>
                        </svg>
                    </button>
                </li>
                <li>
                    <button type="button" class="dropdown-item d-flex align-items-center active" data-bs-theme-value="auto" aria-pressed="true">
                        <svg class="bi me-2 opacity-50" width="1em" height="1em">
                            <use href="#circle-half"></use>
                        </svg>
                        Auto
                        <svg class="bi ms-auto d-none" width="1em" height="1em">
                            <use href="#check2"></use>
                        </svg>
                    </button>
                </li>
            </ul>
        </div>
    `;

        // Append the theme toggle dropdown to the body
        document.body.insertAdjacentHTML('beforeend', themeToggleHTML);
        setupThemeToggle(); // Initialize event listeners
    }

    // Function to set up theme toggle functionality
    function setupThemeToggle() {
        const themeToggleButtons = document.querySelectorAll('[data-bs-theme-value]');
        const currentTheme = localStorage.getItem('theme') || 'auto';
        document.body.setAttribute('data-bs-theme', currentTheme);

        // Set the active theme button based on current theme
        themeToggleButtons.forEach(button => {
            if (button.getAttribute('data-bs-theme-value') === currentTheme) {
                button.setAttribute('aria-pressed', 'true');
                button.classList.add('active');
            }
            button.addEventListener('click', (event) => {
                const selectedTheme = event.currentTarget.getAttribute('data-bs-theme-value');
                document.body.setAttribute('data-bs-theme', selectedTheme);
                localStorage.setItem('theme', selectedTheme); // Save to localStorage

                // Update the pressed state of buttons
                themeToggleButtons.forEach(btn => {
                    btn.classList.remove('active');
                    btn.setAttribute('aria-pressed', 'false');
                });
                event.currentTarget.classList.add('active');
                event.currentTarget.setAttribute('aria-pressed', 'true');
            });
        });
    }

    document.getElementById('descriptionInput').addEventListener('input', searchAndFilter);
    document.getElementById('genreSelect').addEventListener('change', searchAndFilter);

    const pageDataFetchers = {
        "Library Catalog Manga": fetchDataManga,
        "Library Catalog Books": fetchDataBook,
        // Add more mappings as needed
    };

    // Call the appropriate function based on the current title
    const fetchFunction = pageDataFetchers[document.title];
    if (fetchFunction) {
        fetchFunction();
    }
});