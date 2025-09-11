document.addEventListener('DOMContentLoaded', function() {
    // --- Elements ---
    const tableBody = document.getElementById('tableBody');
    const loadingMessage = document.getElementById('loadingMessage');
    const searchInput = document.getElementById('searchInput');
    const searchButton = document.getElementById('searchButton');
    const fetchAllButton = document.getElementById('fetchAllButton');

    // --- API Configuration ---
    // This is the public IP address of your server
    const API_BASE_URL = 'http://138.124.52.21:5000/api';

    // --- Functions ---

    /**
     * Renders customer data into the HTML table.
     * @param {Array} customers - An array of customer objects.
     */
    function displayData(customers) {
        tableBody.innerHTML = ''; // Clear previous results
        if (!customers || customers.length === 0) {
            loadingMessage.innerText = 'داده‌ای برای نمایش یافت نشد.';
            loadingMessage.style.display = 'block';
            return;
        }
        
        customers.forEach(customer => {
            const row = document.createElement('tr');
            // Use 'N/A' or a placeholder for null/undefined values
            row.innerHTML = `
                <td>${customer.id || '---'}</td>
                <td>${customer.phone || '---'}</td>
                <td>${customer.panels || 0}</td>
                <td>${customer.traffic_gb || 0}</td>
                <td>${customer.reg_date || '---'}</td>
                <td>${customer.first_seen || '---'}</td>
            `;
            tableBody.appendChild(row);
        });
        loadingMessage.style.display = 'none';
    }

    /**
     * Fetches all customers from the API.
     */
    async function fetchAllCustomers() {
        loadingMessage.innerText = 'در حال بارگذاری تمام مشتریان...';
        loadingMessage.style.display = 'block';
        tableBody.innerHTML = '';

        try {
            const response = await fetch(`${API_BASE_URL}/customers`);
            if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
            const data = await response.json();
            displayData(data);
        } catch (error) {
            console.error('Fetch error:', error);
            loadingMessage.innerText = 'خطا در بارگذاری اطلاعات. آیا سرور فعال و قابل دسترس است؟';
        }
    }

    /**
     * Searches for a single customer by their ID.
     */
    async function searchCustomer() {
        const customerId = searchInput.value.trim();
        if (!customerId || !/^\d+$/.test(customerId)) {
            alert('لطفاً یک ID عددی معتبر وارد کنید.');
            return;
        }

        loadingMessage.innerText = `در حال جستجو برای ID ${customerId}...`;
        loadingMessage.style.display = 'block';
        tableBody.innerHTML = '';
            
        try {
            const response = await fetch(`${API_BASE_URL}/customer/${customerId}`);
            if (response.status === 404) {
                loadingMessage.innerText = `مشتری با ID ${customerId} یافت نشد.`;
                return;
            }
            if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
            const data = await response.json();
            displayData([data]); // Display the single result in the table
        } catch (error) {
            console.error('Search error:', error);
            loadingMessage.innerText = 'خطا در انجام جستجو.';
        }
    }

    // --- Event Listeners ---
    fetchAllButton.addEventListener('click', fetchAllCustomers);
    searchButton.addEventListener('click', searchCustomer);
    searchInput.addEventListener('keyup', event => {
        if (event.key === 'Enter') {
            searchCustomer();
        }
    });

    // --- Initial Load ---
    // Load all customer data when the page first opens.
    fetchAllCustomers();
});

