// Data Sistem
let currentUser = null;
let selectedCandidateId = null;
let votingActive = true;

// Data Users (Peserta dan Admin)
const users = [
    { username: 'peserta1', password: 'pass123', nis: 'P001', nama_peserta: 'Ahmad Rizki', sudah_memilih: false, role: 'peserta' },
    { username: 'peserta2', password: 'pass123', nis: 'P002', nama_peserta: 'Siti Nurhaliza', sudah_memilih: false, role: 'peserta' },
    { username: 'peserta3', password: 'pass123', nis: 'P003', nama_peserta: 'Budi Santoso', sudah_memilih: false, role: 'peserta' },
    { username: 'peserta4', password: 'pass123', nis: 'P004', nama_peserta: 'Dewi Lestari', sudah_memilih: false, role: 'peserta' },
    { username: 'admin', password: 'admin123', id_admin: 'A001', nama_admin: 'Admin OSIS', role: 'admin' }
];

// Data Kandidat
const candidates = [
    { 
        id_kandidat: 1, 
        nama_kandidat: 'Budi Santoso', 
        visi_misi: 'Mewujudkan OSIS yang kreatif, inovatif, dan berprestasi untuk kemajuan sekolah',
        jumlah_suara: 0,
        foto: '👨‍🎓'
    },
    { 
        id_kandidat: 2, 
        nama_kandidat: 'Dewi Lestari', 
        visi_misi: 'Membangun OSIS yang peduli, solid, dan harmonis untuk kebaikan bersama',
        jumlah_suara: 0,
        foto: '👩‍🎓'
    },
    { 
        id_kandidat: 3, 
        nama_kandidat: 'Eko Prasetyo', 
        visi_misi: 'OSIS yang transparan, bertanggung jawab, dan dekat dengan siswa',
        jumlah_suara: 0,
        foto: '👨‍💼'
    }
];

// Fungsi untuk menampilkan halaman
function showPage(pageId) {
    const pages = document.querySelectorAll('.page');
    pages.forEach(page => page.classList.remove('active'));
    document.getElementById(pageId).classList.add('active');
}

// Login Handler
document.getElementById('loginForm').addEventListener('submit', function(e) {
    e.preventDefault();
    
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    
    // Validasi data login
    const user = users.find(u => u.username === username && u.password === password);
    
    if (!user) {
        alert('Username atau password salah!');
        return;
    }
    
    // Cek role user
    if (user.role === 'admin') {
        currentUser = user;
        document.getElementById('adminNameDisplay').textContent = user.nama_admin;
        showPage('adminPage');
        loadAdminData();
    } else {
        // Cek apakah peserta sudah memilih
        if (user.sudah_memilih) {
            alert('Anda sudah memilih! Terima kasih atas partisipasi Anda.');
            document.getElementById('username').value = '';
            document.getElementById('password').value = '';
            return;
        }
        
        // Cek status voting
        if (!votingActive) {
            alert('Maaf, voting sedang tidak aktif!');
            return;
        }
        
        currentUser = user;
        document.getElementById('userNameDisplay').textContent = user.nama_peserta;
        showPage('votingPage');
        loadCandidates();
    }
    
    // Reset form
    document.getElementById('username').value = '';
    document.getElementById('password').value = '';
});

// Load Kandidat untuk Halaman Voting
function loadCandidates() {
    const candidatesList = document.getElementById('candidatesList');
    candidatesList.innerHTML = '';
    
    candidates.forEach(candidate => {
        const card = document.createElement('div');
        card.className = 'candidate-card';
        card.innerHTML = `
            <div class="candidate-photo">${candidate.foto}</div>
            <h3>${candidate.nama_kandidat}</h3>
            <p>${candidate.visi_misi}</p>
            <button class="btn-vote" onclick="selectCandidate(${candidate.id_kandidat})">
                Pilih Kandidat
            </button>
        `;
        candidatesList.appendChild(card);
    });
}

// Pilih Kandidat
function selectCandidate(candidateId) {
    if (!votingActive) {
        alert('Voting sedang tidak aktif!');
        return;
    }
    
    const candidate = candidates.find(c => c.id_kandidat === candidateId);
    selectedCandidateId = candidateId;
    
    document.getElementById('selectedCandidateName').textContent = candidate.nama_kandidat;
    document.getElementById('voteModal').classList.add('active');
}

