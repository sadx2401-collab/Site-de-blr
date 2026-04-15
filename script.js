// Dados do usuário logado
let currentUser = null;

// Carregar usuários do localStorage
let users = JSON.parse(localStorage.getItem('bluelock_users')) || [];

// Carregar jogadores disponíveis
let availablePlayers = JSON.parse(localStorage.getItem('bluelock_players')) || [];

// Inicializar alguns jogadores de exemplo se estiver vazio
if (availablePlayers.length === 0) {
    availablePlayers = [
        {
            id: 1,
            discord: "@RonaldoNazario",
            position: "CF",
            link: "https://youtube.com/clip/ronaldo",
            description: "Artilheiro nato, 50 gols na temporada! 🎯"
        },
        {
            id: 2,
            discord: "@MessiFan",
            position: "Winger",
            link: "https://youtube.com/clip/messi",
            description: "Velocidade e drible, 30 assistências! ⚡"
        }
    ];
    localStorage.setItem('bluelock_players', JSON.stringify(availablePlayers));
}

// Funções de autenticação
function showRegister() {
    document.getElementById('loginScreen').style.display = 'none';
    document.getElementById('registerScreen').style.display = 'flex';
}

function showLogin() {
    document.getElementById('registerScreen').style.display = 'none';
    document.getElementById('loginScreen').style.display = 'flex';
}

function register() {
    const username = document.getElementById('regUsername').value;
    const password = document.getElementById('regPassword').value;
    const position = document.getElementById('regPosition').value;

    if (!username || !password || !position) {
        alert('Preencha todos os campos!');
        return;
    }

    // Verificar se usuário já existe
    if (users.find(u => u.username === username)) {
        alert('Usuário já existe!');
        return;
    }

    // Criar novo usuário
    const newUser = {
        username: username,
        password: password,
        position: position,
        stats: {
            white: { goals: 0, assists: 0 },
            black: { goals: 0, assists: 0 },
            red: { goals: 0, assists: 0 }
        }
    };

    users.push(newUser);
    localStorage.setItem('bluelock_users', JSON.stringify(users));
    alert('Conta criada com sucesso! Faça login.');
    showLogin();
}

function login() {
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    const user = users.find(u => u.username === username && u.password === password);

    if (user) {
        currentUser = user;
        localStorage.setItem('bluelock_current', JSON.stringify(currentUser));
        showDashboard();
    } else {
        alert('Usuário ou senha incorretos!');
    }
}

function logout() {
    currentUser = null;
    localStorage.removeItem('bluelock_current');
    document.getElementById('dashboardScreen').style.display = 'none';
    document.getElementById('loginScreen').style.display = 'flex';
    document.getElementById('username').value = '';
    document.getElementById('password').value = '';
}

function showDashboard() {
    document.getElementById('loginScreen').style.display = 'none';
    document.getElementById('registerScreen').style.display = 'none';
    document.getElementById('dashboardScreen').style.display = 'block';
    
    // Carregar dados do usuário
    document.getElementById('playerName').textContent = currentUser.username;
    const positionNames = { CF: 'Centroavante', Winger: 'Ponta', CM: 'Meio-campo', GK: 'Goleiro' };
    document.getElementById('playerPosition').textContent = positionNames[currentUser.position] || currentUser.position;
    
    // Carregar estatísticas
    document.getElementById('whiteGoals').value = currentUser.stats.white.goals;
    document.getElementById('whiteAssists').value = currentUser.stats.white.assists;
    document.getElementById('blackGoals').value = currentUser.stats.black.goals;
    document.getElementById('blackAssists').value = currentUser.stats.black.assists;
    document.getElementById('redGoals').value = currentUser.stats.red.goals;
    document.getElementById('redAssists').value = currentUser.stats.red.assists;
    
    updateTotalStats();
    loadPlayers();
}

function updateStats() {
    // Atualizar estatísticas do usuário
    currentUser.stats.white.goals = parseInt(document.getElementById('whiteGoals').value) || 0;
    currentUser.stats.white.assists = parseInt(document.getElementById('whiteAssists').value) || 0;
    currentUser.stats.black.goals = parseInt(document.getElementById('blackGoals').value) || 0;
    currentUser.stats.black.assists = parseInt(document.getElementById('blackAssists').value) || 0;
    currentUser.stats.red.goals = parseInt(document.getElementById('redGoals').value) || 0;
    currentUser.stats.red.assists = parseInt(document.getElementById('redAssists').value) || 0;
    
    // Salvar no localStorage
    const userIndex = users.findIndex(u => u.username === currentUser.username);
    if (userIndex !== -1) {
        users[userIndex] = currentUser;
        localStorage.setItem('bluelock_users', JSON.stringify(users));
        localStorage.setItem('bluelock_current', JSON.stringify(currentUser));
    }
    
    updateTotalStats();
}

