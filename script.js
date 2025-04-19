
const unavailableItem = ["Moong Dal", "Nut Cracker", "surf exel", " ", "", "", "", "", "", "", "", "Amul Milk", "Coffie", ""]; // Change these as needed

window.addEventListener("DOMContentLoaded", () => {
    const cards = document.querySelectorAll(".item-card");

    cards.forEach(card => {
        const name = card.querySelector("h3")?.textContent?.trim();
        if (unavailableItem.includes(name)) {
            card.classList.add("unavailable");

            const overlay = document.createElement("div");
            overlay.className = "not-available-overlay";
            overlay.innerHTML = `<span class="notice-text">Currently Not Available</span>`;
            card.appendChild(overlay);
        }
    });
});




const addBtns = document.querySelectorAll(".add-btn");
const qtyControls = document.querySelectorAll(".qty-control");
const qtyDisplays = document.querySelectorAll(".qty");
const decreaseBtns = document.querySelectorAll(".decrease");
const increaseBtns = document.querySelectorAll(".increase");
const itemCards = document.querySelectorAll(".item-card");
const cartText = document.getElementById("cart-text");
const cartContainer = document.querySelector(".cart-container");

const cartModal = document.getElementById("cart-modal");
const closeCart = document.querySelector(".close-cart");
const cartItemsList = document.getElementById("cart-items-list");
const cartTotal = document.getElementById("cart-total");

let cart = JSON.parse(localStorage.getItem("cart")) || {};
// console.log(cart); // For debugging

function updateCartDisplay() {
    cartItemsList.innerHTML = "";
    let totalItems = 0;
    let totalPrice = 0;

    for (const name in cart) {
        const item = cart[name];
        const itemTotal = item.price * item.qty;
        totalItems += item.qty;
        totalPrice += itemTotal;

        const cartItem = document.createElement("div");
        cartItem.classList.add("cart-item");
        // console.log(cartItem); 

        cartItem.innerHTML = `
        <img src="${item.image}" alt="${name}">
        <div>
        <p><strong>${name}</strong></p>
        <p>Qty: ${item.qty}</p>
        <p>Price: ₹${itemTotal}</p>
        </div>
        `;
        // console.log(cartItem); // For debugging

        cartItemsList.appendChild(cartItem);
    }

    // ✅ Update cart button text and color
    cartText.textContent = totalItems > 0 ? `${totalItems} items` : "My Cart";
    cartContainer.style.backgroundColor = totalItems > 0 ? "#444445" : "#ccccd0";

    // ✅ Update total bill and save cart
    cartTotal.textContent = `${totalPrice}`;
    localStorage.setItem("cart", JSON.stringify(cart));
    // console.log(cart); // For debugging
}



function resetButtons() {
    itemCards.forEach((card, index) => {
        const name = card.querySelector("h3").textContent;
        const price = parseInt(card.querySelector("h5").textContent);

        if (cart[name]) {
            addBtns[index].style.display = "none";
            qtyControls[index].style.display = "inline-block";
            qtyDisplays[index].textContent = cart[name].qty;
        } else {
            addBtns[index].style.display = "inline-block";
            qtyControls[index].style.display = "none";
        }
    });
}

addBtns.forEach((btn, index) => {
    btn.addEventListener("click", () => {
        const card = itemCards[index];
        const name = card.querySelector("h3").textContent;
        const price = parseInt(card.querySelector("h5").textContent);

        const img = card.querySelector("img").getAttribute("src");

        if (cart[name]) {
            cart[name].qty++;
        } else {
            cart[name] = { price, qty: 1, image: img };
        }


        if (!cart[name]) {
            cart[name] = { price, qty: 1 };
        }

        updateCartDisplay();
        resetButtons();
    });

    increaseBtns[index].addEventListener("click", () => {
        const name = itemCards[index].querySelector("h3").textContent;
        cart[name].qty++;
        updateCartDisplay();
        qtyDisplays[index].textContent = cart[name].qty;
    });

    decreaseBtns[index].addEventListener("click", () => {
        const name = itemCards[index].querySelector("h3").textContent;
        cart[name].qty--;

        if (cart[name].qty < 1) {
            delete cart[name];
        }

        updateCartDisplay();
        resetButtons();
    });
});

// Show cart modal
cartContainer.addEventListener("click", () => {
    if (Object.keys(cart).length === 0) {
        alert("Cart is empty!");
    } else {
        cartModal.style.display = "block";
    }
});




// Close cart modal
closeCart.addEventListener("click", () => {
    cartModal.style.display = "none";
});

window.addEventListener("click", (e) => {
    if (e.target === cartModal) {
        cartModal.style.display = "none";
    }
});

