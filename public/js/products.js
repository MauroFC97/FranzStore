const form = document.querySelector("form");
form.addEventListener("submit", (e) => {
  e.preventDefault();
  const data = new FormData(form);
  fetch("/products", {
    method: "POST",
    body: data,
  })
    .then((res) => res.json())
    .then(
      (data) =>
        (document.querySelector("#response").innerHTML = `
          <p>Titulo: ${data.title}</p>
          <p>Precio: ${data.price}</p>
          <p>Descripcion: ${data.description}</p>
          <p>Stock: ${data.stock}</p>
          <img src="/uploads/${data.thumbnail}" alt="imagen"</p>
          <p>Categoria: ${data.category}</p>
          `)
    )
    .catch(
      (err) => (document.querySelector("#response").innerHTML = `<p>${err}</p>`)
    );
});