function updateTotalStats() {
    const totalGoals = currentUser.stats.white.goals + currentUser.stats.black.goals + currentUser.stats.red.goals;
    const totalAssists = currentUser.stats.white.assists + currentUser.stats.black.assists + currentUser.stats.red.assists;
    
    document.getElementById('totalGoals').textContent = totalGoals;
    document.getElementById('totalAssists').textContent = totalAssists;
    document.getElementById('totalGCA').textContent = totalGoals + totalAssists;
}

// Navegação entre abas
function showStats() {
    document.getElementById('statsPanel').style.display = 'block';
    document.getElementById('hirePanel').style.display = 'none';
    document.getElementById('statsBtn').classList.add('active');
    document.getElementById('hireBtn').classList.remove('active');
}

function showHire() {
    document.getElementById('statsPanel').style.display = 'none';
    document.getElementById('hirePanel').style.display = 'block';
    document.getElementById('hireBtn').classList.add('active');
    document.getElementById('statsBtn').classList.remove('active');
    loadPlayers();
}

// Funções de contratação
function showAddPlayerForm() {
    document.getElementById('addPlayerForm').style.display = 'block';
}

function hideAddPlayerForm() {
    document.getElementById('addPlayerForm').style.display = 'none';
    document.getElementById('playerDiscord').value = '';
    document.getElementById('playerPositionHire').value = '';
    document.getElementById('playerLink').value = '';
    document.getElementById('playerDescription').value = '';
}

function addPlayer() {
    const discord = document.getElementById('playerDiscord').value;
    const position = document.getElementById('playerPositionHire').value;
    const link = document.getElementById('playerLink').value;
    const description = document.getElementById('playerDescription').value;
    
    if (!discord || !position) {
        alert('Preencha o Discord/Nome e a posição do jogador!');
        return;
    }
    
    const newPlayer = {
        id: Date.now(),
        discord: discord,
        position: position,
        link: link || '',
        description: description || 'Jogador disponível para contratação!'
    };
    
    availablePlayers.push(newPlayer);
    localStorage.setItem('bluelock_players', JSON.stringify(availablePlayers));
    loadPlayers();
    hideAddPlayerForm();
    alert('Jogador anunciado com sucesso!');
}

function deletePlayer(playerId) {
    if (confirm('Tem certeza que deseja remover este jogador?')) {
        availablePlayers = availablePlayers.filter(p => p.id !== playerId);
        localStorage.setItem('bluelock_players', JSON.stringify(availablePlayers));
        loadPlayers();
    }
}

function loadPlayers() {
    const playersList = document.getElementById('playersList');
    const positionNames = { CF: '⚽ Centroavante', Winger: '🏃 Ponta', CM: '🎯 Meio-campo', GK: '🧤 Goleiro' };
    
    if (availablePlayers.length === 0) {
        playersList.innerHTML = '<p style="text-align: center;">Nenhum jogador disponível no momento. Seja o primeiro a anunciar!</p>';
        return;
    }
    
    playersList.innerHTML = availablePlayers.map(player => `
        <div class="player-card">
            <h4>${player.discord}</h4>
            <div class="position-badge">${positionNames[player.position] || player.position}</div>
            ${player.link ? `<a href="${player.link}" target="_blank" class="clip-link">🎥 Assistir Clip</a>` : ''}
            <div class="description">📝 ${player.description}</div>
            <button onclick="deletePlayer(${player.id})" class="delete-btn">🗑️ Remover Anúncio</button>
        </div>
    `).join('');
}

// Verificar se já tem usuário logado ao carregar a página
window.onload = function() {
    const savedUser = localStorage.getItem('bluelock_current');
    if (savedUser) {
        currentUser = JSON.parse(savedUser);
        // Sincronizar com a lista de usuários (caso tenha mudado)
        const updatedUser = users.find(u => u.username === currentUser.username);
        if (updatedUser) {
            currentUser = updatedUser;
            showDashboard();
        } else {
            logout();
        }
    }
};