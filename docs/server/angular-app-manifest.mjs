
export default {
  bootstrap: () => import('./main.server.mjs').then(m => m.default),
  inlineCriticalCss: true,
  baseHref: '/Antojitos-SA/',
  locale: undefined,
  routes: [
  {
    "renderMode": 2,
    "preload": [
      "chunk-M6C4FBAL.js",
      "chunk-KXG4QE6D.js",
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
      "chunk-IEONYXBW.js",
      "chunk-4FTKUDWF.js",
      "chunk-KXG4QE6D.js",
      "chunk-HNLB3JIQ.js",
      "chunk-2Y6NNTN3.js"
    ],
    "route": "/Antojitos-SA/checkout"
  },
  {
    "renderMode": 2,
    "preload": [
      "chunk-NJKFYACQ.js",
      "chunk-KXG4QE6D.js"
    ],
    "redirectTo": "/Antojitos-SA/cuenta/perfil",
    "route": "/Antojitos-SA/cuenta"
  },
  {
    "renderMode": 2,
    "preload": [
      "chunk-NJKFYACQ.js",
      "chunk-KXG4QE6D.js"
    ],
    "route": "/Antojitos-SA/cuenta/perfil"
  },
  {
    "renderMode": 2,
    "preload": [
      "chunk-NJKFYACQ.js",
      "chunk-KXG4QE6D.js"
    ],
    "route": "/Antojitos-SA/cuenta/pedidos"
  },
  {
    "renderMode": 2,
    "preload": [
      "chunk-NJKFYACQ.js",
      "chunk-KXG4QE6D.js"
    ],
    "route": "/Antojitos-SA/cuenta/credito"
  },
  {
    "renderMode": 2,
    "preload": [
      "chunk-NJKFYACQ.js",
      "chunk-KXG4QE6D.js"
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
    'index.csr.html': {size: 10273, hash: '2b42afa406454d9dd7cd4239ef859a3f1e2ed531e69685a393d7cffbd2cb1594', text: () => import('./assets-chunks/index_csr_html.mjs').then(m => m.default)},
    'index.server.html': {size: 9776, hash: '4a66872b8e30a6dbbc3fc9214307404cf67c97db6d43b987fde1fac8c91fd36d', text: () => import('./assets-chunks/index_server_html.mjs').then(m => m.default)},
    'auth/recuperar/index.html': {size: 19563, hash: 'bf0e5fdb1f8cb2d129584d88f1eeddccb0c109e3ec86746a15504974d5a57f9b', text: () => import('./assets-chunks/auth_recuperar_index_html.mjs').then(m => m.default)},
    'auth/restablecer/index.html': {size: 19397, hash: '4b51af3ad15976dd67bf65ab587b5e83cb8e8d5d88f49e8faa58aaa4ff1d2259', text: () => import('./assets-chunks/auth_restablecer_index_html.mjs').then(m => m.default)},
    'auth/login/index.html': {size: 19917, hash: '611c9721e5830c4e577b8a0775e6668ce78f000c8b061f336be7aec471bde680', text: () => import('./assets-chunks/auth_login_index_html.mjs').then(m => m.default)},
    'index.html': {size: 46611, hash: '1b7ef7343b02f666866a51d5b35c94842af0a31d3bb865a1725d9419805cead5', text: () => import('./assets-chunks/index_html.mjs').then(m => m.default)},
    'admin/clientes/index.html': {size: 294, hash: 'c5e2c2630042688c6181c3ae13675298957b4222a2d6b0887a9838257d250ab1', text: () => import('./assets-chunks/admin_clientes_index_html.mjs').then(m => m.default)},
    'admin/dashboard/index.html': {size: 294, hash: 'c5e2c2630042688c6181c3ae13675298957b4222a2d6b0887a9838257d250ab1', text: () => import('./assets-chunks/admin_dashboard_index_html.mjs').then(m => m.default)},
    'cuenta/credito/index.html': {size: 381, hash: 'ef6be4c97be60bfe745b8a4db639a0f00de456ae0823cd82179db5bf4d12331d', text: () => import('./assets-chunks/cuenta_credito_index_html.mjs').then(m => m.default)},
    'cuenta/perfil/index.html': {size: 378, hash: 'd0e788b6deae524624e92ec528ee9103fa409cff434d0b5e7c7fdec72563ec7c', text: () => import('./assets-chunks/cuenta_perfil_index_html.mjs').then(m => m.default)},
    'cuenta/direcciones/index.html': {size: 393, hash: '3301f5e4100b0817f6f442fb735a50a15728539f2333f16c7bd7206591925998', text: () => import('./assets-chunks/cuenta_direcciones_index_html.mjs').then(m => m.default)},
    'auth/registro/index.html': {size: 20566, hash: '59ddce6867faed1a93e75055fe59c67aba7cf0c6b536f7bd0bd90da0fc96a011', text: () => import('./assets-chunks/auth_registro_index_html.mjs').then(m => m.default)},
    'auth/verificado/index.html': {size: 18132, hash: '307ec7f7997f26c03ebc343be44489953bd06887ee08229df95c13e9407d1fb4', text: () => import('./assets-chunks/auth_verificado_index_html.mjs').then(m => m.default)},
    'admin/productos/index.html': {size: 294, hash: 'c5e2c2630042688c6181c3ae13675298957b4222a2d6b0887a9838257d250ab1', text: () => import('./assets-chunks/admin_productos_index_html.mjs').then(m => m.default)},
    'checkout/index.html': {size: 294, hash: 'c5e2c2630042688c6181c3ae13675298957b4222a2d6b0887a9838257d250ab1', text: () => import('./assets-chunks/checkout_index_html.mjs').then(m => m.default)},
    'cuenta/pedidos/index.html': {size: 381, hash: 'b5da5f66c913c821f3108d4ef95dea26c4331210c17c7799fc2be83790ffd1eb', text: () => import('./assets-chunks/cuenta_pedidos_index_html.mjs').then(m => m.default)},
    'admin/pedidos/index.html': {size: 294, hash: 'c5e2c2630042688c6181c3ae13675298957b4222a2d6b0887a9838257d250ab1', text: () => import('./assets-chunks/admin_pedidos_index_html.mjs').then(m => m.default)},
    'auth/verificar/index.html': {size: 19185, hash: '74b920a6ecb7ef0c83b9258d0f8737f2290e321fed3a90c52567a94c3efb1b6e', text: () => import('./assets-chunks/auth_verificar_index_html.mjs').then(m => m.default)},
    'styles-PQ5DANE5.css': {size: 2920, hash: '/QQjAnvirmI', text: () => import('./assets-chunks/styles-PQ5DANE5_css.mjs').then(m => m.default)}
  },
};