// On page load
updateCartDisplay();
resetButtons();
console.log(cart); // For debugging


// document.addEventListener("DOMContentLoaded", function () {
const proceedBtn = document.getElementById("proceed-btn");
const userDetailsModal = document.getElementById("user-details-modal");
const closeUserDetails = document.querySelector(".close-user-details");
const userItemsSummary = document.getElementById("user-items-summary");
const userForm = document.getElementById("user-form");
// console.log(userForm); // For debugging

// Make sure cart exists
// let cart = JSON.parse(localStorage.getItem("cart")) || {};

proceedBtn.addEventListener("click", () => {
    document.getElementById("cart-modal").style.display = "none"; // ✅ Hide bill details
    userDetailsModal.style.display = "block"; // ✅ Show user details form

    // Populate item summary
    userItemsSummary.innerHTML = "<h3>Your Order:</h3>";
    let totalQty = 0;

    for (let name in cart) {
        const item = cart[name];
        totalQty += item.qty;

        userItemsSummary.innerHTML += `<p>${name} × ${item.qty}</p>`;
    }

    if (totalQty > 20) {
        alert("Maximum 20 items allowed!");
        userDetailsModal.style.display = "none";
        return;
    }

    userItemsSummary.innerHTML += `<p><strong>Total Items: ${totalQty}</strong></p>`;
});




closeUserDetails.addEventListener("click", () => {
    userDetailsModal.style.display = "none";
});

userForm.addEventListener("submit", (e) => {
    e.preventDefault();

    const data = new FormData(userForm);
    userDetails = Object.fromEntries(data.entries());

    localStorage.setItem("userDetails", JSON.stringify(userDetails));
    console.log("user details " + userDetails); // For debugging

    userDetailsModal.style.display = "none";
    paymentModal.style.display = "block";
});

//} );


// document.addEventListener("DOMContentLoaded", function () {
const paymentModal = document.getElementById("payment-modal");
const closePayment = document.querySelector(".close-payment");
const payNowBtn = document.getElementById("pay-now-btn");
const payLaterBtn = document.getElementById("pay-later-btn");
const txnInput = document.getElementById("txn-id");
const sendDetailsBtn = document.getElementById("send-details-btn");

let userDetails = {};
// let cart = JSON.parse(localStorage.getItem("cart")) || {};

document.getElementById("user-form").addEventListener("submit", function (e) {
    e.preventDefault();

    const data = new FormData(e.target);
    userDetails = Object.fromEntries(data.entries());

    // Hide user form modal and open payment modal
    document.getElementById("user-details-modal").style.display = "none";
    paymentModal.style.display = "block";
});

closePayment.addEventListener("click", () => {
    paymentModal.style.display = "none";
});

payNowBtn.addEventListener("click", () => {
    window.location.href = "pay.html"; // ✅ Redirect to QR + TXN page
});

txnInput.addEventListener("input", () => {
    sendDetailsBtn.disabled = txnInput.value.trim() === "";
});

sendDetailsBtn.addEventListener("click", () => {
    const txnID = txnInput.value.trim();
    if (!txnID) return;

    const message = formatMessage(userDetails, cart, txnID);
    redirectToWhatsApp(message);
    clearAll();
});

payLaterBtn.addEventListener("click", () => {
    const message = formatMessage(userDetails, cart);
    redirectToWhatsApp(message);
    clearAll();
});

function formatMessage(details, cartData, txnID = null) {
    let msg = `*New Order Received!*\n\n`;
    msg += `👤 *Name:* ${details.name}\n🏠 *Hostel:* ${details.hostel}, Room: ${details.room}\n📞 *Phone:* ${details.phone}\n`;
    if (txnID) msg += `💸 *Transaction ID:* ${txnID}\n\n`;

    msg += `🧾 *Order Summary:*\n`;

    let total = 0;
    for (let item in cartData) {
        const qty = cartData[item].qty;
        const price = cartData[item].price;
        const itemTotal = qty * price;
        total += itemTotal;

        msg += `• ${item} × ${qty} = ₹${itemTotal}\n`;
    }

    if (details.hostel.trim().toUpperCase() === "BH-1") {
        msg += `\n🚚 *Delivery Charge:* ₹2`;
        total += 2;
    }

    msg += `\n\n💰 *Total:* ₹${total}`;

    return encodeURIComponent(msg);
}

function redirectToWhatsApp(message) {
    window.location.href = `https://wa.me/917668607168?text=${message}`;
}

function clearAll() {
    localStorage.removeItem("cart");
    paymentModal.style.display = "none";
    setTimeout(() => window.location.href = "/", 500); // Redirect after sending
}
// });
window.addEventListener("load", () => {
    localStorage.removeItem("cart");
});

