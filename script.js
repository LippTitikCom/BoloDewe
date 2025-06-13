const menu = [
  {
    name: "Mie Ayam",
    price: 8000,
    img: "https://cdn.pixabay.com/photo/2015/05/31/13/55/noodles-791654_1280.jpg"
  },
  {
    name: "Bakso",
    price: 10000,
    img: "https://cdn.pixabay.com/photo/2020/09/04/14/06/meatballs-5543954_1280.jpg"
  },
  {
    name: "Es Teh",
    price: 3000,
    img: "https://cdn.pixabay.com/photo/2017/07/30/12/28/ice-tea-2553154_1280.jpg"
  },
  {
    name: "Es Jeruk",
    price: 4000,
    img: "https://cdn.pixabay.com/photo/2017/07/16/10/43/orange-2500167_1280.jpg"
  },
  {
    name: "Teh Anget",
    price: 3000,
    img: "https://cdn.pixabay.com/photo/2016/11/29/03/53/beverage-1869598_1280.jpg"
  },
  {
    name: "Jeruk Anget",
    price: 4000,
    img: "https://cdn.pixabay.com/photo/2018/03/04/15/55/orange-3193038_1280.jpg"
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
  const url = `https://wa.me/6281233946203?text=${encodeURIComponent(message)}`;
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
