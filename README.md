<h1>개인 풀스텍 프로젝트 - Mfuture</h1>

![Desktop - 1 (2)](https://github.com/dareunk/mfuture/assets/83913407/a3aa46a1-630f-4fce-bfbb-ff55190ca234)


<h2> 프로젝트 소개 </h2>
<b>프로젝트명 : Mfuture - 대학생과 직장인들을 대상으로 삶의 길잡이 역할을 해주는 서비스<br><br>
개발 기간: 2023-10-01~2023-11-30<br><br>

프로젝트 개발 이유</b>: 나이가 들수록 삶의 방향은 더 불확실해지는 것 같다. 졸업을 앞둔 시점, 이러한
생각이 많이 들었고, 사회에서 고군분투하고 있는 모든 구성원들이 대단하면서
또 안쓰럽다는 생각을 하게 됐다. 스펙을 쌓기 위해 공부하고, 정보를 얻기 위해
뛰어다니며, 더 나은 자신이 되기 위해 끊임없이 노력하는 사람들에게 작은 도움
이 되고 싶었고, 또 이런 웹 서비스의 필요성을 느끼게 되어 ‘Mfuture’ 프로젝트
를 제작하게 됐다. 불확실한 상황 속에서 더 나은 미래를 위해 끊임없이 노력하
는 지금의 청년들에게 작은 도움을 주는 것이 ‘Mfuture’의 현재 방향성이자 미래
지향가치이다.

  
<b>프로젝트 기능:</b>

  - To-do list 기록
  
  - 대외활동 기록
  - 일기장 작성
  - 맞춤형 취업 정보 확인
  - 직업 키워드 서비스
  - 사용자 간 정보 공유 채팅방
<br>
<br>
<h2>개발 환경</h2>
<h3>Back-end</h3>
<div align=center>
<img src="https://img.shields.io/badge/express-000000?style=for-the-badge&logo=express&logoColor=white">
<img src="https://img.shields.io/badge/node.js-339933?style=for-the-badge&logo=Node.js&logoColor=white">
</div>
<h3>Front-end</h3>
<div align=center> 
<img src="https://img.shields.io/badge/html5-E34F26?style=for-the-badge&logo=html5&logoColor=white"> 
<img src="https://img.shields.io/badge/css-1572B6?style=for-the-badge&logo=css3&logoColor=white"> 
<img src="https://img.shields.io/badge/javascript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black"> 
<img src="https://img.shields.io/badge/jquery-0769AD?style=for-the-badge&logo=jquery&logoColor=white">
<img src="https://img.shields.io/badge/node.js-339933?style=for-the-badge&logo=Node.js&logoColor=white">
</div>
<h3>DB</h3>
<div align=center>
<img src="https://img.shields.io/badge/mysql-4479A1?style=for-the-badge&logo=mysql&logoColor=white">  
</div>
<h3>Dev-Ops</h3>
<div align=center>
<img src="https://img.shields.io/badge/GoogleCloud-%234285F4.svg?style=for-the-badge&logo=google-cloud&logoColor=white">
<img src="https://img.shields.io/badge/github-%23121011.svg?style=for-the-badge&logo=github&logoColor=white">
<img src="https://img.shields.io/badge/jenkins-F95757.svg?style=for-the-badge&logo=jenkins&logoColor=white">
<img src="https://img.shields.io/badge/docker-%230db7ed.svg?style=for-the-badge&logo=docker&logoColor=white">
<img src="https://img.shields.io/badge/kubernetes-%23326ce5.svg?style=for-the-badge&logo=kubernetes&logoColor=white">
</div>

<br>
<br>
<h2> Mfuture 시연 영상</h2>

![오픈소스데모영상_은진](https://github.com/dareunk/mfuture/assets/83913407/838de3a6-9dab-4c94-ba3e-34871e2fbefe)

[Mfuture 서비스 매뉴얼 보러가기](https://innovative-lead-4da.notion.site/Mfuture-97922cdcab724b1a8331aa72da1685ac?pvs=4)

<br>
<br>
<h2>Mfuture 와이어프레임</h2>

![image](https://github.com/dareunk/mfuture/assets/83913407/b6c02445-5a74-4d5c-804b-19827524f5c8)

<br>
<br>
<h2> Mfuture 배포 환경<h2>
  
![Desktop - 9](https://github.com/dareunk/mfuture/assets/83913407/4597683e-16fc-4d8b-a840-eb5f696f32ce)

![Desktop - 8 (1)](https://github.com/dareunk/mfuture/assets/83913407/a91ac5a8-5bb4-463a-9528-7fae3ab9780a)

<br>
<br>
<h2>Mfuture의 Github Workflow</h2>
  
![A4 - 1](https://github.com/dareunk/mfuture/assets/83913407/6bec8b1a-d8fc-446b-b3d3-63b364a551de)


|브랜치명| 작업 내용|
|-------|----------|
|Local| local환경에서 구축한 Mfuture 코드를 업로드|
|develop1| Mfuture pod의 base 이미지를 변경하고, deployment.yaml 파일의 소스코드를 재작성|
|develop2| mysql의 데이터를 영구적으로 저장하기 위해 persistentVolumeClaim을 구축하여 deployment.yaml파일에 추가|
|develop3| Sequelize의 기본 세팅을 변경|
|develop5| Nodeport를 삭제하고 Cluster IP를 설정하여 웹 서비스 파드가 mysql 파드를 인식할 수 있도록 함|
|Hofix#3| deployment.yaml 파일에서 발생한 에러들을 처리하고, 배포 환경에서 구글OAuth2.0 API를 사용할 수 있도록 설정|
|Hotfix#4| main.js에서 존재하는 syntax error을처리(ex. logIn → login), port의 설정을 바꿔줌|
|Hotfix#5| session으로 인해 발생하는 서비스 장애를 처리, sessionAffinity를 추가main 정상적으로 작동하는 코드를 다른branch로부터 pull request를 받아 배포|


<br>
<br>
<h2>Mfuture 주요 API</h2>

![Desktop - 3](https://github.com/dareunk/mfuture/assets/83913407/66afef5c-035a-402d-95d8-e59ac486ac16)

