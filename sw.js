/* ========== 서비스 워커: 오프라인 동작 담당 ==========
   브라우저 뒤에서 조용히 도는 작은 프로그램입니다.
   앱 파일을 미리 저장(캐시)해두고, 인터넷이 끊겨도 그 파일로 화면을 띄웁니다.
   코드를 수정했는데 화면이 안 바뀌면 아래 CACHE_NAME의 v1 → v2로 올리세요.
*/

const CACHE_NAME = 'work-log-v2';

// 미리 저장해둘 파일 목록
const FILES = [
  './',
  './index.html',
  './manifest.json',
  './icon-192.png',
  './icon-512.png'
];

// 1) 설치 시: 파일들을 캐시에 저장
self.addEventListener('install', (e) => {
  e.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(FILES))
  );
  self.skipWaiting();   // 새 버전을 즉시 적용
});

// 2) 활성화 시: 옛날 버전 캐시 삭제
self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((k) => k !== CACHE_NAME).map((k) => caches.delete(k)))
    )
  );
  self.clients.claim();
});

// 3) 파일 요청 시: 캐시에 있으면 캐시에서, 없으면 인터넷에서
self.addEventListener('fetch', (e) => {
  // 구글 시트로 보내는 데이터 전송(POST)은 캐시하지 않고 그대로 통과
  if (e.request.method !== 'GET') return;

  e.respondWith(
    caches.match(e.request).then((cached) => cached || fetch(e.request))
  );
});
