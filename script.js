// ============================================
// Interior Design Dashboard 
// ============================================

// Global records array (loaded from localStorage)
let records = JSON.parse(localStorage.getItem('interiorRecords')) || [];

// ============================================
// CORE DISPLAY FUNCTIONS
// ============================================

function disp(filteredRecords = records) {
    const tbody = document.getElementById('recordsTbody');
    if (!tbody) return;
    
    tbody.innerHTML = '';
    
    if (filteredRecords.length === 0) {
        tbody.innerHTML = '<tr><td colspan="5" style="text-align: center; padding: 2rem; color: var(--text-secondary);">No records found</td></tr>';
        return;
    }
    
    filteredRecords.forEach((record) => {
        const row = tbody.insertRow();
        row.innerHTML = `
            <td>${record.acno}</td>
            <td>${record.name}</td>
            <td>${record.tor.replace(/^\w/, c => c.toUpperCase())}</td>
            <td>${record.aor.replace(/^\w/, c => c.toUpperCase())}</td>
            <td>₹${record.bug.toLocaleString()}</td>
        `;
    });
    updateRecordCount();
}

function updateRecordCount() {
    const countEl = document.getElementById('recordCount');
    if (countEl) countEl.textContent = records.length;
}

// ============================================
// ENHANCED NOTIFICATION SYSTEM
// ============================================

