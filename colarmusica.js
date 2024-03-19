function scriptAction(obj) {
    LimpaAbaMusicas(); // elimine esta linha se você não quiser que limpe a aba músicas, ou seja só quer adicionar novas.
    LimpaMusicasAbaMidia('Louvor'); // elimine esta linha se você não quiser que limpe a o item Louvor da sua lista Mídia, ou seja só quer adicionar novas.
    var clipboard = jslib.getClipboard();
    var arr = clipboard.split('\n');
    var musica;
    var posicao=getTitleMediaIndex('Louvor'); // Elimine esta linha caso queira apenas adicionar as músias ao final do Mídia.
    for (var k in arr) {
         var text = arr[k];
         var obj = jslib.holyrics({ request: 'SearchSong', text: text});
         musica = [(obj.data.length > 0) ? obj.data[0].id : 0];
      
            if (musica[0] == 0) {
             Log('','Música não encontrada: ' + text); 
         }
         else if (k<4) { // eu coloco somente as 4 primeiras músicas na minha lista de mídias, as demais vão só para o Músicas
               posicao++; 
               jslib.holyrics({  //este bloco envia para a lista de midias
                    request: 'AddSongsToPlaylist', 
                    ids: musica,
                    media_playlist: true, // true aqui manda para a lista MIDIA
                    index : posicao  // Elimine esta linha caso queira apenas adicionar as músias ao final do Mídia.
                    });
         }
       
          jslib.holyrics({   // este bloco envia para a lista de músicas
                 request: 'AddSongsToPlaylist', 
                 ids: musica,
                 media_playlist: false // False aqui manda para a lista MUSICAS
                 });
    }
  }

  function Log(chave,conteudo) {
    if (chave == '') {jslib.log(conteudo);}
    if (jslib.getGlobal(chave)) {jslib.log(conteudo);}
    return conteudo;
    }
    
    function LimpaAbaMusicas(){
      var lst = jslib.holyrics('GetSongPlaylist');
      var indexes = [];
    
      for (var j = 0 ; j < lst.data.length; j++) {
        indexes.push(j); 
       }
       
        jslib.holyrics({
            request: 'RemoveFromSongPlaylist',
            indexes: indexes
            });
    }
    
    function LimpaMusicasAbaMidia(title) {
      var obj = jslib.holyrics('GetMediaPlaylist');
      var indexes = [];
      var ini = getTitleMediaIndex(title, obj.data);
    
      if (ini < 0) {
        return;
      }
      for (var j = ini + 1; j < obj.data.length; j++) {
        if (obj.data[j].type == 'title') {
          break;
        }
      if (obj.data[j].type == 'song') { 
        indexes.push(j); 
        }
      }
      if (indexes.length == 0) {
          return;
      }
      jslib.holyrics({
          request: 'RemoveFromMediaPlaylist',
          indexes: indexes
      });
    }
    
    function getTitleMediaIndex(title, items) {
     if (items == null) {
        items = jslib.holyrics('GetMediaPlaylist').data;
      }
    
      for (var i = 0; i < items.length; i++) {
        if (items[i].type == 'title' && items[i].name == title) {
          return i;
        }
      }
      return -1;
    }
    