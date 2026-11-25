// Twelve original, code-native pixel illustrations for the garage.
const upgradeArt={
 names:[['I4','V6','V8'],['ROAD','SPORT','SLICK'],['SINGLE','TWIN','MAX'],['LIP','WING','AERO']],
 svg(part,tier){let art='';const colors=['#91c6c9','#ed9ab2','#f5cd85'],accent=colors[tier-1];
 const r=(x,y,w,h,c)=>{art+='<rect x="'+x+'" y="'+y+'" width="'+w+'" height="'+h+'" fill="'+c+'"/>'};
 const path=(points,c)=>{art+='<polygon points="'+points+'" fill="'+c+'"/>'};
 const group=(name,fn)=>{art+='<g class="'+name+'">';fn();art+='</g>'};
 r(10,54,44,3,'#111527');
 if(part===0){
  // Machined block, cylinder banks, fins, oil cap and pulsing pistons.
  const width=tier===1?28:40,x=32-width/2;r(x-3,24,width+6,23,'#49596b');r(x,21,width,25,'#83969f');r(x+2,23,width-5,3,'#d6e3d8');
  for(let j=0;j<5;j++)r(x+1,30+j*3,width-2,1,'#526c7e');
  r(26,45,12,6,'#6c7c8a');r(22,49,20,3,'#3d4b61');r(8,31,8,9,'#35445b');r(9,32,5,6,'#b3c5c8');r(48,31,8,9,'#35445b');r(50,33,4,5,'#b3c5c8');
  if(tier===1){r(22,15,20,11,accent);r(23,16,18,2,'#d9f0de');for(let j=0;j<4;j++)r(24+j*4,21,2,2,'#35465b')}
  else{path('12,22 17,12 29,15 30,25',accent);path('34,25 35,15 47,12 52,22',accent);for(let j=0;j<tier+1;j++){r(17+j*3,17+j,2,4,'#f6e8c8');r(37+j*3,19-j,2,4,'#f6e8c8')}r(28,20,8,7,'#35445b')}
  if(tier===3){r(25,8,14,10,'#ece0bb');r(23,8,18,3,'#fff0ce');r(27,12,10,3,'#566a7b');r(46,39,8,6,'#d2aa73')}
  group('part-piston',()=>{r(27,31,10,6,accent);r(30,37,4,7,'#e0e7d4')});r(x+2,27,3,3,'#f8e3b2');r(x+width-5,27,3,3,'#f8e3b2');
 }else if(part===1){
  // Progressively wider rubber, tread, alloy spokes and slick tyre markings.
  const width=12+tier*3;
  for(const cx of [19,46]){r(cx-width/2,13,width,37,'#151b2b');r(cx-width/2+2,11,width-4,41,'#293140');r(cx-width/2+3,14,3,35,'#465066');r(cx-4,18,8,27,'#b8c8cb');r(cx-2,20,4,23,accent);r(cx-3,30,6,5,'#e6e6d2');if(tier<3)for(let j=0;j<6;j++){r(cx-width/2,15+j*6,3,2,'#667080');r(cx+width/2-3,18+j*5,3,2,'#667080')}else{r(cx-width/2+1,20,2,7,accent);r(cx+width/2-3,36,2,7,accent)}group('part-tread',()=>{r(cx-3,21,6,3,'#eaf0df');r(cx-3,39,6,3,'#eaf0df')})}
 }else if(part===2){
  r(13,39,8,9,'#728c9b');r(11,45,18,5,'#aebec0');r(40,12,14,7,'#8b9fab');r(50,12,5,11,'#d5dfd2');
  const rotor=(cx,cy,size)=>{r(cx-size/2-3,cy-size/2+3,size+6,size-6,'#4c6173');r(cx-size/2,cy-size/2,size,size,'#91aab1');r(cx-size/2+2,cy-size/2+2,size-4,size-4,accent);r(cx-size/2+5,cy-size/2+5,size-10,size-10,'#31445c');art+='<g class="part-rotor" style="transform-origin:'+cx+'px '+cy+'px">';r(cx-1,cy-7,2,14,'#e0eadc');r(cx-7,cy-1,14,2,'#e0eadc');path((cx-6)+','+(cy-4)+' '+(cx-3)+','+(cy-6)+' '+(cx+6)+','+(cy+4)+' '+(cx+3)+','+(cy+6),'#bdcfd1');r(cx-2,cy-2,4,4,accent);art+='</g>'};
  if(tier===2){rotor(23,30,24);rotor(44,39,24)}else rotor(32,31,tier===3?38:30);
  group('part-air',()=>{r(3,23,8,2,'#bfebdf');r(0,29,10,2,'#bfebdf');r(3,35,8,2,'#bfebdf')});
 }else{
  // Splitter, rear wing, then a complete lightweight aerodynamic shell.
  if(tier===1){path('10,30 18,23 47,23 55,30 49,40 15,40','#42576d');r(12,31,41,4,accent);r(16,38,34,3,'#c0d5cd');r(10,29,4,13,'#71919e');r(51,29,4,13,'#71919e')}
  else if(tier===2){r(20,33,5,17,'#657d8e');r(40,33,5,17,'#657d8e');path('9,21 54,21 57,32 6,32',accent);r(11,22,42,3,'#e5e9d5');r(8,29,48,5,'#47596f');r(7,18,4,18,'#809bab');r(54,18,4,18,'#809bab')}
  else{path('23,10 42,10 49,27 48,46 42,52 22,52 16,46 15,27',accent);r(23,17,19,12,'#334b64');r(26,18,7,8,'#b0d4d1');r(21,35,22,9,'#8c9194');r(13,45,38,5,'#334b64');r(16,48,32,3,'#c0d6cf');r(18,12,5,4,'#fff0bd');r(42,12,5,4,'#fff0bd');r(20,30,4,12,'#fff1c855')}
  group('part-air',()=>{r(3,15,10,2,'#c1e8dd');r(0,21,11,2,'#c1e8dd');r(52,43,10,2,'#c1e8dd')});
 }
 return '<svg viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg" shape-rendering="crispEdges" aria-hidden="true">'+art+'</svg>'},
 used(part){let svg=this.svg(part,1).replaceAll('#91c6c9','#8c8c7c').replaceAll('#d9f0de','#c5b99b').replaceAll('#b3c5c8','#939381').replaceAll('#eaf0df','#bbb29a');let wear=['<path d="M23 29h7v3h-7zM39 35h5v5h-5z" fill="#ad765b"/><path d="M25 24l4 3m7 10l6 2" stroke="#cfb58c" stroke-width="1"/>','<path d="M11 18h4v10h-4zM52 33h4v11h-4z" fill="#625e55"/><path d="M12 37l5 4m28-22l5 4" stroke="#a19a83" stroke-width="1"/>','<path d="M18 20h6v3h-6zM40 38h6v5h-6z" fill="#ac7658"/><path d="M24 44l7 2m9-27l4 4" stroke="#d0b797" stroke-width="1"/>','<path d="M16 33h8v3h-8zM41 29h9v3h-9z" fill="#916c5b"/><path d="M26 32l10 3m3-8l6 2" stroke="#c7b69c" stroke-width="1"/>'][part];return svg.replace('</svg>',wear+'</svg>')},
 render(button,part,level,cost,affordable){button.className='drag-upgrade visual-upgrade';button.setAttribute('aria-label',drag.translate(drag.parts[part])+' '+level+'/3 · '+(level>=3?'MAX':cost+' PTS'));button.title=button.getAttribute?button.getAttribute('aria-label'):drag.parts[part];button.innerHTML='';const heading=document.createElement('strong');heading.textContent=drag.translate(drag.parts[part]);button.append(heading);const stages=document.createElement('span');stages.className='upgrade-stages';if(level>0){const model=document.createElement('span');model.className='upgrade-model acquired';model.innerHTML=this.svg(part,level);const label=document.createElement('small');label.textContent=this.names[part][level-1]+' ✓';model.append(label);stages.append(model)}else{const stock=document.createElement('span');stock.className='upgrade-model stock-used';stock.innerHTML=this.used(part);const label=document.createElement('small');label.textContent=drag.translate('Origine · usagé');stock.append(label);stages.append(stock)}button.append(stages);const price=document.createElement('span');price.className='upgrade-price';price.textContent=level>=3?'MAX':cost.toLocaleString()+' PTS';button.append(price);button.disabled=level>=3||!affordable}
};
