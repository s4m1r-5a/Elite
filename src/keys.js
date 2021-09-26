require('dotenv').config();
module.exports = {
    database: {
        connectionLimit: 1000,
        host: process.env.BD_HOST,
        user: process.env.BD_USER,
        password: process.env.BD_PASSWORD,
        database: process.env.DATABASE,
        port: process.env.BD_PORT
    },
    registro: {
        pin: 'hola'
    },
    dataSet: {},
    Google: {
        "client_id": "564755414021-up2etv2h9crge2g4fcb5hpujg4b8gv81.apps.googleusercontent.com",
        "project_id": "redelite",
        "auth_uri": "https://accounts.google.com/o/oauth2/auth",
        "token_uri": "https://oauth2.googleapis.com/token",
        "auth_provider_x509_cert_url": "https://www.googleapis.com/oauth2/v1/certs",
        "client_secret": "E26Q90P5-_r2BZ89OGAMDrCa",
        "redirect_uris": ["https://grupoelitefincaraiz.com/auth/google/callback", "https://grupoelitefincaraiz.co/auth/google/callback", "https://grupoelitefincaraiz.com.co/auth/google/callback", "http://localhost:5000/auth/google/callback"],
        "javascript_origins": ["https://grupoelitefincaraiz.com", "https://grupoelitefincaraiz.co", "https://grupoelitefincaraiz.com.co", "https://grupoelite.herokuapp.com", "http://localhost:5000"]
    },
    Facebook: {
        client_id: '2450123638566580',
        client_secret: '458cba23923008c134dffcf01ad57e59',
        redirect_uris: [
            "https://redflixx.herokuapp.com/auth/facebook/callback",
            "http://localhost:3000/auth/facebook/callback"
        ]
    },
    Soat: {
        secret_id: 'yO0jB0tD4jI8vP2yD2sR6gI4iA1rF8cV3rK3jQ3gS7hD7aI7tP',
        client_id: '37eb1267-6c33-46b1-a76f-33a553fd812f',
        otro: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.MTI4Mg.RO7HFV11U1YNtFNpPnCcOIaQcHU72f7tPn3HoOCMXOg',
        v: `sT6rX2wH4iL4jJ8qQ8eV6bL5iJ8cM2gS1eL8sY2pY0hL5vX4eM`
    },
    Contactos: {
        client_secret: 'QRAaQqm5PmIA55bw6N2-hpE2',
        client_id: '507038552414-0d2oul1ks021a2ajvh7p2771qmoel9ln.apps.googleusercontent.com',
        redirect_uris: 'http://localhost:5000/contactos'
    }
}; 
/* Configurar Analytics Ads en tu sitio web
Para conectar Google Analytics con tu sitio web, elige el método que corresponda de entre los siguientes:
Opción 1: Añadir un ID de seguimiento a través de tu servicio de alojamiento o plataforma de comercio electrónico
Inicia sesión en tu creador de sitios web, servicio de alojamiento web o plataforma de comercio electrónico y pega tu ID de seguimiento en la sección de analíticas.
    UA - 200453767 - 1

Opción 2: Añadir una etiqueta de seguimiento al código del sitio web
Pega la etiqueta de seguimiento antes de la etiqueta de cierre </head > en cada una de las páginas del sitio web del que quieres hacer un seguimiento.

< !--Global site tag(gtag.js) - Google Analytics-- >
<script async src="https://www.googletagmanager.com/gtag/js?id=UA-200453767-1">
</script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());

  gtag('config', 'UA-200453767-1');
</script> */

//{"payment_method_type":"2","date":"2021.03.04 01:13:42","pse_reference3":"","pse_reference2":"","franchise":"MASTERCARD","commision_pol":"0.00","pse_reference1":"","shipping_city":"","bank_referenced_name":"","sign":"543b4f975ac347b85200b3b3c6f17b5c","extra2":"2056600~0~ABONO~424~0~0~0","extra3":"","operation_date":"2021-03-04 01:13:42","billing_address":"","payment_request_state":"A","extra1":"","administrative_fee":"0.00","administrative_fee_tax":"0.00","bank_id":"11","nickname_buyer":"","payment_method":"11","attempts":"1","transaction_id":"00274ba2-4c24-4f0c-93ef-13d4bc475ad4","transaction_date":"2021-03-04 01:13:42","test":"0","exchange_rate":"1.00","ip":"10.0.0.114","reference_pol":"1400036584","cc_holder":"APPROVED","tax":"0.00","antifraudMerchantId":"","pse_bank":"","state_pol":"4","billing_city":"","phone":"57 3007753983","error_message_bank":"0","shipping_country":"CO","error_code_bank":"00","cus":"664061","customer_number":"","description":"ABONO PRADOS DE PONTEVEDRA Mz 9 Lote: 15","merchant_id":"508029","administrative_fee_base":"0.00","authorization_code":"RBM353","currency":"COP","shipping_address":"","cc_number":"************3917","installments_number":"1","nickname_seller":"","value":"2056600.00","transaction_bank_id":"RBM353","billing_country":"CO","response_code_pol":"1","payment_method_name":"MASTERCARD","office_phone":"","email_buyer":"s4m1r.5a@gmail.com","payment_method_id":"2","response_message_pol":"APPROVED","account_id":"512321","airline_code":"","pseCycle":"","risk":"0.0","reference_sale":"1741-248-4JU","additional_value":"0.00"}

