const socket = io()

socket.on('render', (data) => {
    console.log(data)
})


const form = document.getElementById("formProducts")
form.addEventListener("submit", (e) => {
    e.preventDefault()
    
    const productTitle = document.getElementById("productTitle");
    const productDescription = document.getElementById("productDescription")
    const productPrice = document.getElementById("productPrice")
    const productCode = document.getElementById("productCode")
    const productStock = document.getElementById("productStock")
    const productThumbnails = document.getElementById("productThumbnails")
    const productCategory = document.getElementById("productCategory")

    const product = {
        title: productTitle.value,
        description: productDescription.value,
        price: productPrice.value,
        code: productCode.value,
        stock: productStock.value,
        thumbnails: productThumbnails.value? [productThumbnails.value] : [],
        category: productCategory.value
    }

    socket.emit('addProduct', product)

    productTitle.value = ""
    productDescription.value = ""
    productPrice.value= ""
    productCode.value= ""
    productStock.value = ""
    productThumbnails.value = ""

    location.reload()
})

const deleteButton = document.querySelectorAll(".deleteButton")
deleteButton.forEach(button => {
    button.addEventListener("click", () => {
        const id = button.id
        const productId = {
            id: id
        }
        socket.emit('delete-product', productId)
        location.reload()
    })
})