'use strict';
const MANIFEST = 'flutter-app-manifest';
const TEMP = 'flutter-temp-cache';
const CACHE_NAME = 'flutter-app-cache';

const RESOURCES = {"version.json": "de4a2d5c55b450d563e0025ee3370982",
"index.html": "4fabaa4c5da832d956810039e7644da8",
"/": "4fabaa4c5da832d956810039e7644da8",
"main.dart.js": "bf106c3a8326e12cee0f5abb5f0e4912",
"flutter.js": "6fef97aeca90b426343ba6c5c9dc5d4a",
"favicon.png": "5dcef449791fa27946b3d35ad8803796",
"icons/Icon-192.png": "ac9a721a12bbc803b44f645561ecb1e1",
"icons/Icon-512.png": "96e752610906ba2a93c65f8abe1645f1",
"manifest.json": "4e07e95845579f6f68553fb7835e88d5",
"assets/AssetManifest.json": "ae5625cedadbd9e216fc8660d845eaf7",
"assets/NOTICES": "22beb1e48a964c55ebdd9cafe01718e4",
"assets/FontManifest.json": "c473e6fae7edf702048be034ec04d8f1",
"assets/packages/material_design_icons_flutter/lib/fonts/materialdesignicons-webfont.ttf": "3759b2f7a51e83c64a58cfe07b96a8ee",
"assets/packages/cupertino_icons/assets/CupertinoIcons.ttf": "57d849d738900cfd590e9adc7e208250",
"assets/packages/mixpanel_flutter/assets/mixpanel.js": "5c717055b6683529243c292ab78aa797",
"assets/shaders/ink_sparkle.frag": "f8b80e740d33eb157090be4e995febdf",
"assets/AssetManifest.bin": "805ee14a4702ef1b83e4a535b61c589c",
"assets/fonts/MaterialIcons-Regular.otf": "bb7b73635897551baf9dae10e7efb8a7",
"assets/assets/images/app_icon.png": "9731fd503647f8c862b6065bbee50e90",
"assets/assets/html/end_user_agreement.html": "280b4a4df1c1fdcb72124f06b20f1c6f",
"assets/assets/svgs/pill.svg": "1f51d3bce17d01327e94d3d1fba947a5",
"assets/assets/svgs/logo.svg": "f0261f537a0af837fefa39012d1e353a",
"assets/assets/svgs/no_medication.svg": "78acc8c3bea364ea165b82831c044816",
"assets/assets/icons/impact_emojis/sad.svg": "9ac620d842b4056cf599715a043ad41f",
"assets/assets/icons/impact_emojis/good.svg": "21d7461e4c32aa6a5561d0244bf11968",
"assets/assets/icons/impact_emojis/bad.svg": "e994c69f95200747ff77de2cdb3e2b1a",
"assets/assets/icons/impact_emojis/headache.svg": "5118613e607d00a1f7f75d2f203ec282",
"assets/assets/icons/impact_emojis/sick.svg": "b8670312de7702fdd321dcede8ca901b",
"assets/assets/icons/impact_emojis/tired.svg": "90f6b0c71de842424d4ebe1883d99d45",
"assets/assets/icons/clock-icon.png": "6975b6f342742a5e9bab9a2954cf5852",
"assets/assets/icons/icon-usa.png": "2994ea3fa518bdbc1985d06727943d07",
"assets/assets/icons/pillbox-icon.png": "d0135b3b87c4b3f6b789d4330da382d8",
"assets/assets/fonts/sf_pro_display_ultra_light_italic.otf": "fa570fc4ded697c72608eae4e3675959",
"assets/assets/fonts/sf_pro_display_light_italic.otf": "bee8986f3bf3e269e81e7b64996e423c",
"assets/assets/fonts/sf_pro_display_regular.otf": "aaeac71d99a345145a126a8c9dd2615f",
"assets/assets/fonts/sf_pro_display_semi_bold_italic.otf": "fce0a93d0980a16d75a2f71173c80838",
"assets/assets/fonts/sf_pro_display_thin_italic.otf": "9d5ed420ac3a432eb716c670ce00b662",
"assets/assets/fonts/sf_pro_display_heavy_italic.otf": "d70a8b7adbe065dd69b16459ffab4231",
"assets/assets/fonts/sf_pro_display_black_italic.otf": "647ad7b734271f858d61a94283fd0502",
"assets/assets/fonts/sf_pro_display_bold.otf": "644563f48ab5fe8e9082b64b2729b068",
"assets/assets/fonts/sf_pro_display_medium.otf": "51fd7406327f2b1dbc8e708e6a9da9a5",
"canvaskit/skwasm.js": "1df4d741f441fa1a4d10530ced463ef8",
"canvaskit/skwasm.wasm": "6711032e17bf49924b2b001cef0d3ea3",
"canvaskit/chromium/canvaskit.js": "8c8392ce4a4364cbb240aa09b5652e05",
"canvaskit/chromium/canvaskit.wasm": "fc18c3010856029414b70cae1afc5cd9",
"canvaskit/canvaskit.js": "76f7d822f42397160c5dfc69cbc9b2de",
"canvaskit/canvaskit.wasm": "f48eaf57cada79163ec6dec7929486ea",
"canvaskit/skwasm.worker.js": "19659053a277272607529ef87acf9d8a"};
// The application shell files that are downloaded before a service worker can
// start.
const CORE = ["main.dart.js",
"index.html",
"assets/AssetManifest.json",
"assets/FontManifest.json"];

