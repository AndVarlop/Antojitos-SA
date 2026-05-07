
export default {
  bootstrap: () => import('./main.server.mjs').then(m => m.default),
  inlineCriticalCss: true,
  baseHref: '/Antojitos-SA/',
  locale: undefined,
  routes: [
  {
    "renderMode": 2,
    "preload": [
      "chunk-NNJQMTFQ.js",
      "chunk-JRP56Q25.js",
      "chunk-HNLB3JIQ.js",
      "chunk-2Y6NNTN3.js"
    ],
    "route": "/Antojitos-SA"
  },
  {
    "renderMode": 2,
    "preload": [
      "chunk-WKFC7LE7.js"
    ],
    "redirectTo": "/Antojitos-SA/auth/login",
    "route": "/Antojitos-SA/auth"
  },
  {
    "renderMode": 2,
    "preload": [
      "chunk-WKFC7LE7.js"
    ],
    "route": "/Antojitos-SA/auth/login"
  },
  {
    "renderMode": 2,
    "preload": [
      "chunk-WKFC7LE7.js"
    ],
    "route": "/Antojitos-SA/auth/registro"
  },
  {
    "renderMode": 2,
    "preload": [
      "chunk-WKFC7LE7.js"
    ],
    "route": "/Antojitos-SA/auth/verificar"
  },
  {
    "renderMode": 2,
    "preload": [
      "chunk-WKFC7LE7.js"
    ],
    "route": "/Antojitos-SA/auth/verificado"
  },
  {
    "renderMode": 2,
    "preload": [
      "chunk-WKFC7LE7.js"
    ],
    "route": "/Antojitos-SA/auth/recuperar"
  },
  {
    "renderMode": 2,
    "preload": [
      "chunk-WKFC7LE7.js"
    ],
    "route": "/Antojitos-SA/auth/restablecer"
  },
  {
    "renderMode": 2,
    "preload": [
      "chunk-HY3V5N6B.js",
      "chunk-4FTKUDWF.js",
      "chunk-JRP56Q25.js",
      "chunk-HNLB3JIQ.js",
      "chunk-2Y6NNTN3.js"
    ],
    "route": "/Antojitos-SA/checkout"
  },
  {
    "renderMode": 2,
    "preload": [
      "chunk-3XL4GFFN.js",
      "chunk-JRP56Q25.js"
    ],
    "redirectTo": "/Antojitos-SA/cuenta/perfil",
    "route": "/Antojitos-SA/cuenta"
  },
  {
    "renderMode": 2,
    "preload": [
      "chunk-3XL4GFFN.js",
      "chunk-JRP56Q25.js"
    ],
    "route": "/Antojitos-SA/cuenta/perfil"
  },
  {
    "renderMode": 2,
    "preload": [
      "chunk-3XL4GFFN.js",
      "chunk-JRP56Q25.js"
    ],
    "route": "/Antojitos-SA/cuenta/pedidos"
  },
  {
    "renderMode": 2,
    "preload": [
      "chunk-3XL4GFFN.js",
      "chunk-JRP56Q25.js"
    ],
    "route": "/Antojitos-SA/cuenta/credito"
  },
  {
    "renderMode": 2,
    "preload": [
      "chunk-3XL4GFFN.js",
      "chunk-JRP56Q25.js"
    ],
    "route": "/Antojitos-SA/cuenta/direcciones"
  },
  {
    "renderMode": 2,
    "preload": [
      "chunk-AZYSY5MW.js"
    ],
    "redirectTo": "/Antojitos-SA/admin/dashboard",
    "route": "/Antojitos-SA/admin"
  },
  {
    "renderMode": 2,
    "preload": [
      "chunk-AZYSY5MW.js"
    ],
    "route": "/Antojitos-SA/admin/dashboard"
  },
  {
    "renderMode": 2,
    "preload": [
      "chunk-AZYSY5MW.js"
    ],
    "route": "/Antojitos-SA/admin/pedidos"
  },
  {
    "renderMode": 2,
    "preload": [
      "chunk-AZYSY5MW.js"
    ],
    "route": "/Antojitos-SA/admin/clientes"
  },
  {
    "renderMode": 2,
    "preload": [
      "chunk-AZYSY5MW.js"
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
    'index.csr.html': {size: 10271, hash: 'bce05480a30b9d790b26990d4ca822097a558c5b2abb980e197cce23ccffa248', text: () => import('./assets-chunks/index_csr_html.mjs').then(m => m.default)},
    'index.server.html': {size: 9774, hash: 'd0cc0783fad9701cee70c2b7b7f103e31de7d5f5d749bab59e3d07c9fc220373', text: () => import('./assets-chunks/index_server_html.mjs').then(m => m.default)},
    'auth/restablecer/index.html': {size: 19395, hash: 'c693368ffc3d249298febbbf7141501d6bf114c3c81e90108add67da15d60000', text: () => import('./assets-chunks/auth_restablecer_index_html.mjs').then(m => m.default)},
    'index.html': {size: 46477, hash: '85acda19453c0df51975aad6afe55283f6eea3731d5b88e6d4a779f078e05675', text: () => import('./assets-chunks/index_html.mjs').then(m => m.default)},
    'auth/recuperar/index.html': {size: 19561, hash: 'bdb33af7cc084db35a2e2e3ad944702a46fe75fd4ed214bf2bf2c8b24b7065e7', text: () => import('./assets-chunks/auth_recuperar_index_html.mjs').then(m => m.default)},
    'cuenta/credito/index.html': {size: 381, hash: 'ef6be4c97be60bfe745b8a4db639a0f00de456ae0823cd82179db5bf4d12331d', text: () => import('./assets-chunks/cuenta_credito_index_html.mjs').then(m => m.default)},
    'admin/clientes/index.html': {size: 294, hash: 'c5e2c2630042688c6181c3ae13675298957b4222a2d6b0887a9838257d250ab1', text: () => import('./assets-chunks/admin_clientes_index_html.mjs').then(m => m.default)},
    'admin/dashboard/index.html': {size: 294, hash: 'c5e2c2630042688c6181c3ae13675298957b4222a2d6b0887a9838257d250ab1', text: () => import('./assets-chunks/admin_dashboard_index_html.mjs').then(m => m.default)},
    'auth/login/index.html': {size: 19915, hash: 'd14cb61c474ecdf2c31df8d94fa21135e173eab2c93bd861837be26844a1e27a', text: () => import('./assets-chunks/auth_login_index_html.mjs').then(m => m.default)},
    'auth/registro/index.html': {size: 20558, hash: '49547ed164fdcdbd9b9d3cf377b013a6fa40b8d02a9835ac0fe066f7bb87185f', text: () => import('./assets-chunks/auth_registro_index_html.mjs').then(m => m.default)},
    'auth/verificado/index.html': {size: 18130, hash: '2a9fd6501c88514dc958cda50e6e97ac8f9dc1f409545eb700c1c59d65dcf806', text: () => import('./assets-chunks/auth_verificado_index_html.mjs').then(m => m.default)},
    'cuenta/perfil/index.html': {size: 378, hash: 'd0e788b6deae524624e92ec528ee9103fa409cff434d0b5e7c7fdec72563ec7c', text: () => import('./assets-chunks/cuenta_perfil_index_html.mjs').then(m => m.default)},
    'checkout/index.html': {size: 294, hash: 'c5e2c2630042688c6181c3ae13675298957b4222a2d6b0887a9838257d250ab1', text: () => import('./assets-chunks/checkout_index_html.mjs').then(m => m.default)},
    'admin/productos/index.html': {size: 294, hash: 'c5e2c2630042688c6181c3ae13675298957b4222a2d6b0887a9838257d250ab1', text: () => import('./assets-chunks/admin_productos_index_html.mjs').then(m => m.default)},
    'cuenta/direcciones/index.html': {size: 393, hash: '3301f5e4100b0817f6f442fb735a50a15728539f2333f16c7bd7206591925998', text: () => import('./assets-chunks/cuenta_direcciones_index_html.mjs').then(m => m.default)},
    'admin/pedidos/index.html': {size: 294, hash: 'c5e2c2630042688c6181c3ae13675298957b4222a2d6b0887a9838257d250ab1', text: () => import('./assets-chunks/admin_pedidos_index_html.mjs').then(m => m.default)},
    'cuenta/pedidos/index.html': {size: 381, hash: 'b5da5f66c913c821f3108d4ef95dea26c4331210c17c7799fc2be83790ffd1eb', text: () => import('./assets-chunks/cuenta_pedidos_index_html.mjs').then(m => m.default)},
    'auth/verificar/index.html': {size: 19183, hash: '8def8078fafb461174ae5cefb130504a25e643d9239e9112e0b7254fc4486b3e', text: () => import('./assets-chunks/auth_verificar_index_html.mjs').then(m => m.default)},
    'styles-PQ5DANE5.css': {size: 2920, hash: '/QQjAnvirmI', text: () => import('./assets-chunks/styles-PQ5DANE5_css.mjs').then(m => m.default)}
  },
};
