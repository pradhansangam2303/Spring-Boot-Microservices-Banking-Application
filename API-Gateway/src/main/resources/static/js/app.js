// Banking Application JavaScript
class BankingApp {
    constructor() {
        this.apiBaseUrl = 'http://localhost:8080';
        this.currentUser = null;
        this.currentPage = 'login';
        this.init();
    }

    init() {
        this.bindEvents();
        this.showLoadingScreen();
        this.loadSampleData();
        
        // Hide loading screen after 2 seconds
        setTimeout(() => {
            this.hideLoadingScreen();
        }, 2000);
    }

    showLoadingScreen() {
        const loadingScreen = document.getElementById('loading-screen');
        loadingScreen.style.display = 'flex';
    }

    hideLoadingScreen() {
        const loadingScreen = document.getElementById('loading-screen');
        loadingScreen.classList.add('fade-out');
        setTimeout(() => {
            loadingScreen.style.display = 'none';
        }, 500);
    }

    bindEvents() {
        // Tab switching
        document.querySelectorAll('.tab-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                this.switchTab(e.target.dataset.tab);
            });
        });

        // Form submissions
        document.getElementById('login-form').addEventListener('submit', (e) => {
            e.preventDefault();
            this.handleLogin();
        });

        document.getElementById('register-form').addEventListener('submit', (e) => {
            e.preventDefault();
            this.handleRegister();
        });

        document.getElementById('transfer-form').addEventListener('submit', (e) => {
            e.preventDefault();
            this.handleTransfer();
        });

        document.getElementById('create-account-form').addEventListener('submit', (e) => {
            e.preventDefault();
            this.handleCreateAccount();
        });

        // Password toggle
        document.querySelectorAll('.toggle-password').forEach(btn => {
            btn.addEventListener('click', (e) => {
                this.togglePassword(e.target);
            });
        });

        // Navigation
        document.querySelectorAll('.nav-link').forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                this.switchSection(e.target.dataset.section);
            });
        });

        // Quick actions
        document.querySelectorAll('.quick-action').forEach(action => {
            action.addEventListener('click', (e) => {
                this.handleQuickAction(e.target.dataset.action);
            });
        });

        // Modal handling
        document.getElementById('create-account-btn').addEventListener('click', () => {
            this.showModal('create-account-modal');
        });

        document.querySelectorAll('.modal-close').forEach(btn => {
            btn.addEventListener('click', (e) => {
                this.closeModal();
            });
        });

        document.getElementById('modal-overlay').addEventListener('click', (e) => {
            if (e.target.id === 'modal-overlay') {
                this.closeModal();
            }
        });

        // Logout
        document.getElementById('logout-btn').addEventListener('click', (e) => {
            e.preventDefault();
            this.handleLogout();
        });

        // Transfer amount calculation
        document.getElementById('transfer-amount').addEventListener('input', (e) => {
            this.updateTransferSummary(e.target.value);
        });

        // Action buttons
        document.querySelectorAll('.action-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const action = e.target.textContent.trim().toLowerCase();
                if (action.includes('transfer')) {
                    this.switchSection('transfers');
                } else if (action.includes('deposit')) {
                    this.handleQuickAction('deposit');
                }
            });
        });
    }

    switchTab(tabName) {
        // Update tab buttons
        document.querySelectorAll('.tab-btn').forEach(btn => {
            btn.classList.remove('active');
        });
        document.querySelector(`[data-tab="${tabName}"]`).classList.add('active');

        // Update forms
        document.querySelectorAll('.auth-form').forEach(form => {
            form.classList.remove('active');
        });
        document.getElementById(`${tabName}-form`).classList.add('active');
    }

    togglePassword(button) {
        const input = button.parentElement.querySelector('input');
        const icon = button.querySelector('i');
        
        if (input.type === 'password') {
            input.type = 'text';
            icon.className = 'fas fa-eye-slash';
        } else {
            input.type = 'password';
            icon.className = 'fas fa-eye';
        }
    }

    async handleLogin() {
        const email = document.getElementById('login-email').value;
        const password = document.getElementById('login-password').value;

        this.showToast('Signing in...', 'info');

        try {
            // Simulate API call
            await this.delay(1500);
            
            // For demo purposes, accept any email/password
            this.currentUser = {
                id: 1,
                firstName: 'John',
                lastName: 'Doe',
                email: email,
                accounts: [
                    {
                        id: '1234567890',
                        type: 'CHECKING',
                        balance: 12543.89,
                        accountNumber: '****4567'
                    },
                    {
                        id: '0987654321',
                        type: 'SAVINGS',
                        balance: 25678.12,
                        accountNumber: '****8901'
                    }
                ]
            };

            this.showToast('Welcome back!', 'success');
            this.switchToPage('dashboard');
            this.loadDashboardData();
        } catch (error) {
            this.showToast('Login failed. Please try again.', 'error');
        }
    }

    async handleRegister() {
        const firstName = document.getElementById('reg-firstname').value;
        const lastName = document.getElementById('reg-lastname').value;
        const email = document.getElementById('reg-email').value;
        const phone = document.getElementById('reg-phone').value;
        const password = document.getElementById('reg-password').value;

        const userData = {
            firstName,
            lastName,
            emailId: email,
            contactNumber: phone,
            password
        };

        this.showToast('Creating your account...', 'info');

        try {
            // Simulate API call to /api/users/register
            await this.delay(2000);
            
            this.showToast('Account created successfully! Please login.', 'success');
            this.switchTab('login');
            
            // Clear form
            document.getElementById('register-form').reset();
        } catch (error) {
            this.showToast('Registration failed. Please try again.', 'error');
        }
    }

    async handleTransfer() {
        const fromAccount = document.getElementById('from-account').value;
        const toAccount = document.getElementById('to-account').value;
        const amount = parseFloat(document.getElementById('transfer-amount').value);
        const memo = document.getElementById('transfer-memo').value;

        if (!fromAccount || !toAccount || !amount) {
            this.showToast('Please fill in all required fields', 'warning');
            return;
        }

        const transferData = {
            fromAccountId: fromAccount,
            toAccountId: toAccount,
            amount: amount,
            memo: memo
        };

        this.showToast('Processing transfer...', 'info');

        try {
            // Simulate API call to /fund-transfers
            await this.delay(2000);
            
            this.showToast(`Transfer of $${amount.toFixed(2)} completed successfully!`, 'success');
            
            // Update balance (simulation)
            this.updateAccountBalance(fromAccount, -amount);
            
            // Clear form
            document.getElementById('transfer-form').reset();
            this.updateTransferSummary(0);
            
            // Add to transfer history
            this.addTransferToHistory(transferData);
        } catch (error) {
            this.showToast('Transfer failed. Please try again.', 'error');
        }
    }

    async handleCreateAccount() {
        const accountType = document.getElementById('account-type').value;
        const initialDeposit = parseFloat(document.getElementById('initial-deposit').value);

        if (!accountType || !initialDeposit) {
            this.showToast('Please fill in all fields', 'warning');
            return;
        }

        if (initialDeposit < 25) {
            this.showToast('Minimum deposit is $25.00', 'warning');
            return;
        }

        const accountData = {
            accountType: accountType,
            initialDeposit: initialDeposit,
            userId: this.currentUser.id
        };

        this.showToast('Creating new account...', 'info');

        try {
            // Simulate API call to /accounts
            await this.delay(2000);
            
            const newAccount = {
                id: Date.now().toString(),
                type: accountType,
                balance: initialDeposit,
                accountNumber: '****' + Math.floor(Math.random() * 10000)
            };

            this.currentUser.accounts.push(newAccount);
            
            this.showToast(`${accountType} account created successfully!`, 'success');
            this.closeModal();
            this.loadAccountsData();
            
            // Clear form
            document.getElementById('create-account-form').reset();
        } catch (error) {
            this.showToast('Account creation failed. Please try again.', 'error');
        }
    }

    handleQuickAction(action) {
        switch (action) {
            case 'transfer':
                this.switchSection('transfers');
                break;
            case 'deposit':
                this.showToast('Deposit feature coming soon!', 'info');
                break;
            case 'withdraw':
                this.showToast('Withdrawal feature coming soon!', 'info');
                break;
            case 'pay-bills':
                this.showToast('Bill pay feature coming soon!', 'info');
                break;
        }
    }

    switchToPage(pageName) {
        document.querySelectorAll('.page').forEach(page => {
            page.classList.remove('active');
        });
        document.getElementById(`${pageName}-page`).classList.add('active');
        this.currentPage = pageName;
    }

    switchSection(sectionName) {
        // Update navigation
        document.querySelectorAll('.nav-link').forEach(link => {
            link.classList.remove('active');
        });
        document.querySelector(`[data-section="${sectionName}"]`).classList.add('active');

        // Update sections
        document.querySelectorAll('.dashboard-section').forEach(section => {
            section.classList.remove('active');
        });
        document.getElementById(`${sectionName}-section`).classList.add('active');

        // Load section-specific data
        switch (sectionName) {
            case 'accounts':
                this.loadAccountsData();
                break;
            case 'transactions':
                this.loadTransactionsData();
                break;
            case 'transfers':
                this.loadTransferHistory();
                break;
        }
    }

    showModal(modalId) {
        document.getElementById('modal-overlay').classList.add('active');
        document.getElementById(modalId).style.display = 'block';
    }

    closeModal() {
        document.getElementById('modal-overlay').classList.remove('active');
        document.querySelectorAll('.modal').forEach(modal => {
            modal.style.display = 'none';
        });
    }

    handleLogout() {
        this.currentUser = null;
        this.switchToPage('login');
        this.showToast('You have been logged out', 'info');
        
        // Clear forms
        document.getElementById('login-form').reset();
        document.getElementById('register-form').reset();
    }

    updateTransferSummary(amount) {
        const summaryAmount = document.getElementById('summary-amount');
        const summaryTotal = document.getElementById('summary-total');
        
        const transferAmount = parseFloat(amount) || 0;
        const fee = 0; // No fees for this demo
        const total = transferAmount + fee;
        
        summaryAmount.textContent = `$${transferAmount.toFixed(2)}`;
        summaryTotal.textContent = `$${total.toFixed(2)}`;
    }

    updateAccountBalance(accountType, change) {
        if (accountType === 'checking') {
            const balanceElement = document.getElementById('primary-balance');
            const currentBalance = parseFloat(balanceElement.textContent.replace('$', '').replace(',', ''));
            const newBalance = currentBalance + change;
            balanceElement.textContent = `$${newBalance.toLocaleString('en-US', { minimumFractionDigits: 2 })}`;
        } else if (accountType === 'savings') {
            const balanceElement = document.getElementById('savings-balance');
            const currentBalance = parseFloat(balanceElement.textContent.replace('$', '').replace(',', ''));
            const newBalance = currentBalance + change;
            balanceElement.textContent = `$${newBalance.toLocaleString('en-US', { minimumFractionDigits: 2 })}`;
        }
    }

    loadDashboardData() {
        // Update user name
        document.getElementById('user-name').textContent = 
            `${this.currentUser.firstName} ${this.currentUser.lastName}`;
        
        // Load recent transactions
        this.loadRecentTransactions();
    }

    loadRecentTransactions() {
        const container = document.getElementById('recent-transactions');
        const sampleTransactions = [
            {
                id: '1',
                type: 'deposit',
                title: 'Direct Deposit',
                subtitle: 'Salary Payment',
                amount: 3250.00,
                date: new Date().toLocaleDateString()
            },
            {
                id: '2',
                type: 'withdrawal',
                title: 'ATM Withdrawal',
                subtitle: 'Main Street ATM',
                amount: -100.00,
                date: new Date(Date.now() - 86400000).toLocaleDateString()
            },
            {
                id: '3',
                type: 'transfer',
                title: 'Transfer to Savings',
                subtitle: 'Monthly Savings',
                amount: -500.00,
                date: new Date(Date.now() - 172800000).toLocaleDateString()
            }
        ];

        container.innerHTML = sampleTransactions.map(transaction => `
            <div class="transaction-item">
                <div class="transaction-icon ${transaction.type}">
                    <i class="fas fa-${this.getTransactionIcon(transaction.type)}"></i>
                </div>
                <div class="transaction-details">
                    <div class="transaction-title">${transaction.title}</div>
                    <div class="transaction-subtitle">${transaction.subtitle}</div>
                </div>
                <div class="transaction-amount ${transaction.amount > 0 ? 'positive' : 'negative'}">
                    ${transaction.amount > 0 ? '+' : ''}$${Math.abs(transaction.amount).toFixed(2)}
                </div>
            </div>
        `).join('');
    }

    loadAccountsData() {
        const container = document.getElementById('accounts-grid');
        if (!this.currentUser || !this.currentUser.accounts) return;

        container.innerHTML = this.currentUser.accounts.map(account => `
            <div class="account-card ${account.type.toLowerCase()}">
                <div class="card-header">
                    <div class="card-title">
                        <i class="fas fa-${account.type === 'CHECKING' ? 'credit-card' : 'piggy-bank'}"></i>
                        <div>
                            <h3>${account.type.charAt(0) + account.type.slice(1).toLowerCase()} Account</h3>
                            <p>Account ending in ${account.accountNumber}</p>
                        </div>
                    </div>
                </div>
                <div class="card-balance">
                    <span class="balance-label">Available Balance</span>
                    <span class="balance-amount">$${account.balance.toLocaleString('en-US', { minimumFractionDigits: 2 })}</span>
                </div>
                <div class="card-actions">
                    <button class="action-btn">
                        <i class="fas fa-eye"></i>
                        View Details
                    </button>
                    <button class="action-btn">
                        <i class="fas fa-download"></i>
                        Statement
                    </button>
                </div>
            </div>
        `).join('');
    }

    loadTransactionsData() {
        const tbody = document.getElementById('transactions-table-body');
        const sampleTransactions = [
            {
                date: new Date().toLocaleDateString(),
                description: 'Direct Deposit - Salary',
                account: 'Primary Checking',
                type: 'Deposit',
                amount: 3250.00,
                balance: 12543.89
            },
            {
                date: new Date(Date.now() - 86400000).toLocaleDateString(),
                description: 'ATM Withdrawal',
                account: 'Primary Checking',
                type: 'Withdrawal',
                amount: -100.00,
                balance: 9293.89
            },
            {
                date: new Date(Date.now() - 172800000).toLocaleDateString(),
                description: 'Transfer to Savings',
                account: 'Primary Checking',
                type: 'Transfer',
                amount: -500.00,
                balance: 9393.89
            },
            {
                date: new Date(Date.now() - 259200000).toLocaleDateString(),
                description: 'Online Purchase',
                account: 'Primary Checking',
                type: 'Purchase',
                amount: -89.99,
                balance: 9893.89
            }
        ];

        tbody.innerHTML = sampleTransactions.map(transaction => `
            <tr>
                <td>${transaction.date}</td>
                <td>${transaction.description}</td>
                <td>${transaction.account}</td>
                <td><span class="badge ${transaction.type.toLowerCase()}">${transaction.type}</span></td>
                <td class="${transaction.amount > 0 ? 'positive' : 'negative'}">
                    ${transaction.amount > 0 ? '+' : ''}$${Math.abs(transaction.amount).toFixed(2)}
                </td>
                <td>$${transaction.balance.toFixed(2)}</td>
                <td>
                    <button class="btn-small" onclick="app.viewTransactionDetails('${transaction.date}')">
                        <i class="fas fa-eye"></i>
                    </button>
                </td>
            </tr>
        `).join('');
    }

    loadTransferHistory() {
        const container = document.getElementById('transfer-history');
        const sampleTransfers = [
            {
                date: new Date(Date.now() - 86400000).toLocaleDateString(),
                to: '****5678',
                amount: 250.00,
                status: 'Completed'
            },
            {
                date: new Date(Date.now() - 172800000).toLocaleDateString(),
                to: '****9012',
                amount: 500.00,
                status: 'Completed'
            }
        ];

        container.innerHTML = sampleTransfers.map(transfer => `
            <div class="transfer-item">
                <div class="transfer-details">
                    <div class="transfer-title">Transfer to ${transfer.to}</div>
                    <div class="transfer-date">${transfer.date}</div>
                </div>
                <div class="transfer-amount">$${transfer.amount.toFixed(2)}</div>
                <div class="transfer-status completed">${transfer.status}</div>
            </div>
        `).join('');
    }

    addTransferToHistory(transferData) {
        const container = document.getElementById('transfer-history');
        const transferItem = document.createElement('div');
        transferItem.className = 'transfer-item';
        transferItem.innerHTML = `
            <div class="transfer-details">
                <div class="transfer-title">Transfer to ${transferData.toAccountId}</div>
                <div class="transfer-date">${new Date().toLocaleDateString()}</div>
            </div>
            <div class="transfer-amount">$${transferData.amount.toFixed(2)}</div>
            <div class="transfer-status completed">Completed</div>
        `;
        container.insertBefore(transferItem, container.firstChild);
    }

    viewTransactionDetails(transactionId) {
        // This would normally fetch transaction details from API
        this.showToast('Transaction details feature coming soon!', 'info');
    }

    getTransactionIcon(type) {
        switch (type) {
            case 'deposit': return 'arrow-down';
            case 'withdrawal': return 'arrow-up';
            case 'transfer': return 'exchange-alt';
            default: return 'dollar-sign';
        }
    }

    showToast(message, type = 'info') {
        const container = document.getElementById('toast-container');
        const toast = document.createElement('div');
        toast.className = `toast ${type}`;
        
        const icon = this.getToastIcon(type);
        toast.innerHTML = `
            <i class="fas fa-${icon}"></i>
            <span>${message}</span>
        `;
        
        container.appendChild(toast);
        
        // Auto remove after 4 seconds
        setTimeout(() => {
            toast.style.transform = 'translateX(400px)';
            setTimeout(() => {
                if (container.contains(toast)) {
                    container.removeChild(toast);
                }
            }, 300);
        }, 4000);
    }

    getToastIcon(type) {
        switch (type) {
            case 'success': return 'check-circle';
            case 'error': return 'exclamation-circle';
            case 'warning': return 'exclamation-triangle';
            case 'info': return 'info-circle';
            default: return 'info-circle';
        }
    }

    loadSampleData() {
        // This would normally load data from APIs
        // For demo purposes, we'll use sample data
    }

    delay(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
}

// Initialize the application
const app = new BankingApp();

// Additional utility functions
document.addEventListener('DOMContentLoaded', function() {
    // Add loading states to buttons
    const buttons = document.querySelectorAll('.btn-primary');
    buttons.forEach(button => {
        button.addEventListener('click', function() {
            if (this.type === 'submit') {
                const originalText = this.innerHTML;
                this.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Processing...';
                this.disabled = true;
                
                setTimeout(() => {
                    this.innerHTML = originalText;
                    this.disabled = false;
                }, 2000);
            }
        });
    });

    // Add smooth scrolling
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth'
                });
            }
        });
    });

    // Add form validation styling
    const inputs = document.querySelectorAll('input, select, textarea');
    inputs.forEach(input => {
        input.addEventListener('blur', function() {
            if (this.required && !this.value) {
                this.style.borderColor = '#ef4444';
            } else {
                this.style.borderColor = '#e5e7eb';
            }
        });

        input.addEventListener('focus', function() {
            this.style.borderColor = '#667eea';
        });
    });
});

// Export for global access
window.app = app;