// During install, the TEMP cache is populated with the application shell files.
self.addEventListener("install", (event) => {
  self.skipWaiting();
  return event.waitUntil(
    caches.open(TEMP).then((cache) => {
      return cache.addAll(
        CORE.map((value) => new Request(value, {'cache': 'reload'})));
    })
  );
});
// During activate, the cache is populated with the temp files downloaded in
// install. If this service worker is upgrading from one with a saved
// MANIFEST, then use this to retain unchanged resource files.
self.addEventListener("activate", function(event) {
  return event.waitUntil(async function() {
    try {
      var contentCache = await caches.open(CACHE_NAME);
      var tempCache = await caches.open(TEMP);
      var manifestCache = await caches.open(MANIFEST);
      var manifest = await manifestCache.match('manifest');
      // When there is no prior manifest, clear the entire cache.
      if (!manifest) {
        await caches.delete(CACHE_NAME);
        contentCache = await caches.open(CACHE_NAME);
        for (var request of await tempCache.keys()) {
          var response = await tempCache.match(request);
          await contentCache.put(request, response);
        }
        await caches.delete(TEMP);
        // Save the manifest to make future upgrades efficient.
        await manifestCache.put('manifest', new Response(JSON.stringify(RESOURCES)));
        // Claim client to enable caching on first launch
        self.clients.claim();
        return;
      }
      var oldManifest = await manifest.json();
      var origin = self.location.origin;
      for (var request of await contentCache.keys()) {
        var key = request.url.substring(origin.length + 1);
        if (key == "") {
          key = "/";
        }
        // If a resource from the old manifest is not in the new cache, or if
        // the MD5 sum has changed, delete it. Otherwise the resource is left
        // in the cache and can be reused by the new service worker.
        if (!RESOURCES[key] || RESOURCES[key] != oldManifest[key]) {
          await contentCache.delete(request);
        }
      }
      // Populate the cache with the app shell TEMP files, potentially overwriting
      // cache files preserved above.
      for (var request of await tempCache.keys()) {
        var response = await tempCache.match(request);
        await contentCache.put(request, response);
      }
      await caches.delete(TEMP);
      // Save the manifest to make future upgrades efficient.
      await manifestCache.put('manifest', new Response(JSON.stringify(RESOURCES)));
      // Claim client to enable caching on first launch
      self.clients.claim();
      return;
    } catch (err) {
      // On an unhandled exception the state of the cache cannot be guaranteed.
      console.error('Failed to upgrade service worker: ' + err);
      await caches.delete(CACHE_NAME);
      await caches.delete(TEMP);
      await caches.delete(MANIFEST);
    }
  }());
});
// The fetch handler redirects requests for RESOURCE files to the service
// worker cache.
self.addEventListener("fetch", (event) => {
  if (event.request.method !== 'GET') {
    return;
  }
  var origin = self.location.origin;
  var key = event.request.url.substring(origin.length + 1);
  // Redirect URLs to the index.html
  if (key.indexOf('?v=') != -1) {
    key = key.split('?v=')[0];
  }
  if (event.request.url == origin || event.request.url.startsWith(origin + '/#') || key == '') {
    key = '/';
  }
  // If the URL is not the RESOURCE list then return to signal that the
  // browser should take over.
  if (!RESOURCES[key]) {
    return;
  }
  // If the URL is the index.html, perform an online-first request.
  if (key == '/') {
    return onlineFirst(event);
  }
  event.respondWith(caches.open(CACHE_NAME)
    .then((cache) =>  {
      return cache.match(event.request).then((response) => {
        // Either respond with the cached resource, or perform a fetch and
        // lazily populate the cache only if the resource was successfully fetched.
        return response || fetch(event.request).then((response) => {
          if (response && Boolean(response.ok)) {
            cache.put(event.request, response.clone());
          }
          return response;
        });
      })
    })
  );
});
self.addEventListener('message', (event) => {
  // SkipWaiting can be used to immediately activate a waiting service worker.
  // This will also require a page refresh triggered by the main worker.
  if (event.data === 'skipWaiting') {
    self.skipWaiting();
    return;
  }
  if (event.data === 'downloadOffline') {
    downloadOffline();
    return;
  }
});
// Download offline will check the RESOURCES for all files not in the cache
// and populate them.
async function downloadOffline() {
  var resources = [];
  var contentCache = await caches.open(CACHE_NAME);
  var currentContent = {};
  for (var request of await contentCache.keys()) {
    var key = request.url.substring(origin.length + 1);
    if (key == "") {
      key = "/";
    }
    currentContent[key] = true;
  }
  for (var resourceKey of Object.keys(RESOURCES)) {
    if (!currentContent[resourceKey]) {
      resources.push(resourceKey);
    }
  }
  return contentCache.addAll(resources);
}
// Attempt to download the resource online before falling back to
// the offline cache.
function onlineFirst(event) {
  return event.respondWith(
    fetch(event.request).then((response) => {
      return caches.open(CACHE_NAME).then((cache) => {
        cache.put(event.request, response.clone());
        return response;
      });
    }).catch((error) => {
      return caches.open(CACHE_NAME).then((cache) => {
        return cache.match(event.request).then((response) => {
          if (response != null) {
            return response;
          }
          throw error;
        });
      });
    })
  );
}
