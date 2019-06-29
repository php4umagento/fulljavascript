const stripe = Stripe('pk_live_XN1HL05hzvpj3UPR8Z1oqiCJ');

function sendGa(event) {
  try {
    // gtag('event', 'buy_intent', { event_category: 'books', event_label: event.target.id });
    gtag('event', 'begin_checkout', {
      items: [{
        name: 'DSA.js Book',
        list_name: event.target.id,
        category: 'Book',
        quantity: 1,
        price: '9.70',
      }],
    });
  } catch (error) {
    console.warn(`Couldn't send event to GA ${error}`);
  }
}


function checkout(event) {
  sendGa(event);
  // When the customer clicks on the button, redirect
  // them to Checkout.
  stripe.redirectToCheckout({
    items: [{ sku: 'sku_F3AW85p6uVtjJz', quantity: 1 }],

    // Note that it is not guaranteed your customers will be redirected to this
    // URL *100%* of the time, it's possible that they could e.g. close the
    // tab between form submission and the redirect.
    successUrl: 'https://books.adrianmejia.com/success.html',
    cancelUrl: 'https://books.adrianmejia.com',
  }).then((result) => {
    if (result.error) {
      // If `redirectToCheckout` fails due to a browser or network
      // error, display the localized error message to your customer.
      const displayError = document.getElementById('error-message');
      displayError.textContent = result.error.message;
      console.error(result.error);
    }
  }).catch((error) => {
    console.warn('logging exception with stripe', error);
    gtag('event', 'exception', { description: error.message });
  });
}

try {
  // ES6
  const elements = document.getElementsByClassName('checkout-button-sku_F1INse7ZB79EZ9');
  Array.from(elements).forEach(el => el.addEventListener('click', checkout));

  const faq = document.getElementsByTagName('details');
  Array.from(faq).forEach(el => el.addEventListener('click', e => gtag('event', 'screen_view', {
    screen_name: e.target.innerText,
  })));
} catch (error) {
  // console.log(error);
  gtag('event', 'exception', { description: error.message });
}

