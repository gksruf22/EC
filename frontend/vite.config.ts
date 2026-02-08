import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      // 로컬 개발 환경(npm run dev)에서만 작동하는 프록시 설정입니다.
      // 배포 환경(S3)에서는 작동하지 않으니 주의하세요!
      '/api': {
        target: 'http://3.35.21.122:8080',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, ''),
      },
    },
  },
  build: {
    // 빌드 결과물이 저장될 폴더 이름 (기본값은 dist)
    outDir: 'dist', 
  },
  // 배포 경로 설정. S3 버킷 최상단에 올린다면 '/'가 맞습니다.
  base: '/', 
})