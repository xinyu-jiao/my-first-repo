(function () {
  const firebaseConfig = {
    apiKey: "AIzaSyCkUR6e8ZMEd-fz467V1l3hxJCzkpiSCoo",
    authDomain: "cdw-poll-demo.firebaseapp.com",
    databaseURL: "https://cdw-poll-demo-default-rtdb.firebaseio.com",
    projectId: "cdw-poll-demo",
    storageBucket: "cdw-poll-demo.appspot.com",
    messagingSenderId: "419514616742",
    appId: "1:419514616742:web:4ffd9277c8b57f3d6cdd67"
  };

  firebase.initializeApp(firebaseConfig);
  const db      = firebase.database();
  const pollRef = db.ref('pollA4163');

  const yesBtn = document.getElementById('vote-yes');
  const noBtn  = document.getElementById('vote-no');
  const yesCnt = document.getElementById('yes-count');
  const noCnt  = document.getElementById('no-count');
  const total  = document.getElementById('total-count');
  const status = document.getElementById('connection-status');

  pollRef.on('value', snap => {
    const data = snap.val() || { yes: 0, no: 0 };
    yesCnt.textContent = data.yes;
    noCnt.textContent  = data.no;
    total.textContent  = data.yes + data.no;
    [yesCnt, noCnt, total].forEach(el => {
      el.classList.add('updated');
      setTimeout(() => el.classList.remove('updated'), 300);
    });
  });

  function vote(choice) {
    pollRef.transaction(cur => {
      cur = cur || { yes: 0, no: 0 };
      cur[choice] = (cur[choice] || 0) + 1;
      return cur;
    });
  }
  yesBtn.addEventListener('click', () => vote('yes'));
  noBtn .addEventListener('click', () => vote('no'));

  db.ref('.info/connected').on('value', s => {
    status.textContent = s.val()
      ? 'Connected to Firebase'
      : 'Disconnected';
  });

})();
