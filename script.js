document.addEventListener('DOMContentLoaded', () => {
    // Persistent Cart Logic
    let cart = JSON.parse(localStorage.getItem('xyz_cart')) || [];
    
    const updateNavCounter = () => {
        const countElement = document.getElementById('cartCount');
        if (countElement) {
            const totalItems = cart.reduce((acc, item) => acc + item.quantity, 0);
            countElement.textContent = `(${totalItems})`;
        }
    };

    // Use Event Delegation for 'Add to Cart'
    document.addEventListener('click', (e) => {
        if (e.target.classList.contains('add-to-cart')) {
            const btn = e.target;
            const card = btn.closest('.product-card');
            const id = parseInt(card.dataset.id);
            const name = card.dataset.name;
            const price = parseFloat(card.dataset.price);
            const img = card.querySelector('img').src;

            // Visual Reaction
            const originalText = btn.textContent;
            btn.textContent = 'Added!';
            btn.classList.add('btn-added');
            
            const existing = cart.find(i => i.id === id);
            if (existing) {
                existing.quantity += 1;
            } else {
                cart.push({ id, name, price, img, quantity: 1 });
            }
            
            localStorage.setItem('xyz_cart', JSON.stringify(cart));
            updateNavCounter();
            showToast(`${name} added to cart`);

            // Reset reaction
            setTimeout(() => {
                btn.textContent = originalText;
                btn.classList.remove('btn-added');
            }, 1500);
        }
    });

    // Toast Notification System
    const showToast = (msg) => {
        let toast = document.querySelector('.toast');
        if (!toast) {
            toast = document.createElement('div');
            toast.className = 'toast';
            document.body.appendChild(toast);
        }
        toast.textContent = msg;
        toast.classList.add('active');
        setTimeout(() => toast.classList.remove('active'), 3000);
    };

    // Helper Styles for Toast
    const style = document.createElement('style');
    style.innerHTML = `
        .toast {
            position: fixed;
            bottom: 2rem;
            left: 50%;
            transform: translateX(-50%) translateY(100px);
            background: #000;
            color: #fff;
            padding: 1rem 2.5rem;
            text-transform: uppercase;
            letter-spacing: 0.1em;
            font-size: 0.75rem;
            transition: 0.5s cubic-bezier(0.23, 1, 0.32, 1);
            z-index: 9999;
            opacity: 0;
            border: 1px solid rgba(255,255,255,0.1);
        }
        .toast.active {
            transform: translateX(-50%) translateY(0);
            opacity: 1;
        }
        .qty-control {
            display: flex;
            align-items: center;
            gap: 1.5rem;
        }
        .qty-control button {
            background: none;
            border: 1px solid #e5e7eb;
            width: 32px;
            height: 32px;
            cursor: pointer;
            transition: 0.3s;
        }
        .qty-control button:hover {
            background: #000;
            color: #fff;
        }
        .btn-added {
            background: #064e3b !important;
            color: #fff !important;
            animation: bounce 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
        }
        @keyframes bounce {
            0% { transform: scale(1); }
            50% { transform: scale(1.05); }
            100% { transform: scale(1); }
        }
    `;
    document.head.appendChild(style);

    // Initial counter update
    updateNavCounter();
});
