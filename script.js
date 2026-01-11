                        // ============================================
                        // Interior Design Dashboard 
                        // ============================================

// ============================================
// CORE DISPLAY FUNCTIONS
// ============================================

function disp() {
    const tbody = document.getElementById('recordsTbody');
    if (!tbody) return;
    
    tbody.innerHTML = '';
    records.forEach((record) => {
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
// NOTIFICATION SYSTEM
// ============================================

function showNotification(message, type = 'info') {
    const container = document.getElementById('notificationContainer');
    if (!container) return;
    
    const notification = document.createElement('div');
    notification.className = `notification notification-${type} show`;
    notification.innerHTML = `
        <i class="fas fa-${type === 'success' ? 'check-circle' : type === 'error' ? 'exclamation-triangle' : 'info-circle'}"></i>
        ${message}
    `;
    container.appendChild(notification);
    
    setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => notification.remove(), 400);
    }, 4000);
}

// ============================================
// SECTION NAVIGATION (FIXED)
// ============================================

function showSection(sectionName, clickedButton = null) {
    // Hide all sections
    document.querySelectorAll('.content-section').forEach(section => {
        section.classList.remove('active');
    });
    
    // Show target section
    const targetSection = document.getElementById(sectionName);
    if (targetSection) targetSection.classList.add('active');
    
    // Update nav buttons
    document.querySelectorAll('.nav-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    
    // Highlight clicked button
    if (clickedButton) clickedButton.classList.add('active');
}

// ============================================
// UTILITY FUNCTIONS
// ============================================

function validateAadhaar(acno) {
    return acno && acno.toString().length === 12 && !isNaN(acno);
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
        return;
    }
    if (!name || name.length < 2) {
        showNotification('❌ Name must be at least 2 characters!', 'error');
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
    
    records.push({acno, name, tor, aor, bug});
    showNotification('✅ Function 2: Record added successfully!', 'success');
    disp();
    document.getElementById('addAcno').value = '';
    document.getElementById('addName').value = '';
    document.getElementById('addTor').value = '';
    document.getElementById('addAor').value = '';
    document.getElementById('addBug').value = '';
}

// ============================================
// SEARCH FUNCTIONS
// ============================================

function sear() { // Function 3
    const acno = parseInt(document.getElementById('searchAcno')?.value);
    if (!validateAadhaar(acno)) {
        showNotification('❌ Enter valid 12-digit Aadhaar!', 'error');
        return;
    }
    const result = records.find(r => r.acno === acno);
    if (result) {
        showNotification(`✅ Function 3: ${result.name} - ${result.tor} (${result.aor}) ₹${result.bug.toLocaleString()}`, 'success');
    } else {
        showNotification('❌ Function 3: No record found!', 'error');
    }
}

function searname() { // Function 4
    const name = document.getElementById('searchName')?.value?.toLowerCase().trim();
    if (!name) return;
    const results = records.filter(r => r.name.toLowerCase().includes(name));
    showNotification(`✅ Function 4: ${results.length} match(es) for "${name}"`, results.length ? 'success' : 'error');
}

function seartor() { // Function 5
    const tor = document.getElementById('searchTor')?.value?.toLowerCase().trim();
    if (!tor) return;
    const results = records.filter(r => r.tor.toLowerCase().includes(tor));
    showNotification(`✅ Function 5: ${results.length} ${tor} room(s)`, results.length ? 'success' : 'error');
}

function searaor() { // Function 6
    const aor = document.getElementById('searchAor')?.value?.toLowerCase().trim();
    if (!aor) return;
    const results = records.filter(r => r.aor.toLowerCase().includes(aor));
    showNotification(`✅ Function 6: ${results.length} ${aor} style(s)`, results.length ? 'success' : 'error');
}

function searbug() { // Function 7
    const bug = parseInt(document.getElementById('searchBug')?.value);
    if (!bug || bug < 0) return;
    const results = records.filter(r => r.bug >= bug);
    showNotification(`✅ Function 7: ${results.length} projects ≥ ₹${bug.toLocaleString()}`, results.length ? 'success' : 'error');
}

// ============================================
// UPDATE FUNCTIONS
// ============================================

function update() { // Function 8
    const acno = parseInt(document.getElementById('updateAcnoAll')?.value);
    if (!validateAadhaar(acno)) {
        showNotification('❌ Enter valid 12-digit Aadhaar!', 'error');
        return;
    }
    const record = records.find(r => r.acno === acno);
    if (!record) {
        showNotification('❌ Function 8: Record not found!', 'error');
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
    
    showNotification('✅ Function 8: Record updated successfully!', 'success');
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
    
    record[fieldName] = newValue;
    showNotification(`✅ Function ${functionNum}: ${fieldName.toUpperCase()} updated!`, 'success');
    disp();
}

function updatename() { updateSingleField('updateAcnoName', 'updateNameSingle', 'name', 9); }
function updatetor() { updateSingleField('updateAcnoTor', 'updateTorSingle', 'tor', 10); }
function updateaor() { updateSingleField('updateAcnoAor', 'updateAorSingle', 'aor', 11); }
function updatebug() { 
    const acno = parseInt(document.getElementById('updateAcnoBug')?.value);
    const bug = parseInt(document.getElementById('updateBugSingle')?.value);
    if (!validateAadhaar(acno) || !bug || bug <= 0) {
        showNotification('❌ Function 12: Invalid budget!', 'error');
        return;
    }
    const record = records.find(r => r.acno === acno);
    if (!record) {
        showNotification('❌ Function 12: Record not found!', 'error');
        return;
    }
    record.bug = bug;
    showNotification('✅ Function 12: Budget updated!', 'success');
    disp();
}

// ============================================
// DELETE FUNCTIONS 
// ============================================

function del() { // Function 13
    const acno = parseInt(document.getElementById('deleteAcno')?.value);
    if (!validateAadhaar(acno)) {
        showNotification('❌ Enter valid 12-digit Aadhaar!', 'error');
        return;
    }
    const record = records.find(r => r.acno === acno);
    if (!record) {
        showNotification('❌ Function 13: Record not found!', 'error');
        return;
    }
    if (confirm(`Delete "${record.name}" (Aadhaar: ${acno})?`)) {
        const index = records.findIndex(r => r.acno === acno);
        records.splice(index, 1);
        showNotification('✅ Function 13: Record deleted!', 'success');
        disp();
    }
}

function delname() { // Function 14
    const name = prompt('Enter name to delete:');
    if (!name) return;
    const matches = records.filter(r => r.name.toLowerCase().includes(name.toLowerCase()));
    if (matches.length === 0) {
        showNotification('❌ Function 14: No records found!', 'error');
        return;
    }
    if (matches.length === 1) {
        if (confirm(`Delete "${matches[0].name}"?`)) {
            records = records.filter(r => r.name !== matches[0].name);
            showNotification('✅ Function 14: Record deleted!', 'success');
            disp();
        }
    } else {
        showNotification(`ℹ️ Function 14: ${matches.length} matches found. Use Aadhaar for specific delete.`, 'info');
    }
}

function deltor() { // Function 15
    const tor = prompt('Enter room type to delete all:');
    if (!tor) return;
    const matches = records.filter(r => r.tor.toLowerCase() === tor.toLowerCase());
    if (matches.length === 0) {
        showNotification('❌ Function 15: No records found!', 'error');
        return;
    }
    if (confirm(`Delete ${matches.length} ${tor} records?`)) {
        records = records.filter(r => r.tor.toLowerCase() !== tor.toLowerCase());
        showNotification(`✅ Function 15: ${matches.length} records deleted!`, 'success');
        disp();
    }
}

function delall() { // Function 18
    if (records.length === 0) {
        showNotification('ℹ️ No records to delete!', 'info');
        return;
    }
    if (confirm(`Delete ALL ${records.length} records? This cannot be undone!`)) {
        records = [];
        showNotification('✅ Function 18: All records deleted!', 'success');
        disp();
    }
}

// ============================================
// THEME TOGGLE 
// ============================================

function initThemeToggle() {
    const toggle = document.getElementById('themeToggle');
    if (!toggle) return;
    
    const savedTheme = localStorage.getItem('theme') || 'dark';
    document.body.dataset.theme = savedTheme;
    
    const isDark = savedTheme === 'dark';
    const icon = toggle.querySelector('i');
    const span = toggle.querySelector('span');
    
    // FIXED: Correct icon logic
    icon.className = isDark ? 'fas fa-sun' : 'fas fa-moon'; 
    span.textContent = isDark ? 'Light Mode' : 'Dark Mode';
    
    toggle.addEventListener('click', function() {
        const isDark = document.body.dataset.theme === 'dark';
        const newTheme = isDark ? 'light' : 'dark';
        
        document.body.dataset.theme = newTheme;
        icon.className = newTheme === 'dark' ? 'fas fa-sun' : 'fas fa-moon';
        span.textContent = newTheme === 'dark' ? 'Light Mode' : 'Dark Mode';
        
        localStorage.setItem('theme', newTheme);
    });
}

// ============================================
// NAVIGATION SETUP
// ============================================

function initNavigation() {
    document.querySelectorAll('.nav-btn').forEach(btn => {
        btn.addEventListener('click', function(e) {
            e.preventDefault();
            const sectionName = this.dataset.section;
            if (sectionName) {
                showSection(sectionName, this); // Pass button reference
            }
        });
    });
}

// ============================================
// INITIALIZATION
// ============================================

document.addEventListener('DOMContentLoaded', function() {
    console.log('🚀 Interior Design Pro - 18 Functions Dashboard Loaded');
    disp();
    initThemeToggle();
    initNavigation();
    updateRecordCount();
    console.log(`📊 ${records.length} records loaded`);
});
