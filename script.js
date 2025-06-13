const menu = [
  {
    name: "Mie Ayam",
    price: 8000,
    img: "https://allofresh.id/blog/wp-content/uploads/2023/08/cara-membuat-mie-ayam-4-780x470.jpg"
  },
  {
    name: "Bakso",
    price: 10000,
    img: "https://i0.wp.com/resepkoki.id/wp-content/uploads/2016/04/Resep-Bakso-urat.jpg?fit=1518%2C1920&ssl=1"
  },
  {
    name: "Es Teh",
    price: 3000,
    img: "https://awsimages.detik.net.id/community/media/visual/2023/10/17/es-teh-manis_169.jpeg?w=1200"
  },
  {
    name: "Es Jeruk",
    price: 4000,
    img: "https://cdn.rri.co.id/berita/Palangkaraya/o/1726808411077-es-jeruk-final2/ixbgg2zoqr1d6m7.jpeg"
  },
  {
    name: "Teh Anget",
    price: 3000,
    img: "https://awsimages.detik.net.id/community/media/visual/2022/05/22/teh-hangat-3.jpeg?w=724"
  },
  {
    name: "Jeruk Anget",
    price: 4000,
    img: "https://img-global.cpcdn.com/recipes/2a8028fc0e0830d1/680x482cq90/jeruk-peras-hangat-foto-resep-utama.jpg"
  }
];

let cart = {};

function addToCart(name, price) {
  if (!cart[name]) {
    cart[name] = { price: price, qty: 1 };
  } else {
    cart[name].qty += 1;
  }
  updateCart();
}

function removeFromCart(name) {
  if (cart[name]) {
    cart[name].qty -= 1;
    if (cart[name].qty <= 0) delete cart[name];
    updateCart();
  }
}

function deleteItem(name) {
  delete cart[name];
  updateCart();
}

function updateCart() {
  const popup = document.getElementById("cart-popup");
  const items = document.getElementById("cart-items");
  items.innerHTML = "";

  Object.keys(cart).forEach(name => {
    const item = cart[name];
    items.innerHTML += `
      <div class="cart-item">
        ${name} x${item.qty} - Rp${item.price * item.qty}
        <div>
          <button onclick="addToCart('${name}', ${item.price})">+</button>
          <button onclick="removeFromCart('${name}')">−</button>
          <button onclick="deleteItem('${name}')">Hapus</button>
        </div>
      </div>`;
  });

  popup.classList.toggle("show", Object.keys(cart).length > 0);
}

function checkout() {
  let message = "Halo, saya mau pesan:\n";
  Object.keys(cart).forEach(name => {
    const item = cart[name];
    message += `- ${name} x${item.qty} = Rp${item.price * item.qty}\n`;
  });
  const url = `https://wa.me/6281216614385?text=${encodeURIComponent(message)}`;
  window.open(url, "_blank");
}

window.onload = () => {
  const container = document.getElementById("menu-items");
  menu.forEach(item => {
    container.innerHTML += `
      <div class="menu-card">
        <img src="${item.img}" alt="${item.name}">
        <h3>${item.name}</h3>
        <p>Rp${item.price}</p>
        <button onclick="addToCart('${item.name}', ${item.price})">Tambah ke Keranjang</button>
      </div>`;
  });
};
