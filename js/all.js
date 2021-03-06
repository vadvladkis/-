   var iKey={value:''}

        function genGUID(){
            q=Math.round(Math.random()*4294967295)
            s=q.toString(16)
            for (var i = s.length; i < 8; i++) {s='0'+s;}
            res=s
            
            q=Math.round(Math.random()*65535)
            s=q.toString(16)
            for (var i = s.length; i < 4; i++) {s='0'+s;}
            res=res+'-'+s
            
            q=Math.round(Math.random()*65535)
            s=q.toString(16)
            for (var i = s.length; i < 4; i++) {s='0'+s;}
            res=res+'-'+s
            
            q=Math.round(Math.random()*65535)
            s=q.toString(16)
            for (var i = s.length; i < 4; i++) {s='0'+s;}
            res=res+'-'+s
            
            q=Math.round(Math.random()*65535)
            s=q.toString(16)
            for (var i = s.length; i < 4; i++) {s='0'+s;}
            res=res+'-'+s
            
            q=Math.round(Math.random()*4294967295)
            s=q.toString(16)
            for (var i = s.length; i < 8; i++) {s='0'+s;}
            res=res+s
            return res
        }
        
       // console.log(genGUID())
        
        let historyDB, allHistoryEvents=false, visibleHistoryEvents={}
        
        
        function refreshEvents(){
            iKey.value=''
            iName.value=''
            iDiscription.value=''
            
            if(visibleHistoryEvents.leftDate){
                iBeginDate.value=visibleHistoryEvents.leftDate.toJSON().substr(0, 16)
            }
            if(visibleHistoryEvents.rightDate){
                iEndDate.value=visibleHistoryEvents.rightDate.toJSON().substr(0, 16)
            }
            
            getHistoryEvents(historyDB)
        }
        

        function btnFiltrHistoryHndl(e){
            getHistoryEvents(historyDB)
            //console.log(allHistoryEvents)
        }
        

        function btnAddHistoryHndl(e){
            addHistoryEvent(historyDB,{ id:genGUID(),
                beginDate: iBeginDate.value,
                endDate: iEndDate.value,
                name: iName.value,
                discription: iDiscription.value,
                reasons: []})
            refreshEvents()
        }
        

        function btnEditHistoryHndl(e){
            putHistoryEvent(historyDB,{ id:iKey.value,
                beginDate: iBeginDate.value,
                endDate: iEndDate.value,
                name: iName.value,
                discription: iDiscription.value,
                reasons: []})
            refreshEvents()
        }
        

        function btnDelHistoryHndl(e){
            delHistoryEvent(historyDB, iKey.value)  // Number(iKey.value)
            refreshEvents()
        }
        

        function cEventsClick(e){
            rect=e.target.getBoundingClientRect()
            
            Y=e.clientY-rect.top
            Level=Math.floor(Y/31)
            X=e.clientX-rect.left
            
            //console.log(X,Y)
            var active=null
            for(var cur=0; cur<visibleHistoryEvents[Level].count;++cur){
                q=visibleHistoryEvents[Level][cur]                    
                l=(q.bd-visibleHistoryEvents.leftDate)*visibleHistoryEvents.d
                r=(q.ed-visibleHistoryEvents.leftDate)*visibleHistoryEvents.d
                                
                //console.log(X, l, r)
                if((l<=X)&&(r>=X)){active=q;break}
            }
            //console.log(active)
            
            if(active){
                iKey.value=active.id
                iBeginDate.value=active.beginDate//leftDate.toJSON().substr(0, 16)
                iEndDate.value=active.endDate//rightDate.toJSON().substr(0, 16)
                iName.value=active.name
                iDiscription.value=active.discription
                wikipedia.href='https://ru.wikipedia.org/wiki/'+active.name.replace(' ','_')
            }else{
                iKey.value=''
                iName.value=''
                iDiscription.value=''
                
                iBeginDate.value=visibleHistoryEvents.leftDate.toJSON().substr(0, 16)
                iEndDate.value=visibleHistoryEvents.rightDate.toJSON().substr(0, 16)
                
                wikipedia.href='https://ru.wikipedia.org/wiki/'
            }
        }
        
        let openRequest = indexedDB.open('historyDB', 1);
        openRequest.onupgradeneeded = function(e){
            historyDB = e.target.result;//openRequest.result;            
            if (!historyDB.objectStoreNames.contains('historyEvents')) { // ???????? ?????????????????? "historyEvents" ??????
                historyDB.createObjectStore('historyEvents', {keyPath: 'id'}); // ?????????????? "historyEvents"
                allHistoryEvents=true
                
            }
        }
        openRequest.onsuccess = function(e){
            historyDB = e.target.result;
            if(allHistoryEvents){
                for (i = 0; i < startEvents.length; ++i){
                    historyDB,startEvents[i].id=genGUID()
                    addHistoryEvent(historyDB,startEvents[i])
                }
            }
            allHistoryEvents=[]
        }
        openRequest.onerror = function(e){
            alert('error opening historyDB' + e.target.errorCode);
        }
        
        
        function addHistoryEvent(db,historyEvent){// ???????????????????? ??????????????
            let t = db.transaction(['historyEvents'], 'readwrite');
            let store = t.objectStore('historyEvents');
            store.add(historyEvent);
            // ???????????????????? ????????????????????
            t.oncomplete = function(e){
                //console.log('?????????????? ??????????????????')
            }
            t.onerror = function(e){
                alert('error ?????????????? ???? ??????????????????' + e.target.errorCode);
            }
        }
        
        function putHistoryEvent(db,historyEvent,key){// ???????????????????????????? ??????????????
            let t = db.transaction(['historyEvents'], 'readwrite');
            let store = t.objectStore('historyEvents');
            store.put(historyEvent,key);
            // ???????????????????? ????????????????????
            t.oncomplete = function(e){
                //console.log('?????????????? ????????????????')
            }
            t.onerror = function(e){
                alert('error ?????????????? ???? ????????????????' + e.target.errorCode);
            }
        }
        
        function delHistoryEvent(db,key){//???????????????? ??????????????
            let t = db.transaction(['historyEvents'], 'readwrite');
            let store = t.objectStore('historyEvents');
            store.delete(key);
            // ???????????????????? ????????????????????
            t.oncomplete = function(e){
                //console.log('?????????????? ??????????????')
            }
            t.onerror = function(e){
                alert('error ?????????????? ???? ??????????????' + e.target.errorCode);
            }
        }
        
        
        function getHistoryEvents(db){// ?????????????????? ?????? ?????????????? ???? ????
            let t = db.transaction(['historyEvents'], 'readwrite');
            let store = t.objectStore('historyEvents');
            let req=store.getAll();
           
            req.onsuccess = function(e){
                    // console.log('?????????????? ????????????????')
                //console.log(e.target.result)
                allHistoryEvents=e.target.result

                console.log(allHistoryEvents)
                
                minDate=new Date(-8640000000000000)
                maxDate=new Date(8640000000000000)
                
                bp=new Date(iBeginDate.value);// ???????????? ??????????????
                if(isNaN(bp)){bp=minDate}
                //console.log(bp)
                
                ep=new Date(iEndDate.value);// ?????????? ??????????????
                if(isNaN(ep)){ep=maxDate}
                //console.log(ep)
                
                
                visibleHistoryEvents={count:0} 
                for (i = 0; i < allHistoryEvents.length; ++i){// ???????????????????? ?????? ?????????????? ?????????? ?????????? ?????????????? ???? ?????????????? ??????????????
                    q=allHistoryEvents[i]
                    
                    //console.log(q)
                    bd=new Date(q.beginDate);// ???????????? ??????????????
                    if(isNaN(bd)){bd=minDate}
                
                    ed=new Date(q.endDate);// ?????????? ??????????????
                    if(isNaN(ed)){ed=maxDate}
                    
                    //console.log(bp,ep,bd,ed)
                    
                    if((ed>bp)&&(bd<ep)){//?????????????? ???????????????????????? ?? ????????????????
                        if(bp<bd){q.bd=bd}else{q.bd=bp}// ???????????????????? ???????????????????????? ??????????????
                        if(ep>ed){q.ed=ed}else{q.ed=ep}

                        //?????????????????? ?????????????????????? ?? ?????????????? ??????????????????
                        intersects=true
                        for(var Level=0; Level<visibleHistoryEvents.count;++Level){
                            intersects=false
                            for(var cur=0; cur<visibleHistoryEvents[Level].count;++cur){
                                intersects=((q.ed>visibleHistoryEvents[Level][cur].bd)&&(q.bd<visibleHistoryEvents[Level][cur].ed))//?????????????? ???????????????????????? ?? ???????????? ???????????????? ???? ???????? ????????????
                                if(intersects){break}// ???????? ????????????????????????, ???? ?????????????????? ???? ???????? ???????????? ???? ??????????????????
                            }
                            if(!intersects){break}//???????? ???? ????????????????????????, ???? ?????????? ?????????????? ?????? ????????????????????
                        }
                        
                        if(intersects){//???????? ???????????????????????? ???? ???????? ??????????????
                            // ???? ?????????????????? ?????????????????? ??????????????
                            visibleHistoryEvents.count=visibleHistoryEvents.count+1
                            visibleHistoryEvents[Level]={count:0}
                        }
                        
                        //console.log(i,q)
                        visibleHistoryEvents[Level][visibleHistoryEvents[Level].count]=q
                        visibleHistoryEvents[Level].count=visibleHistoryEvents[Level].count+1
                        
                    }
                }
                
                leftDate=maxDate; rightDate=minDate
                
                for(var Level=0; Level<visibleHistoryEvents.count;++Level){// ???????????????????? ?????? ?????????????? ?????????????? ?????? ?????????????????????? ?????????????? ??????
                    for(var cur=0; cur<visibleHistoryEvents[Level].count;++cur){
                        if(visibleHistoryEvents[Level][cur].bd<leftDate){leftDate=visibleHistoryEvents[Level][cur].bd}
                        if(visibleHistoryEvents[Level][cur].ed>rightDate){rightDate=visibleHistoryEvents[Level][cur].ed}
                    }
                }
                visibleHistoryEvents.leftDate=leftDate
                visibleHistoryEvents.rightDate=rightDate
                
                //console.log(iBeginDate.value)
                
                iBeginDate.value=leftDate.toJSON().substr(0, 16)
                iEndDate.value=rightDate.toJSON().substr(0, 16)
                

                

                paintVisibleEvents()
            }
            req.onerror = function(e){
                alert('error ?????????????? ???? ????????????????' + e.target.errorCode);
            }
        
            // ???????????????????? ????????????????????
            t.oncomplete = function(e){
                //console.log('?????????????? ????????????????')
                //console.log(e.target.result)
            }
            t.onerror = function(e){
                alert('error ?????????????? ???? ????????????????' + e.target.errorCode);
            }
        }
        
        function paintVisibleEvents(){
            
 
            cEvents.style.height=visibleHistoryEvents.count*31+'px'// ?????????????????????? ???? ???????????? ???? ????????????
            cEvents.width = cEvents.clientWidth // ?????????????????????????? ?????????????? 1/1
            cEvents.height = cEvents.clientHeight
		
            var ctx = cEvents.getContext('2d');
            
            ctx.strokeStyle = "#550D11";
            ctx.fillStyle = "#F6FAC2";
            ctx.lineWidth = 1;
            
            
            d=visibleHistoryEvents.rightDate-visibleHistoryEvents.leftDate
            //console.log(visibleHistoryEvents.rightDate,q.ed)
            d=(cEvents.width)/d
            visibleHistoryEvents.d=d
            //console.log(visibleHistoryEvents)
            
            ctx.beginPath();
            
            for(var Level=0; Level<visibleHistoryEvents.count;++Level){// ???????????????????? ?????? ?????????????? ?????????????? ?????? ??????????????????
                for(var cur=0; cur<visibleHistoryEvents[Level].count;++cur){
                    q=visibleHistoryEvents[Level][cur]

                    
                    l=(q.bd-visibleHistoryEvents.leftDate)*d
                    r=(q.ed-visibleHistoryEvents.leftDate)*d
                    
                    //console.log(l,r)
                    ctx.rect(l,Level*31,r-l,26);
                    ctx.fill();
                }
            }
            ctx.stroke();
        }
     