📋 구현 내용:
백엔드 변경사항:
✅ MemberController.java - GET /api/members/me API 추가
✅ MemberService.java - findByEmail 메서드 추가
프론트엔드 변경사항:
✅ AuthContext.tsx - 인증 상태 관리

로그인 상태 유지 (localStorage 토큰 확인)
사용자 정보 자동 로드
로그아웃 기능
✅ Header.tsx - 동적 메뉴 표시

비로그인: 회원가입 | 로그인
로그인: {사용자명}님 (클릭 시 마이페이지)
✅ MyPage.tsx - 개인 페이지

사용자 정보 표시
로그아웃 버튼
✅ Login.tsx - AuthContext 연동

✅ App.tsx - AuthProvider 및 라우트 추가

🔄 작동 방식:
페이지 새로고침 시:

localStorage의 토큰 확인
토큰이 있으면 /api/members/me 호출
사용자 정보 자동 로드 → 로그인 유지!
로그인 시:

JWT 토큰 저장
사용자 정보 즉시 로드
헤더에 {이름}님 표시
로그아웃 시:

localStorage 토큰 삭제
사용자 정보 초기화
헤더에 회원가입 | 로그인 표시