// Konfirmasi Vote
function confirmVote() {
    if (!selectedCandidateId) return;
    
    const candidate = candidates.find(c => c.id_kandidat === selectedCandidateId);
    
    // Tambah suara
    candidate.jumlah_suara++;
    
    // Update status peserta
    currentUser.sudah_memilih = true;
    
    // Simpan suara ke server (simulasi)
    alert(`Terima kasih! Anda telah memilih ${candidate.nama_kandidat}\n\nAnda akan logout otomatis.`);
    
    closeModal();
    
    // Auto logout setelah 2 detik
    setTimeout(() => {
        logout();
    }, 2000);
}

// Tutup Modal
function closeModal() {
    document.getElementById('voteModal').classList.remove('active');
    selectedCandidateId = null;
}

// Logout
function logout() {
    currentUser = null;
    selectedCandidateId = null;
    showPage('loginPage');
}

// Load Data Admin
function loadAdminData() {
    updateVotingStatus();
    loadResults();
    loadPesertaTable();
    loadCandidateManagement();
}

// Update Status Voting
function updateVotingStatus() {
    const statusElement = document.getElementById('votingStatus');
    const toggleBtn = document.getElementById('toggleBtn');
    
    if (votingActive) {
        statusElement.textContent = 'Aktif';
        statusElement.className = 'status-active';
        toggleBtn.textContent = 'Tutup Voting';
    } else {
        statusElement.textContent = 'Tidak Aktif';
        statusElement.className = 'status-inactive';
        toggleBtn.textContent = 'Buka Voting';
    }
}

// Toggle Voting Status
function toggleVoting() {
    votingActive = !votingActive;
    updateVotingStatus();
    alert(votingActive ? 'Voting telah dibuka!' : 'Voting telah ditutup!');
}

// Load Hasil Voting
function loadResults() {
    const resultsContainer = document.getElementById('resultsContainer');
    resultsContainer.innerHTML = '';
    
    const totalVotes = candidates.reduce((sum, c) => sum + c.jumlah_suara, 0);
    
    candidates.forEach(candidate => {
        const percentage = totalVotes > 0 ? (candidate.jumlah_suara / totalVotes * 100).toFixed(1) : 0;
        
        const card = document.createElement('div');
        card.className = 'result-card';
        card.innerHTML = `
            <h3>${candidate.nama_kandidat}</h3>
            <div class="vote-count">${candidate.jumlah_suara} Suara</div>
            <div class="progress-bar">
                <div class="progress-fill" style="width: ${percentage}%">
                    ${percentage}%
                </div>
            </div>
        `;
        resultsContainer.appendChild(card);
    });
}

// Load Tabel Peserta
function loadPesertaTable() {
    const tbody = document.getElementById('pesertaTableBody');
    tbody.innerHTML = '';
    
    users.filter(u => u.role === 'peserta').forEach(peserta => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${peserta.nis}</td>
            <td>${peserta.nama_peserta}</td>
            <td>${peserta.username}</td>
            <td class="${peserta.sudah_memilih ? 'status-voted' : 'status-not-voted'}">
                ${peserta.sudah_memilih ? '✓ Sudah Memilih' : '✗ Belum Memilih'}
            </td>
        `;
        tbody.appendChild(row);
    });
}

// Load Kelola Kandidat
function loadCandidateManagement() {
    const container = document.getElementById('candidateManagement');
    container.innerHTML = '';
    
    candidates.forEach(candidate => {
        const card = document.createElement('div');
        card.className = 'manage-card';
        card.innerHTML = `
            <div style="font-size: 40px; text-align: center;">${candidate.foto}</div>
            <h4>${candidate.nama_kandidat}</h4>
            <p style="font-size: 13px; color: #666; margin-top: 8px;">${candidate.visi_misi}</p>
            <p style="margin-top: 8px; font-weight: 600; color: #4caf50;">
                Total Suara: ${candidate.jumlah_suara}
            </p>
        `;
        container.appendChild(card);
    });
}

// Auto refresh hasil untuk admin (setiap 5 detik)
setInterval(() => {
    if (currentUser && currentUser.role === 'admin') {
        loadResults();
        loadPesertaTable();
        loadCandidateManagement();
    }
}, 5000);

// Tutup modal saat klik di luar
document.getElementById('voteModal').addEventListener('click', function(e) {
    if (e.target === this) {
        closeModal();
    }
});