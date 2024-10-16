document.addEventListener('DOMContentLoaded', () => {
    // Fetch and load JSON data into the catalog page
    let mangaData = [];

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
                    <div class="card shadow-sm">
                        <img src="${item.cover}" alt="${item.title}"/>
                        <div class="card-body">
                            <p class="card-text">
                                <strong>${item.title}</strong> by ${item.author} <br>
                                ${item.description}
                            </p>
                            <div class="d-flex justify-content-between align-items-center">
                                <small class="text-body-secondary">${item["#chapters"] ? item["#chapters"] + ' chapters' : ''}</small>
                            </div>
                        </div>
                    </div>
                </div>`;
            container.innerHTML += card;
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

    document.getElementById('descriptionInput').addEventListener('input', searchAndFilter);
    document.getElementById('genreSelect').addEventListener('change', searchAndFilter);

    fetchData();
});

