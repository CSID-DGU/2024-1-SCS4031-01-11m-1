# LLM 기반의 코스메틱 분야 리뷰 데이터 분석 서비스

## 💄 프로젝트 소개
VOC(Voice Of Customer, 고객의 소리)는 기업이 한 제품에 대한 성과를 측정하며 방향성을 설계하는 데 중요한 요소입니다.

그 중 코스메틱 분야의 경우 고객 상담 부서로 접수되는 문의 중 50~60%이상이 제품의 사용 방법이나 성능 등에 대한 문의이기에 고객의 불만 내용과 제품의 성능에 대한 문의 내용에 대한 VOC를 분석하고 정보화하는 과정이 필수적입니다.

그러나 VOC는 비정형 데이터로 분석에 많은 자원과 시간이 투자되며, 스타트업과 같이 상대적으로 규모가 작은 기업은 더더욱 부담되는 현실입니다.

이에 LLM(Large Language Models, 대형 언어 모델)을 적용하여 자동화된 프로세스를 제공한다면 관련된 부담을 덜어 줄 수 있을 것이며, VOC에 민감한 코스메틱 분야에서 실효성을 검증하는 데 있어서 유리한 것이라 봅니다.

따라서 본 프로젝트는 **LLM 기반의 코스메틱 분야 리뷰 데이터 분석 서비스**를 제작하였습니다.
<br>

## 💫 주요 기능
### 1️⃣ Dashboard
- 사용자가 사전에 지정한 카테고리 별 언급 빈도 및 VOC 확인

### 2️⃣ Analytics
- 카테고리 별 VOC의 주요 키워드 도출 및 긍/부정 비율 확인
- 사용자가 사전에 등록한 회의록에서 도출된 키워드가 언급된 방향성 도출

### 3️⃣ Management
- 제품 정보(이미지, 명, 소개, 리뷰데이터URL) 등록
- 기업의 회의록 등록

## 🖥️ 구성 화면
| Dashboard | Analytics |
| :------------: | :------------: |
| ![Dashboard](https://github.com/CSID-DGU/2024-1-SCS4031-01-11m-1/assets/102213719/6e27de76-d1b5-493d-a02b-fca2039020fe) | ![Report](https://github.com/CSID-DGU/2024-1-SCS4031-01-11m-1/assets/102213719/9ba689a2-9bc3-4556-b884-bf69f5d525d2) |  

## 🔧 기술 스택

### LLM
<img src="https://img.shields.io/badge/openai-412991?style=for-the-badge&logo=openai&logoColor=white">

### FE
<img src="https://img.shields.io/badge/react-61DAFB?style=for-the-badge&logo=react&logoColor=black">

### BE
<img src="https://img.shields.io/badge/nestjs-E0234E?style=for-the-badge&logo=nestjs&logoColor=white"><img src="https://img.shields.io/badge/fastapi-009688?style=for-the-badge&logo=fastapi&logoColor=white"><img src="https://img.shields.io/badge/postgresql-4169E1?style=for-the-badge&logo=postgresql&logoColor=white"><img src="https://img.shields.io/badge/nginx-009639?style=for-the-badge&logo=nginx&logoColor=white"><img src="https://img.shields.io/badge/docker-2496ED?style=for-the-badge&logo=docker&logoColor=white"><img src="https://img.shields.io/badge/amazonec2-FF9900?style=for-the-badge&logo=amazonec2&logoColor=white"><img src="https://img.shields.io/badge/githubactions-2088FF?style=for-the-badge&logo=githubactions&logoColor=white">

### 협업 도구
<img src="https://img.shields.io/badge/figma- F24E1E?style=for-the-badge&logo=figma&logoColor=white"><img src="https://img.shields.io/badge/notion-000000?style=for-the-badge&logo=notion&logoColor=white">

## 👥 11m 팀원 정보 
| [김수영](https://github.com/swim-kim) | [김진호](https://github.com/Skyline5555) | [류슬기](https://github.com/seulgigi) | [윤영헌](https://github.com/yoounyoungheon) |
| :-: | :-: | :-: | :-: |
|<img src="https://github.com/swim-kim.png" width="100px;" alt=""/>|<img src="https://github.com/Skyline5555.png" width="100px;" alt=""/>|<img src="https://github.com/seulgigi.png" width="100px;" alt=""/>|<img src="https://github.com/yoounyoungheon.png" width="100px;" alt=""/>|
| FE | BE | LLM | BE |
| 산업시스템공학과<br/>융합소프트웨어연계전공 | 경영학과<br/>융합소프트웨어연계전공 | 산업시스템공학과<br/>융합소프트웨어연계전공 | 경영학과<br/>융합소프트웨어연계전공 |
