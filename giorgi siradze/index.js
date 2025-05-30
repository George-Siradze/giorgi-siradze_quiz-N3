
document.addEventListener('DOMContentLoaded', () => {
  
  const userGrid = document.getElementById('grid');
  const loadingSpinner = document.getElementById('loader');
  const errorMessageBox = document.getElementById('error-container');
  const tryAgainButton = document.getElementById('retry-button');
  const searchBox = document.getElementById('search-input');

  
  let allUsers = [];

  
  async function fetchUserData() {
    try {
    
      showLoadingAnimation();
      hideErrorMessage();
      
      
      const serverResponse = await fetch('https://jsonplaceholder.typicode.com/users');
      
      
      if (!serverResponse.ok) {
        throw new Error(`Oops! The server said: ${serverResponse.status}`);
      }
      
      
      allUsers = await serverResponse.json();
      showUsers(allUsers);
      hideLoadingAnimation();
    } catch (error) {
      console.error('Something went wrong:', error);
      showErrorMessage(error.message);
      hideLoadingAnimation();
    }
  }

  
  function showUsers(usersToShow) {
    
    userGrid.innerHTML = '';
    
    
    if (usersToShow.length === 0) {
      userGrid.innerHTML = '<p>Hmm, no users match your search...</p>';
      return;
    }
    
    
    usersToShow.forEach(user => {
      
      const initials = getInitialsFromName(user.name);
      
      const formattedAddress = `${user.address.street}, ${user.address.suite}, ${user.address.city}`;
      
      
      const userCard = document.createElement('div');
      userCard.className = 'card';
      userCard.innerHTML = `
        <div class="card-header">
          <div class="card-avatar">${initials}</div>
        </div>
        <div class="card-body">
          <h3 class="card-title">${user.name}</h3>
          <p class="card-username">@${user.username}</p>

          <div class="card-details">
            <p class="card-details-title">Where to find them</p>
            <p class="card-address">${formattedAddress}</p>
          </div>

          <div class="card-details">
            <p class="card-details-title">Day job</p>
            <p class="card-company">${user.company.name}</p>
          </div>
        </div>
      `;
      
      
      userGrid.appendChild(userCard);
    });
  }

  
  function getInitialsFromName(fullName) {
    return fullName.split(' ')
      .map(namePart => namePart[0]) 
      .join('')
      .toUpperCase(); 
  }

  
  function filterUserList() {
    const searchText = searchBox.value.toLowerCase();
    const matchingUsers = allUsers.filter(user => 
      user.name.toLowerCase().includes(searchText)
    );
    showUsers(matchingUsers);
  }

  
  function showLoadingAnimation() {
    loadingSpinner.style.display = 'flex';
    userGrid.style.display = 'none';
  }

  function hideLoadingAnimation() {
    loadingSpinner.style.display = 'none';
    userGrid.style.display = 'grid';
  }

  function showErrorMessage(message) {
    errorMessageBox.style.display = 'block';
    document.getElementById('error-message').textContent = 
      message || 'Something went wrong getting user data.';
  }

  function hideErrorMessage() {
    errorMessageBox.style.display = 'none';
  }

  
  searchBox.addEventListener('input', filterUserList);
  tryAgainButton.addEventListener('click', fetchUserData);

 
  fetchUserData();
});