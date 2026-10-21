# my-blog

마크다운(.md) 파일을 읽어 블로그 웹사이트로 변환하는 프로젝트입니다.

## 기술 스택 제약

- **프레임워크 사용 금지**: 순수 HTML, CSS, JavaScript(바닐라)만 사용합니다.
- React, Vue, Tailwind, Bootstrap 등 프레임워크/UI 라이브러리를 추가하지 않습니다.
- 빌드 도구(webpack, vite 등) 없이 브라우저에서 바로 동작해야 합니다.
- 마크다운 파싱은 직접 구현하거나, 필요하면 작고 단일 파일인 라이브러리(예: marked)를 `vendor/`에 복사해 사용합니다. 사용 전 사용자에게 확인합니다.
- JavaScript는 ES 모듈(`type="module"`)과 최신 브라우저 표준 API(fetch, CSS 변수, `prefers-color-scheme`)를 사용합니다.

## 동작 방식

1. 글은 `posts/` 폴더의 `.md` 파일로 작성합니다.
2. 각 글 상단에 front matter(제목, 날짜, 태그, 요약)를 둡니다.

   ```md
   ---
   title: 글 제목
   date: 2026-10-21
   tags: [태그1, 태그2]
   summary: 한 줄 요약
   ---
   ```

3. `posts/index.json`에 글 목록(파일명, 메타데이터)을 둡니다. 브라우저는 정적 폴더를 나열할 수 없기 때문입니다.
4. 브라우저에서 `fetch`로 마크다운을 읽어 HTML로 변환해 렌더링합니다.
5. 라우팅은 해시(`#/post/파일명`) 기반으로 하여 서버 설정 없이 동작하게 합니다.
6. `fetch`를 쓰므로 `file://`로는 동작하지 않습니다. 로컬 확인은 `python -m http.server`로 합니다.

## 디렉터리 구조

```
my-blog/
├── index.html        # 단일 진입점
├── css/
│   └── style.css     # 전체 스타일 (CSS 변수로 테마 관리)
├── js/
│   ├── app.js        # 라우팅, 초기화
│   ├── markdown.js   # 마크다운 → HTML 변환
│   └── theme.js      # 다크 모드 토글
├── posts/
│   ├── index.json    # 글 목록
│   └── *.md          # 글 본문
└── CLAUDE.md
```

## 디자인 원칙

- **깔끔하고 읽기 좋게**: 본문 최대 너비 약 680–720px, 줄 간격 1.7 이상, 충분한 여백.
- 본문 글꼴은 시스템 폰트 스택을 사용하고 한글 가독성을 위해 `Pretendard`, `Noto Sans KR`를 우선 지정합니다. 코드는 monospace.
- 한글 줄바꿈은 `word-break: keep-all`, `overflow-wrap: break-word`를 사용합니다.
- 장식은 최소화하고 타이포그래피와 여백으로 위계를 만듭니다.
- 코드 블록, 인용문, 표, 이미지가 깨지지 않고 읽기 좋게 스타일링합니다.

## 다크 모드

- 모든 색상은 `:root`의 CSS 변수로 정의하고, 다크 테마에서 같은 변수를 재정의합니다.
- 기본값은 OS 설정(`prefers-color-scheme`)을 따릅니다.
- 헤더의 토글 버튼으로 수동 전환할 수 있고, 선택은 `localStorage`에 저장합니다(접근 실패 시에도 동작하도록 try/catch).
- `<html data-theme="light|dark">` 속성으로 테마를 제어합니다.
- 첫 화면에서 테마가 깜빡이지 않도록 `<head>`에 작은 인라인 스크립트로 테마를 먼저 적용합니다.
- 텍스트와 배경의 명암비는 WCAG AA(4.5:1) 이상을 유지합니다.

## 모바일 대응

- 모바일 우선(mobile-first)으로 작성하고 `@media (min-width: ...)`로 확장합니다.
- `<meta name="viewport" content="width=device-width, initial-scale=1">` 필수.
- 가로 스크롤이 생기지 않아야 합니다. 긴 코드와 표는 컨테이너 안에서만 스크롤합니다(`overflow-x: auto`).
- 이미지는 `max-width: 100%; height: auto`.
- 터치 대상(버튼, 링크)은 최소 44×44px.
- 360px 폭에서 확인합니다.

## 코딩 규칙

- 들여쓰기는 공백 2칸.
- 시맨틱 태그(`header`, `main`, `article`, `nav`, `footer`)와 접근성 속성(`alt`, `aria-label`, 키보드 포커스 스타일)을 지킵니다.
- 사용자가 작성한 마크다운을 `innerHTML`로 넣을 때 XSS에 주의합니다. 원시 HTML은 이스케이프하거나 허용 목록 방식으로 처리합니다.
- 주석은 "왜"가 불분명할 때만 최소한으로 작성합니다.
- 파일과 폴더 이름은 소문자와 하이픈(kebab-case).

## 로컬 실행

```bash
python -m http.server 8000
```

이후 브라우저에서 `http://localhost:8000`을 엽니다.

## 작업 시 유의사항

- 새 글을 추가하면 `posts/index.json`도 함께 갱신합니다.
- 기능을 추가하기 전에 위의 "프레임워크 없음" 제약을 먼저 확인합니다.
- 스타일 변경은 라이트/다크 두 테마와 모바일/데스크톱 양쪽에서 확인합니다.
