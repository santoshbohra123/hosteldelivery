document.getElementById("order-form").addEventListener("submit", function (event) {
    event.preventDefault();

    const name = document.getElementById("name").value;
    const mobile = document.getElementById("mobile").value;

    // const email = document.getElementById("email").value;

    const room = document.getElementById("room").value;
    let hostel = document.getElementById("hostel").value;

    const quantity = parseInt(document.getElementById("quantity").value);
    const paymentMethod = document.getElementById("payment-method").value;


    let hostelValue = hostel.trim().toUpperCase();

    let totalAmount;

    if (hostelValue === "BH2" || hostelValue === "BH-2") {
      const productPrice = 13;
      totalAmount = quantity * productPrice;
       document.querySelector("#delivery-charge").style.display = "none";
    } else {
      const productPrice = 13;
      const deliveryCharge = 2;
      totalAmount = quantity * productPrice + deliveryCharge;
    }



    document.getElementById("bill-quantity").textContent = quantity;
    document.getElementById("total-amount").textContent = totalAmount;
    document.getElementById("order-form").style.display = "none";

    let item= document.getElementById("bill-item-name").innerText;

    if (paymentMethod === "cod") {
      document.getElementById("bill-section").style.display = "block";
      document.getElementById("upi-section").style.display = "none";

      document.getElementById("pay-now").onclick = function () {

        document.getElementById("bill-section").style.cursor = "pointer";
        document.getElementById("bill-section").style.transition = "all 0.3s ease-in-out";
        const whatsappMessage = `Hii, my order details:\nName: ${name}\nMobile: ${mobile}\n Hostel Name: ${hostel}\nRoom No: ${room}\nItem: ${item}\nQuantity: ${quantity}\nTotal Amount: ₹${totalAmount}\nPayment: Cash on Delivery`;
        window.open(`https://wa.me/7668607168?text=${encodeURIComponent(whatsappMessage)}`, "_blank");
        alert("Your order is placed successfully. ✅");
        window.location.href = "/";
      };

    } else if (paymentMethod === "upi") {
      document.getElementById("bill-section").style.display = "block"; // Show order confirmation first
      document.getElementById("upi-section").style.display = "none";  // Hide UPI initially

      // "Order Now" Button Functionality
      document.getElementById("pay-now").onclick = function () {
        document.getElementById("bill-section").style.display = "none";
        document.getElementById("upi-section").style.display = "block";


        let upiID = "upi://pay?pa=kanyalritik87-1@okhdfcbank&pn=Ritesh Kanyal&am=15&cu=INR";
        let qrcode = new QRCode(document.getElementById("qrcode"), {
          text: upiID,
          width: 128,
          height: 128
        });
        

        

     
        let timeLeft = 600; // 10 minutes
        const timerDisplay = document.createElement("p");
        timerDisplay.id = "timer";
        document.getElementById("upi-section").appendChild(timerDisplay);

        const timerInterval = setInterval(() => {
          let minutes = Math.floor(timeLeft / 60);
          let seconds = timeLeft % 60;
          timerDisplay.textContent = `Time left: ${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;

          if (timeLeft <= 0) {
            clearInterval(timerInterval);
            alert("Time expired! Please retry your payment.");
            window.location.href = "/";
          }
          timeLeft--;
        }, 999);

        // Prevent page from closing for 10 minutes
        setTimeout(() => {
          window.location.href = "/";
        }, 600000);

        // Add an important note for the user
        const importantNote = document.createElement("p");
        
        importantNote.innerHTML = `<strong>Important:</strong> Please enter your 10-digit Transaction ID and click 
        'Send Details' to complete your order.`;
        document.getElementById("upi-section").appendChild(importantNote);
       

        // Create "Send Details" Button
        const sendDetailsBtn = document.createElement("button");
        sendDetailsBtn.id = "send-details";
        sendDetailsBtn.textContent = "Send Details";
        sendDetailsBtn.disabled = true; // Initially disabled

        // Apply Beautiful Styling
        sendDetailsBtn.style.display = "block";
        sendDetailsBtn.style.marginTop = "15px";
        sendDetailsBtn.style.padding = "12px 20px";
        sendDetailsBtn.style.fontSize = "18px";
        sendDetailsBtn.style.fontWeight = "bold";
        sendDetailsBtn.style.color = "#ffffff";
        sendDetailsBtn.style.border = "none";
        sendDetailsBtn.style.borderRadius = "8px";
        sendDetailsBtn.style.cursor = "pointer";
        sendDetailsBtn.style.transition = "all 0.3s ease-in-out";

        // Gradient Background for a Premium Look
        sendDetailsBtn.style.background = "linear-gradient(45deg, #FF78AC, #ffcc00)";


        // Hover Effect (Using JavaScript for dynamic changes)
        sendDetailsBtn.addEventListener("mouseenter", function () {
          sendDetailsBtn.style.background = "linear-gradient(45deg,#ff3b3b, #ffaa00)";
          sendDetailsBtn.style.transform = "scale(.95)";
        });

        sendDetailsBtn.addEventListener("mouseleave", function () {
          sendDetailsBtn.style.background = "linear-gradient(45deg,#ff6b6b, #ffcc00)";
          sendDetailsBtn.style.transform = "scale(0.95)";

        });

        // Disabled State Style
        sendDetailsBtn.style.opacity = "0.6";
        sendDetailsBtn.style.cursor = "not-allowed";

        // Enable Button When Required
        function enableSendDetailsButton() {
          sendDetailsBtn.disabled = false;
          sendDetailsBtn.style.opacity = "1.25";
          sendDetailsBtn.style.cursor = "pointer";
        }
        // Append to the UPI Section
        document.getElementById("upi-section").appendChild(sendDetailsBtn);

         
        document.getElementById("upi-section").style.display = "flex";
        document.getElementById("upi-section").style.flexDirection = "column";
        document.getElementById("upi-section").style.alignItems = "center"; // Center horizontally
        document.getElementById("upi-section").style.justifyContent = "center"; // Center vertically




        // Enable button only if transaction ID is at least 10 characters long
        document.getElementById("transaction-id").addEventListener("input", function () {
          const transactionId = document.getElementById("transaction-id").value.trim();
          if (transactionId.length >= 12) {
            enableSendDetailsButton();
            
          } else {
            sendDetailsBtn.disabled = true; // Keep it disabled
            sendDetailsBtn.style.opacity = "0.6";
            sendDetailsBtn.style.cursor = "not-allowed";

          }

        });

        // On clicking "Send Details"
        sendDetailsBtn.onclick = function () {
          const transactionId = document.getElementById("transaction-id").value.trim();
          if (transactionId.length === 12) {
            clearInterval(timerInterval);
            setTimeout(() => {
              const whatsappMessage = `Hi, my order details:\nName: ${name}\nMobile: ${mobile}\n Hostel Name: ${hostel}\nRoom No: ${room}\nItem:${item}\nQuantity: ${quantity}\nTotal Amount: ₹${totalAmount}\nPayment: UPI\nTransaction ID: ${transactionId}`;
              window.open(`https://wa.me/7668607168?text=${encodeURIComponent(whatsappMessage)}`, "_blank");
              alert(" ✅ Payment successful! Redirecting...");
              window.location.href = "/";
            }, 100);
          } else {
            alert("Please enter a valid 12-digit Transaction ID.");
          }
        };
      };
    }
  });