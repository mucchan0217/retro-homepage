// ローカルで動く簡易ゲストブックとカウンター
(function(){
  function $(id){return document.getElementById(id)}

  // 訪問者数（localStorageを使った簡易カウンター）
  var vKey = 'retro_visitors';
  try{
    var visitors = parseInt(localStorage.getItem(vKey)||'0',10) || 0;
    visitors += 1;
    localStorage.setItem(vKey,String(visitors));
    $('visitors').textContent = visitors;
  }catch(e){
    $('visitors').textContent = 'N/A';
  }

  // ゲストブック
  var gKey = 'retro_guestbook_entries';
  function loadEntries(){
    try{
      var raw = localStorage.getItem(gKey) || '[]';
      return JSON.parse(raw);
    }catch(e){return []}
  }
  function saveEntries(arr){
    localStorage.setItem(gKey, JSON.stringify(arr));
  }
  function renderEntries(){
    var out = loadEntries().map(function(e){
      return '<div class="entry">'+
             '<strong>'+escapeHtml(e.name)+'</strong>:'+
             '<div>'+escapeHtml(e.message)+'</div>'+
             '<small>'+escapeHtml(e.time)+'</small>'+
             '<hr>'+
             '</div>';
    }).join('');
    $('entries').innerHTML = out || '<em>まだ誰も書き込んでいません。</em>';
  }
  function escapeHtml(s){
    return String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
  }

  renderEntries();

  $('guestForm').addEventListener('submit', function(ev){
    ev.preventDefault();
    var name = $('name').value.trim() || '名無し';
    var message = $('message').value.trim();
    if(!message) return;
    var arr = loadEntries();
    arr.unshift({name:name,message:message,time:new Date().toLocaleString()});
    saveEntries(arr);
    $('name').value=''; $('message').value='';
    renderEntries();
  });
  $('clearBtn').addEventListener('click', function(){
    if(confirm('ゲストブックを消しますか？')){
      localStorage.removeItem(gKey);
      renderEntries();
    }
  });

  // 簡易BBS
  var bKey = 'retro_bbs';
  function loadBbs(){
    try{return JSON.parse(localStorage.getItem(bKey)||'[]')}catch(e){return []}
  }
  function saveBbs(a){localStorage.setItem(bKey,JSON.stringify(a))}
  function renderBbs(){
    var arr = loadBbs();
    $('bbsLog').textContent = arr.slice(-20).map(function(item){
      return '['+item.time+'] '+item.text;
    }).join('\n\n') || '(ログなし)';
  }
  $('bbsPost').addEventListener('click', function(){
    var t = $('bbsInput').value.trim();
    if(!t) return;
    var arr = loadBbs();
    arr.push({text:t,time:new Date().toLocaleTimeString()});
    saveBbs(arr);
    $('bbsInput').value='';
    renderBbs();
  });
  renderBbs();
})();
