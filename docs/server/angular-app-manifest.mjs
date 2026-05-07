
export default {
  bootstrap: () => import('./main.server.mjs').then(m => m.default),
  inlineCriticalCss: true,
  baseHref: '/Antojitos-SA/',
  locale: undefined,
  routes: [
  {
    "renderMode": 2,
    "preload": [
      "chunk-JATT5OIZ.js",
      "chunk-I54WAHVE.js",
      "chunk-JC6PCK5B.js",
      "chunk-ODENAJPC.js"
    ],
    "route": "/Antojitos-SA"
  },
  {
    "renderMode": 2,
    "preload": [
      "chunk-ITBU3KVZ.js"
    ],
    "redirectTo": "/Antojitos-SA/auth/login",
    "route": "/Antojitos-SA/auth"
  },
  {
    "renderMode": 2,
    "preload": [
      "chunk-ITBU3KVZ.js"
    ],
    "route": "/Antojitos-SA/auth/login"
  },
  {
    "renderMode": 2,
    "preload": [
      "chunk-ITBU3KVZ.js"
    ],
    "route": "/Antojitos-SA/auth/registro"
  },
  {
    "renderMode": 2,
    "preload": [
      "chunk-ITBU3KVZ.js"
    ],
    "route": "/Antojitos-SA/auth/verificar"
  },
  {
    "renderMode": 2,
    "preload": [
      "chunk-ITBU3KVZ.js"
    ],
    "route": "/Antojitos-SA/auth/verificado"
  },
  {
    "renderMode": 2,
    "preload": [
      "chunk-ITBU3KVZ.js"
    ],
    "route": "/Antojitos-SA/auth/recuperar"
  },
  {
    "renderMode": 2,
    "preload": [
      "chunk-ITBU3KVZ.js"
    ],
    "route": "/Antojitos-SA/auth/restablecer"
  },
  {
    "renderMode": 2,
    "preload": [
      "chunk-I226JEQD.js",
      "chunk-E3GUSBGO.js",
      "chunk-I54WAHVE.js",
      "chunk-JC6PCK5B.js",
      "chunk-ODENAJPC.js"
    ],
    "route": "/Antojitos-SA/checkout"
  },
  {
    "renderMode": 2,
    "preload": [
      "chunk-COIS6AOS.js",
      "chunk-I54WAHVE.js"
    ],
    "redirectTo": "/Antojitos-SA/cuenta/perfil",
    "route": "/Antojitos-SA/cuenta"
  },
  {
    "renderMode": 2,
    "preload": [
      "chunk-COIS6AOS.js",
      "chunk-I54WAHVE.js"
    ],
    "route": "/Antojitos-SA/cuenta/perfil"
  },
  {
    "renderMode": 2,
    "preload": [
      "chunk-COIS6AOS.js",
      "chunk-I54WAHVE.js"
    ],
    "route": "/Antojitos-SA/cuenta/pedidos"
  },
  {
    "renderMode": 2,
    "preload": [
      "chunk-COIS6AOS.js",
      "chunk-I54WAHVE.js"
    ],
    "route": "/Antojitos-SA/cuenta/credito"
  },
  {
    "renderMode": 2,
    "preload": [
      "chunk-COIS6AOS.js",
      "chunk-I54WAHVE.js"
    ],
    "route": "/Antojitos-SA/cuenta/direcciones"
  },
  {
    "renderMode": 2,
    "preload": [
      "chunk-6QJUAZIK.js"
    ],
    "redirectTo": "/Antojitos-SA/admin/dashboard",
    "route": "/Antojitos-SA/admin"
  },
  {
    "renderMode": 2,
    "preload": [
      "chunk-6QJUAZIK.js"
    ],
    "route": "/Antojitos-SA/admin/dashboard"
  },
  {
    "renderMode": 2,
    "preload": [
      "chunk-6QJUAZIK.js"
    ],
    "route": "/Antojitos-SA/admin/pedidos"
  },
  {
    "renderMode": 2,
    "preload": [
      "chunk-6QJUAZIK.js"
    ],
    "route": "/Antojitos-SA/admin/clientes"
  },
  {
    "renderMode": 2,
    "preload": [
      "chunk-6QJUAZIK.js"
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
    'index.csr.html': {size: 11330, hash: '5289d0d0fa18e2f974547798a0c9f6fd01038e944c405f50c1d1f6bc603dbeca', text: () => import('./assets-chunks/index_csr_html.mjs').then(m => m.default)},
    'index.server.html': {size: 9820, hash: '4bce83043bc1032eb1a53e48f65ff0a175dc314b8758673aeb956f90df3ede67', text: () => import('./assets-chunks/index_server_html.mjs').then(m => m.default)},
    'auth/login/index.html': {size: 21103, hash: '3b83266173ffad5283457b2cf838fbf42ae18014ed21983eb1f572df811b4927', text: () => import('./assets-chunks/auth_login_index_html.mjs').then(m => m.default)},
    'auth/recuperar/index.html': {size: 20749, hash: '4ca5b3de2124f387fd7424e870d0abb6f1092c778f6bbd9b1ac29f72679c388e', text: () => import('./assets-chunks/auth_recuperar_index_html.mjs').then(m => m.default)},
    'auth/restablecer/index.html': {size: 20583, hash: 'dbaa179308e21f36d0c92e5f19b28fffc3f2d8ce5bb8e48a59c777d8df7f4b0a', text: () => import('./assets-chunks/auth_restablecer_index_html.mjs').then(m => m.default)},
    'cuenta/credito/index.html': {size: 381, hash: 'ef6be4c97be60bfe745b8a4db639a0f00de456ae0823cd82179db5bf4d12331d', text: () => import('./assets-chunks/cuenta_credito_index_html.mjs').then(m => m.default)},
    'index.html': {size: 53196, hash: 'f3b58af75a0f080d434f1ae97220c26e9a77241ea1f07a16b39078ff1156ddfe', text: () => import('./assets-chunks/index_html.mjs').then(m => m.default)},
    'admin/dashboard/index.html': {size: 294, hash: 'c5e2c2630042688c6181c3ae13675298957b4222a2d6b0887a9838257d250ab1', text: () => import('./assets-chunks/admin_dashboard_index_html.mjs').then(m => m.default)},
    'admin/clientes/index.html': {size: 294, hash: 'c5e2c2630042688c6181c3ae13675298957b4222a2d6b0887a9838257d250ab1', text: () => import('./assets-chunks/admin_clientes_index_html.mjs').then(m => m.default)},
    'cuenta/direcciones/index.html': {size: 393, hash: '3301f5e4100b0817f6f442fb735a50a15728539f2333f16c7bd7206591925998', text: () => import('./assets-chunks/cuenta_direcciones_index_html.mjs').then(m => m.default)},
    'cuenta/perfil/index.html': {size: 378, hash: 'd0e788b6deae524624e92ec528ee9103fa409cff434d0b5e7c7fdec72563ec7c', text: () => import('./assets-chunks/cuenta_perfil_index_html.mjs').then(m => m.default)},
    'auth/verificado/index.html': {size: 19299, hash: '8f86785dcbdf447e4d8def71307797f470145c41d5bd573864bb5e0fe1a9d855', text: () => import('./assets-chunks/auth_verificado_index_html.mjs').then(m => m.default)},
    'auth/registro/index.html': {size: 21746, hash: 'e9516b1a7eae914201700389392715ccfdab5315cc81ee20de748aa66afb6424', text: () => import('./assets-chunks/auth_registro_index_html.mjs').then(m => m.default)},
    'admin/productos/index.html': {size: 294, hash: 'c5e2c2630042688c6181c3ae13675298957b4222a2d6b0887a9838257d250ab1', text: () => import('./assets-chunks/admin_productos_index_html.mjs').then(m => m.default)},
    'checkout/index.html': {size: 294, hash: 'c5e2c2630042688c6181c3ae13675298957b4222a2d6b0887a9838257d250ab1', text: () => import('./assets-chunks/checkout_index_html.mjs').then(m => m.default)},
    'cuenta/pedidos/index.html': {size: 381, hash: 'b5da5f66c913c821f3108d4ef95dea26c4331210c17c7799fc2be83790ffd1eb', text: () => import('./assets-chunks/cuenta_pedidos_index_html.mjs').then(m => m.default)},
    'admin/pedidos/index.html': {size: 294, hash: 'c5e2c2630042688c6181c3ae13675298957b4222a2d6b0887a9838257d250ab1', text: () => import('./assets-chunks/admin_pedidos_index_html.mjs').then(m => m.default)},
    'auth/verificar/index.html': {size: 20350, hash: 'a22dca96fdae9992b74bd71948edf68eebe789b075135c815e778ff6960d407c', text: () => import('./assets-chunks/auth_verificar_index_html.mjs').then(m => m.default)},
    'styles-PELKVX5M.css': {size: 4572, hash: 'hqT2W5ZQPSw', text: () => import('./assets-chunks/styles-PELKVX5M_css.mjs').then(m => m.default)}
  },
};