function showNotification(message, type = 'info') {
    const container = document.getElementById('notificationContainer');
    if (!container) return;
    
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <i class="fas fa-${type === 'success' ? 'check-circle' : type === 'error' ? 'exclamation-triangle' : 'info-circle'}"></i>
        ${message}
    `;
    container.appendChild(notification);
    
    // Animate in
    requestAnimationFrame(() => notification.classList.add('show'));
    
    // Auto remove after 4 seconds
    setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => notification.remove(), 400);
    }, 4000);
}

// ============================================
// SECTION NAVIGATION 
// ============================================

function showSection(sectionName, clickedButton = null) {
    // Hide all sections
    document.querySelectorAll('.content-section').forEach(section => {
        section.classList.remove('active');
    });
    
    // Show target section
    const targetSection = document.getElementById(sectionName);
    if (targetSection) {
        targetSection.classList.add('active');
        targetSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
    
    // Update nav buttons
    document.querySelectorAll('.nav-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    
    if (clickedButton) clickedButton.classList.add('active');
}

// ============================================
// UTILITY FUNCTIONS
// ============================================

function validateAadhaar(acno) {
    return acno && acno.toString().length === 12 && !isNaN(acno);
}

function saveRecords() {
    localStorage.setItem('interiorRecords', JSON.stringify(records));
}

function getFormData(formId) {
    const form = document.getElementById(formId);
    if (!form) return null;
    const formData = new FormData(form);
    const data = {};
    for (let [key, value] of formData.entries()) {
        data[key] = value;
    }
    return data;
}

// ============================================
// ADD RECORD 
// ============================================

function addrec() {
    const acno = parseInt(document.getElementById('addAcno')?.value);
    const name = document.getElementById('addName')?.value?.trim();
    const tor = document.getElementById('addTor')?.value;
    const aor = document.getElementById('addAor')?.value;
    const bug = parseInt(document.getElementById('addBug')?.value);
    
    // Enhanced validation
    if (!validateAadhaar(acno)) {
        showNotification('❌ Aadhaar must be 12 digits!', 'error');
        document.getElementById('addAcno')?.focus();
        return;
    }
    if (!name || name.length < 2) {
        showNotification('❌ Name must be at least 2 characters!', 'error');
        document.getElementById('addName')?.focus();
        return;
    }
    if (!tor || !aor || !bug || bug <= 0) {
        showNotification('❌ Please fill all fields correctly!', 'error');
        return;
    }
    if (records.find(r => r.acno === acno)) {
        showNotification('❌ Aadhaar already exists!', 'error');
        return;
    }
    
    records.push({acno, name, tor, aor, bug, date: new Date().toLocaleDateString()});
    saveRecords();
    showNotification('✅ Record added successfully!', 'success');
    disp();
    
    // Reset form with smooth animation
    const form = document.getElementById('addForm');
    form?.reset();
}

// ============================================
// SEARCH FUNCTIONS 
// ============================================

function sear() { 
    const acno = parseInt(document.getElementById('searchAcno')?.value);
    if (!validateAadhaar(acno)) {
        showNotification('❌ Enter valid 12-digit Aadhaar!', 'error');
        return;
    }
    const result = records.find(r => r.acno === acno);
    if (result) {
        showNotification(`✅ ${result.name} - ${result.tor} (${result.aor}) ₹${result.bug.toLocaleString()}`, 'success');
        highlightRecord(result.acno);
    } else {
        showNotification('❌ No record found!', 'error');
    }
}

function searname() { 
    const name = document.getElementById('searchName')?.value?.toLowerCase().trim();
    if (!name) return;
    const results = records.filter(r => r.name.toLowerCase().includes(name));
    showNotification(`${results.length} match(es) for "${name}"`, results.length ? 'success' : 'error');
    if (results.length) disp(results);
}

function seartor() { 
    const tor = document.getElementById('searchTor')?.value?.toLowerCase().trim();
    if (!tor) return;
    const results = records.filter(r => r.tor.toLowerCase().includes(tor));
    showNotification(`${results.length} ${tor} room(s)`, results.length ? 'success' : 'error');
    if (results.length) disp(results);
}

function searaor() { 
    const aor = document.getElementById('searchAor')?.value?.toLowerCase().trim();
    if (!aor) return;
    const results = records.filter(r => r.aor.toLowerCase().includes(aor));
    showNotification(`${results.length} ${aor} style(s)`, results.length ? 'success' : 'error');
    if (results.length) disp(results);
}

function searbug() { 
    const bug = parseInt(document.getElementById('searchBug')?.value);
    if (!bug || bug < 0) return;
    const results = records.filter(r => r.bug >= bug);
    showNotification(`${results.length} projects ≥ ₹${bug.toLocaleString()}`, results.length ? 'success' : 'error');
    if (results.length) disp(results);
}

function highlightRecord(acno) {
    const rows = document.querySelectorAll('#recordsTbody tr');
    rows.forEach(row => row.style.background = '');
    setTimeout(() => {
        const targetRow = Array.from(rows).find(row => 
            row.cells[0].textContent === acno.toString()
        );
        if (targetRow) {
            targetRow.style.background = 'rgba(16, 185, 129, 0.2)';
            targetRow.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
    }, 100);
}

// ============================================
// UPDATE FUNCTIONS 
// ============================================

function update() {
    const acno = parseInt(document.getElementById('updateAcnoAll')?.value);
    if (!validateAadhaar(acno)) {
        showNotification('❌ Enter valid 12-digit Aadhaar!', 'error');
        return;
    }
    const record = records.find(r => r.acno === acno);
    if (!record) {
        showNotification('❌ Record not found!', 'error');
        return;
    }
    
    const name = document.getElementById('updateName')?.value?.trim();
    const tor = document.getElementById('updateTor')?.value;
    const aor = document.getElementById('updateAor')?.value;
    const bug = parseInt(document.getElementById('updateBug')?.value);
    
    if (name) record.name = name;
    if (tor) record.tor = tor;
    if (aor) record.aor = aor;
    if (bug && bug > 0) record.bug = bug;
    
    saveRecords();
    showNotification('✅ Record updated successfully!', 'success');
    disp();
}

function updateSingleField(acnoId, fieldId, fieldName, functionNum) {
    const acno = parseInt(document.getElementById(acnoId)?.value);
    const newValue = document.getElementById(fieldId)?.value?.trim();
    
    if (!validateAadhaar(acno) || !newValue) {
        showNotification(`❌ Function ${functionNum}: Invalid input!`, 'error');
        return;
    }
    
    const record = records.find(r => r.acno === acno);
    if (!record) {
        showNotification(`❌ Function ${functionNum}: Record not found!`, 'error');
        return;
    }
    
    record[fieldName] = fieldName === 'bug' ? parseInt(newValue) : newValue;
    saveRecords();
    showNotification(`✅ Function ${functionNum}: ${fieldName.toUpperCase()} updated!`, 'success');
    disp();
}

// Function wrappers 
function updatename() { updateSingleField('updateAcnoName', 'updateNameSingle', 'name', 9); }
function updatetor() { updateSingleField('updateAcnoTor', 'updateTorSingle', 'tor', 10); }
function updateaor() { updateSingleField('updateAcnoAor', 'updateAorSingle', 'aor', 11); }
function updatebug() { updateSingleField('updateAcnoBug', 'updateBugSingle', 'bug', 12); }

// ============================================
// DELETE FUNCTIONS 
// ============================================

function del() { 
    const acno = parseInt(document.getElementById('deleteAcno')?.value);
    if (!validateAadhaar(acno)) {
        showNotification('❌ Enter valid 12-digit Aadhaar!', 'error');
        return;
    }
    const record = records.find(r => r.acno === acno);
    if (!record) {
        showNotification('❌ Record not found!', 'error');
        return;
    }
    if (confirm(`Delete "${record.name}" (Aadhaar: ${acno})?`)) {
        records = records.filter(r => r.acno !== acno);
        saveRecords();
        showNotification('✅ Record deleted!', 'error');
        disp();
    }
}

function delname() { 
    const name = prompt('Enter name to delete:');
    if (!name) return;
    const matches = records.filter(r => r.name.toLowerCase().includes(name.toLowerCase()));
    if (matches.length === 0) {
        showNotification('❌ No records found!', 'error');
        return;
    }
    if (matches.length === 1) {
        if (confirm(`Delete "${matches[0].name}"?`)) {
            records = records.filter(r => r.name !== matches[0].name);
            saveRecords();
            showNotification('✅ Record deleted!', 'error');
            disp();
        }
    } else {
        showNotification(`${matches.length} matches found. Use Aadhaar for specific delete.`, 'info');
    }
}

function deltor() {
    const tor = prompt('Enter room type to delete all:');
    if (!tor) return;
    const matches = records.filter(r => r.tor.toLowerCase() === tor.toLowerCase());
    if (matches.length === 0) {
        showNotification('❌ No records found!', 'error');
        return;
    }
    if (confirm(`Delete ${matches.length} ${tor} records?`)) {
        records = records.filter(r => r.tor.toLowerCase() !== tor.toLowerCase());
        saveRecords();
        showNotification(`${matches.length} records deleted!`, 'error');
        disp();
    }
}

function delall() { 
    if (records.length === 0) {
        showNotification('ℹ️ No records to delete!', 'info');
        return;
    }
    if (confirm(`Delete ALL ${records.length} records? This cannot be undone!`)) {
        records = [];
        localStorage.removeItem('interiorRecords');
        showNotification('✅ All records deleted!', 'error');
        disp();
    }
}

// ============================================
// THEME TOGGLE
// ============================================

function initThemeToggle() {
    const toggle = document.querySelector('.theme-toggle'); 
    if (!toggle) return;
    
    const savedTheme = localStorage.getItem('theme') || 'dark';
    document.documentElement.setAttribute('data-theme', savedTheme);
    
    const isDark = savedTheme === 'dark';
    const icon = toggle.querySelector('i');
    const span = toggle.querySelector('span');
    
    if (icon) icon.className = isDark ? 'fas fa-sun' : 'fas fa-moon'; 
    if (span) span.textContent = isDark ? 'Light Mode' : 'Dark Mode';
    
    toggle.addEventListener('click', function() {
        const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
        const newTheme = isDark ? 'light' : 'dark';
        
        document.documentElement.setAttribute('data-theme', newTheme);
        if (icon) icon.className = newTheme === 'dark' ? 'fas fa-sun' : 'fas fa-moon';
        if (span) span.textContent = newTheme === 'dark' ? 'Light Mode' : 'Dark Mode';
        
        localStorage.setItem('theme', newTheme);
        showNotification(`Theme switched to ${newTheme}!`, 'info');
    });
}

// ============================================
// NAVIGATION SETUP
// ============================================

function initNavigation() {
    document.querySelectorAll('.nav-btn').forEach(btn => {
        btn.addEventListener('click', function(e) {
            e.preventDefault();
            const sectionName = this.dataset.section || this.dataset.target; // Support both
            if (sectionName) {
                showSection(sectionName, this);
            }
        });
    });
}

// ============================================
// FORM EVENT LISTENERS 
// ============================================

function initForms() {
    // Auto-focus first input in forms
    document.querySelectorAll('.input-form input, .form-group input').forEach((input, index) => {
        if (index === 0) input.focus();
        
        // Form reset after successful submission
        const form = input.closest('form');
        if (form) {
            form.addEventListener('submit', function(e) {
                if (e.defaultPrevented) return;
                setTimeout(() => form.reset(), 500);
            });
        }
    });
}

// ============================================
// INITIALIZATION
// ============================================

document.addEventListener('DOMContentLoaded', function() {
    console.log('🚀 Interior Design Pro - 18 Functions Dashboard Loaded');
    
    // Initialize everything
    initThemeToggle();
    initNavigation();
    initForms();
    disp();
    updateRecordCount();
    
    console.log(`📊 ${records.length} records loaded from localStorage`);
    showNotification('Dashboard ready! All 18 functions operational.', 'success');
});

// Export functions globally for HTML onclick
window.addrec = addrec;
window.sear = sear;
window.searname = searname;
window.seartor = seartor;
window.searaor = searaor;
window.searbug = searbug;
window.update = update;
window.updatename = updatename;
window.updatetor = updatetor;
window.updateaor = updateaor;
window.updatebug = updatebug;
window.del = del;
window.delname = delname;
window.deltor = deltor;
window.delall = delall;
