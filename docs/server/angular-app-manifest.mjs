
export default {
  bootstrap: () => import('./main.server.mjs').then(m => m.default),
  inlineCriticalCss: true,
  baseHref: '/Antojitos-SA/',
  locale: undefined,
  routes: [
  {
    "renderMode": 2,
    "preload": [
      "chunk-AIKUGPQ4.js",
      "chunk-3NUPTB5Q.js",
      "chunk-SXPOTS3L.js",
      "chunk-7LIEXEHH.js"
    ],
    "route": "/Antojitos-SA"
  },
  {
    "renderMode": 2,
    "preload": [
      "chunk-VBWT3HVT.js"
    ],
    "redirectTo": "/Antojitos-SA/auth/login",
    "route": "/Antojitos-SA/auth"
  },
  {
    "renderMode": 2,
    "preload": [
      "chunk-VBWT3HVT.js"
    ],
    "route": "/Antojitos-SA/auth/login"
  },
  {
    "renderMode": 2,
    "preload": [
      "chunk-VBWT3HVT.js"
    ],
    "route": "/Antojitos-SA/auth/registro"
  },
  {
    "renderMode": 2,
    "preload": [
      "chunk-VBWT3HVT.js"
    ],
    "route": "/Antojitos-SA/auth/verificar"
  },
  {
    "renderMode": 2,
    "preload": [
      "chunk-VBWT3HVT.js"
    ],
    "route": "/Antojitos-SA/auth/verificado"
  },
  {
    "renderMode": 2,
    "preload": [
      "chunk-VBWT3HVT.js"
    ],
    "route": "/Antojitos-SA/auth/recuperar"
  },
  {
    "renderMode": 2,
    "preload": [
      "chunk-VBWT3HVT.js"
    ],
    "route": "/Antojitos-SA/auth/restablecer"
  },
  {
    "renderMode": 2,
    "preload": [
      "chunk-3FXUQWU6.js",
      "chunk-3BFBXON7.js",
      "chunk-3NUPTB5Q.js",
      "chunk-SXPOTS3L.js",
      "chunk-7LIEXEHH.js"
    ],
    "route": "/Antojitos-SA/checkout"
  },
  {
    "renderMode": 2,
    "preload": [
      "chunk-KOO4FI2X.js",
      "chunk-3NUPTB5Q.js"
    ],
    "redirectTo": "/Antojitos-SA/cuenta/perfil",
    "route": "/Antojitos-SA/cuenta"
  },
  {
    "renderMode": 2,
    "preload": [
      "chunk-KOO4FI2X.js",
      "chunk-3NUPTB5Q.js"
    ],
    "route": "/Antojitos-SA/cuenta/perfil"
  },
  {
    "renderMode": 2,
    "preload": [
      "chunk-KOO4FI2X.js",
      "chunk-3NUPTB5Q.js"
    ],
    "route": "/Antojitos-SA/cuenta/pedidos"
  },
  {
    "renderMode": 2,
    "preload": [
      "chunk-KOO4FI2X.js",
      "chunk-3NUPTB5Q.js"
    ],
    "route": "/Antojitos-SA/cuenta/credito"
  },
  {
    "renderMode": 2,
    "preload": [
      "chunk-KOO4FI2X.js",
      "chunk-3NUPTB5Q.js"
    ],
    "route": "/Antojitos-SA/cuenta/direcciones"
  },
  {
    "renderMode": 2,
    "preload": [
      "chunk-MCJ2NWAQ.js"
    ],
    "redirectTo": "/Antojitos-SA/admin/dashboard",
    "route": "/Antojitos-SA/admin"
  },
  {
    "renderMode": 2,
    "preload": [
      "chunk-MCJ2NWAQ.js"
    ],
    "route": "/Antojitos-SA/admin/dashboard"
  },
  {
    "renderMode": 2,
    "preload": [
      "chunk-MCJ2NWAQ.js"
    ],
    "route": "/Antojitos-SA/admin/pedidos"
  },
  {
    "renderMode": 2,
    "preload": [
      "chunk-MCJ2NWAQ.js"
    ],
    "route": "/Antojitos-SA/admin/clientes"
  },
  {
    "renderMode": 2,
    "preload": [
      "chunk-MCJ2NWAQ.js"
    ],
    "route": "/Antojitos-SA/admin/productos"
  },
  {
    "renderMode": 2,
    "redirectTo": "/Antojitos-SA",
    "route": "/Antojitos-SA/**"
  }
],
  entryPointToBrowserMapping: undefined,
  assets: {
    'index.csr.html': {size: 10273, hash: '3c4faf4c550bcedddde9c325870d0e6099de4dbc262926a9ada82f27eae556ef', text: () => import('./assets-chunks/index_csr_html.mjs').then(m => m.default)},
    'index.server.html': {size: 9776, hash: '6bd82108cd990b4e2eba33946e6017bb2c14fefd1e7cf9c78d70c538998f801c', text: () => import('./assets-chunks/index_server_html.mjs').then(m => m.default)},
    'auth/restablecer/index.html': {size: 19397, hash: '07345df7a5426644889603f00a669db25ad814e067fc4c43ab7080546ce5502e', text: () => import('./assets-chunks/auth_restablecer_index_html.mjs').then(m => m.default)},
    'auth/recuperar/index.html': {size: 19563, hash: '689216734d93e11fce8387a674b548794746ff0bf8590fda4d9e6b15d9ec2c86', text: () => import('./assets-chunks/auth_recuperar_index_html.mjs').then(m => m.default)},
    'index.html': {size: 32722, hash: '6698f35f4b8ec86f8f3c200eb425806546b8f83d1c81b8a1a819f253bdbb9703', text: () => import('./assets-chunks/index_html.mjs').then(m => m.default)},
    'cuenta/credito/index.html': {size: 381, hash: 'ef6be4c97be60bfe745b8a4db639a0f00de456ae0823cd82179db5bf4d12331d', text: () => import('./assets-chunks/cuenta_credito_index_html.mjs').then(m => m.default)},
    'admin/dashboard/index.html': {size: 294, hash: 'c5e2c2630042688c6181c3ae13675298957b4222a2d6b0887a9838257d250ab1', text: () => import('./assets-chunks/admin_dashboard_index_html.mjs').then(m => m.default)},
    'auth/login/index.html': {size: 19917, hash: '0d49597046adfb8b12a7382ebc659b55bc56dc63173b0ff618fcb2fb60c43246', text: () => import('./assets-chunks/auth_login_index_html.mjs').then(m => m.default)},
    'admin/clientes/index.html': {size: 294, hash: 'c5e2c2630042688c6181c3ae13675298957b4222a2d6b0887a9838257d250ab1', text: () => import('./assets-chunks/admin_clientes_index_html.mjs').then(m => m.default)},
    'auth/verificado/index.html': {size: 18132, hash: 'bfbf0bece61b06e19c4aa27aff3063f020418f0c954409fb6e053012b8f0a41a', text: () => import('./assets-chunks/auth_verificado_index_html.mjs').then(m => m.default)},
    'auth/registro/index.html': {size: 20560, hash: '9adec2072a6a05cb12021074532583f420e7a17017e6067d1bb800483cf5b5e5', text: () => import('./assets-chunks/auth_registro_index_html.mjs').then(m => m.default)},
    'cuenta/direcciones/index.html': {size: 393, hash: '3301f5e4100b0817f6f442fb735a50a15728539f2333f16c7bd7206591925998', text: () => import('./assets-chunks/cuenta_direcciones_index_html.mjs').then(m => m.default)},
    'admin/productos/index.html': {size: 294, hash: 'c5e2c2630042688c6181c3ae13675298957b4222a2d6b0887a9838257d250ab1', text: () => import('./assets-chunks/admin_productos_index_html.mjs').then(m => m.default)},
    'checkout/index.html': {size: 294, hash: 'c5e2c2630042688c6181c3ae13675298957b4222a2d6b0887a9838257d250ab1', text: () => import('./assets-chunks/checkout_index_html.mjs').then(m => m.default)},
    'cuenta/perfil/index.html': {size: 378, hash: 'd0e788b6deae524624e92ec528ee9103fa409cff434d0b5e7c7fdec72563ec7c', text: () => import('./assets-chunks/cuenta_perfil_index_html.mjs').then(m => m.default)},
    'admin/pedidos/index.html': {size: 294, hash: 'c5e2c2630042688c6181c3ae13675298957b4222a2d6b0887a9838257d250ab1', text: () => import('./assets-chunks/admin_pedidos_index_html.mjs').then(m => m.default)},
    'cuenta/pedidos/index.html': {size: 381, hash: 'b5da5f66c913c821f3108d4ef95dea26c4331210c17c7799fc2be83790ffd1eb', text: () => import('./assets-chunks/cuenta_pedidos_index_html.mjs').then(m => m.default)},
    'auth/verificar/index.html': {size: 19185, hash: '812cbe24e52659aa1107535465bb653dadba8642fedf9622d560146ddbe309ef', text: () => import('./assets-chunks/auth_verificar_index_html.mjs').then(m => m.default)},
    'styles-PQ5DANE5.css': {size: 2920, hash: '/QQjAnvirmI', text: () => import('./assets-chunks/styles-PQ5DANE5_css.mjs').then(m => m.default)}
  },
};
