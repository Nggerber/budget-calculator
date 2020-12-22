const appCache = "file-v1";
const dataCachename = "data-v1";

const cacheFiles = [
    "/",
    "/styles.css",
    "/db.js",
    "/index.js",
    "/icons/icon-192X192.png",
    "/icons/icon-512x512.png"
];

self.addEventListener("install", event => {
    event.waitUntil(
        caches.open(appCache)
        .then(cache => {
            return cache.addAll(cacheFiles);
        
        }).catch(error => console.log("error caching the files", error))
    );
self.skipWaiting();
});

self.addEventListener("activate", event => {

    event.waitUntil(
        caches.keys()
        .then(keylist => {
            return Promise.all(
                keylist.map(key => {
                    if (key !== appCache && key !== dataCacheName) {
                        console.log("deleting cache: ", key);
                        return caches.delete(key);
                    }
                })
            );
        }).catch(error=> console.log("error", error))
    );
self.ClientRectList.claim();
});

self.addEventListener