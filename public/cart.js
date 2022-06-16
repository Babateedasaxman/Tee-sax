const paymentButton = document.querySelector('#checkout-button')

const price = parseInt(paymentButton.getAttribute('price'))
const phoneNo = paymentButton.getAttribute('number')
const email = paymentButton.getAttribute('email')
const UsersName = paymentButton.getAttribute('name')
const priceInt = parseFloat(price)


paymentButton.addEventListener('click',makePayment)

function makePayment() {

FlutterwaveCheckout({
  public_key: "FLWPUBK_TEST-c22197f552879d58fc3db046f4bfe6cf-X",
  tx_ref: "titanic-48981487343MDI0NzMx"+new Date().getUTCDate.toString(),
  amount: price,
  currency: "NGN",
  payment_options: "card, banktransfer, ussd",
  redirect_url: "/orders/success",
 
  customer: {
    email: email,
    phone_number: '12345506060',
    name: UsersName,
  },
  customizations: {
    title: "Dee styling",
    description: "testing ",
    logo: "https://www.logolynx.com/images/logolynx/22/2239ca38f5505fbfce7e55bbc0604386.jpeg",
  },
});
}


//   checkoutForm.addEventListener('submit',(e)=>{
//     e.preventDefault()
//     fetch("/orders/create-order",
//     {
//         headers: {
//           'Accept': 'application/json',
//           'Content-Type': 'application/json'
//         },
//         method: "POST",
//         body: JSON.stringify({price:priceInt})
//     })

// })