document.addEventListener('DOMContentLoaded', () => {
    // Fetch and load JSON data into the catalog page
    let mangaData = [];
    let BookData =   [];

    function fetchData() {
        fetch("./BookManga.json")
            .then(response => response.json())
            .then(data => {
                mangaData = data.mangas;
                loadContent(mangaData);
                
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

        // Apply hover effect after content is loaded
        hoverLoadContent();
    }

    function hoverLoadContent() {
        const imageContainers = document.querySelectorAll('.image-container');

        imageContainers.forEach(container => {
            const popup = container.querySelector('.popup');
            popup.style.visibility = 'hidden';

            container.addEventListener('mouseenter', function () {
                popup.style.visibility = 'visible';
                popup.style.opacity = '1';
            });

            container.addEventListener('mouseleave', function () {
                
                popup.style.visibility = 'hidden';
                popup.style.opacity = '0';
            });

            popup.addEventListener('click', function () {
                popup.style.visibility = 'hidden';
                popup.style.opacity = '0';
            });
        });
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
    // Handle theme toggle
    function handleThemeChange(theme) {
        document.documentElement.setAttribute('data-bs-theme', theme);
        localStorage.setItem('theme', theme);
    }

    // Apply saved theme on page load
    function applySavedTheme() {
        const savedTheme = localStorage.getItem('theme') || 'auto';
        handleThemeChange(savedTheme);
    }

    // Theme toggle event listeners
    document.querySelectorAll('[data-bs-theme-value]').forEach(button => {
        button.addEventListener('click', () => {
            const theme = button.getAttribute('data-bs-theme-value');
            handleThemeChange(theme);
        });
    });

    // Apply saved theme on load
    applySavedTheme();

    document.getElementById('descriptionInput').addEventListener('input', searchAndFilter);
    document.getElementById('genreSelect').addEventListener('change', searchAndFilter);

    fetchData();
});

