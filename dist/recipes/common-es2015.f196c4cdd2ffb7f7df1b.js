(window.webpackJsonp=window.webpackJsonp||[]).push([[1],{LS6v:function(t,n,i){"use strict";i.d(n,"a",(function(){return f}));var o=i("fXoL"),e=i("qXBG"),a=i("tyNb"),c=i("dNgK"),s=i("WN5f"),l=i("ofXK");let r=(()=>{class t{constructor(){this.color="#fff",this.animate=!1,this.size=120}}return t.\u0275fac=function(n){return new(n||t)},t.\u0275cmp=o.Jb({type:t,selectors:[["app-loading"]],inputs:{color:"color",animate:"animate",size:"size"},decls:9,vars:0,consts:[[1,"lds-roller"]],template:function(t,n){1&t&&(o.Ub(0,"div",0),o.Qb(1,"div"),o.Qb(2,"div"),o.Qb(3,"div"),o.Qb(4,"div"),o.Qb(5,"div"),o.Qb(6,"div"),o.Qb(7,"div"),o.Qb(8,"div"),o.Tb())},styles:['.lds-roller[_ngcontent-%COMP%]{display:inline-block;position:relative;width:80px;height:80px;z-index:100}.lds-roller[_ngcontent-%COMP%]   div[_ngcontent-%COMP%]{-webkit-animation:lds-roller 1.2s cubic-bezier(.5,0,.5,1) infinite;animation:lds-roller 1.2s cubic-bezier(.5,0,.5,1) infinite;transform-origin:40px 40px}.lds-roller[_ngcontent-%COMP%]   div[_ngcontent-%COMP%]:after{content:" ";display:block;position:absolute;width:7px;height:7px;border-radius:50%;background:#a01313;margin:-4px 0 0 -4px}.lds-roller[_ngcontent-%COMP%]   div[_ngcontent-%COMP%]:first-child{-webkit-animation-delay:-36ms;animation-delay:-36ms}.lds-roller[_ngcontent-%COMP%]   div[_ngcontent-%COMP%]:first-child:after{top:63px;left:63px}.lds-roller[_ngcontent-%COMP%]   div[_ngcontent-%COMP%]:nth-child(2){-webkit-animation-delay:-72ms;animation-delay:-72ms}.lds-roller[_ngcontent-%COMP%]   div[_ngcontent-%COMP%]:nth-child(2):after{top:68px;left:56px}.lds-roller[_ngcontent-%COMP%]   div[_ngcontent-%COMP%]:nth-child(3){-webkit-animation-delay:-.108s;animation-delay:-.108s}.lds-roller[_ngcontent-%COMP%]   div[_ngcontent-%COMP%]:nth-child(3):after{top:71px;left:48px}.lds-roller[_ngcontent-%COMP%]   div[_ngcontent-%COMP%]:nth-child(4){-webkit-animation-delay:-.144s;animation-delay:-.144s}.lds-roller[_ngcontent-%COMP%]   div[_ngcontent-%COMP%]:nth-child(4):after{top:72px;left:40px}.lds-roller[_ngcontent-%COMP%]   div[_ngcontent-%COMP%]:nth-child(5){-webkit-animation-delay:-.18s;animation-delay:-.18s}.lds-roller[_ngcontent-%COMP%]   div[_ngcontent-%COMP%]:nth-child(5):after{top:71px;left:32px}.lds-roller[_ngcontent-%COMP%]   div[_ngcontent-%COMP%]:nth-child(6){-webkit-animation-delay:-.216s;animation-delay:-.216s}.lds-roller[_ngcontent-%COMP%]   div[_ngcontent-%COMP%]:nth-child(6):after{top:68px;left:24px}.lds-roller[_ngcontent-%COMP%]   div[_ngcontent-%COMP%]:nth-child(7){-webkit-animation-delay:-.252s;animation-delay:-.252s}.lds-roller[_ngcontent-%COMP%]   div[_ngcontent-%COMP%]:nth-child(7):after{top:63px;left:17px}.lds-roller[_ngcontent-%COMP%]   div[_ngcontent-%COMP%]:nth-child(8){-webkit-animation-delay:-.288s;animation-delay:-.288s}.lds-roller[_ngcontent-%COMP%]   div[_ngcontent-%COMP%]:nth-child(8):after{top:56px;left:12px}@-webkit-keyframes lds-roller{0%{transform:rotate(0deg)}to{transform:rotate(1turn)}}@keyframes lds-roller{0%{transform:rotate(0deg)}to{transform:rotate(1turn)}}']}),t})();var g=i("3Pt+");function d(t,n){1&t&&o.Qb(0,"img",13)}function h(t,n){if(1&t){const t=o.Vb();o.Ub(0,"div",14),o.Ub(1,"p"),o.Ec(2,"Don't have an account?"),o.Tb(),o.Ub(3,"div"),o.Ub(4,"p"),o.Ub(5,"span",15),o.cc("click",(function(){return o.wc(t),o.gc().toggleLogin()})),o.Ec(6," Go to "),o.Ub(7,"b"),o.Ec(8),o.Tb(),o.Tb(),o.Sb(9),o.Ub(10,"span",16),o.Ec(11,"or"),o.Tb(),o.Ub(12,"span",17),o.cc("click",(function(){return o.wc(t),o.gc().signInGuest()})),o.Ub(13,"b"),o.Ec(14,"Sign in"),o.Tb(),o.Ec(15," as a guest "),o.Tb(),o.Rb(),o.Tb(),o.Tb(),o.Tb()}if(2&t){const t=o.gc();o.Db(1),o.Cc("opacity",t.isLogin?1:0),o.Db(7),o.Fc(t.isLogin?"Sign up":"login")}}const p=function(t){return{"auth-dialog":t}},u=function(t){return{show:t}},b=function(t){return{hidden:t}},m=function(t){return{"auth-actions":t}};let f=(()=>{class t{constructor(t,n,i,o){this.authService=t,this.router=n,this.snackBar=i,this.dialog=o,this.isLogin=!0,this.loading=!1}ngOnInit(){this.dialog.dialogData&&(this.isSignup=this.dialog.dialogData.signup,this.isLogin=!1)}toggleLogin(){this.isLogin=!this.isLogin}onSubmit(t){if(!t.valid)return this.openSnackBar("Check your details");this.loading=!0;const n=t.value.email,i=t.value.password,o=t.value.name,e=this.isLogin?null:{notify:"welcome"},a=this.isLogin?null:{name:o};(this.isLogin?this.authService.firebaseLogin(n,i):this.authService.firebaseSignup(n,i,o)).then(t=>{if("string"==typeof t){this.loading=!1;let n=t;return"goSignup"===t&&(this.isLogin=!1,n="Email not found! Please add your name to create an account."),this.openSnackBar(n)}this.dialog.dialogData&&this.dialog.close(o),this.router.navigate(["/recipes"],{queryParams:e,state:{data:a}})})}openSnackBar(t,n){this.snackBar.open(t,n,{duration:3e3})}signInGuest(){this.loading=!0,this.authService.guestLogin().then(t=>{"success"===t?this.router.navigate(["/recipes"],{queryParams:{notify:"guest"}}):(this.loading=!1,this.openSnackBar(t))})}}return t.\u0275fac=function(n){return new(n||t)(o.Pb(e.a),o.Pb(a.c),o.Pb(c.a),o.Pb(s.a))},t.\u0275cmp=o.Jb({type:t,selectors:[["app-auth"]],decls:17,vars:20,consts:[[1,"auth-container",3,"ngClass"],["class","hole-logo","src","assets/images/logos/hole-logo.png",4,"ngIf"],[1,"form-container"],[1,"loading",3,"ngClass"],[3,"ngClass","ngSubmit"],["authForm","ngForm"],[1,"form-group"],["type","email","id","email","ngModel","","name","email","required","","email","",1,"form-control",3,"placeholder"],["type","password","id","password","ngModel","","name","password","required","","minlength","6",1,"form-control",3,"placeholder"],["type","name","id","name","ngModel","","name","name","placeholder","What's your name?",1,"form-control",3,"required"],[1,"actions",3,"ngClass"],["type","submit","id","auth-submit"],["class","other-opts",4,"ngIf"],["src","assets/images/logos/hole-logo.png",1,"hole-logo"],[1,"other-opts"],["id","mobile-toggle",1,"other-actions",3,"click"],[1,"mf-or"],[1,"other-actions",3,"click"]],template:function(t,n){if(1&t){const t=o.Vb();o.Ub(0,"div",0),o.Dc(1,d,1,0,"img",1),o.Ub(2,"div",2),o.Ub(3,"div",3),o.Qb(4,"app-loading"),o.Tb(),o.Ub(5,"form",4,5),o.cc("ngSubmit",(function(){o.wc(t);const i=o.tc(6);return n.onSubmit(i)})),o.Ub(7,"div",6),o.Qb(8,"input",7),o.Tb(),o.Ub(9,"div",6),o.Qb(10,"input",8),o.Tb(),o.Ub(11,"div",6),o.Qb(12,"input",9),o.Tb(),o.Ub(13,"div",10),o.Ub(14,"button",11),o.Ec(15),o.Tb(),o.Dc(16,h,16,3,"div",12),o.Tb(),o.Tb(),o.Tb(),o.Tb()}2&t&&(o.mc("ngClass",o.pc(12,p,n.isSignup)),o.Db(1),o.mc("ngIf",!n.isSignup),o.Db(2),o.mc("ngClass",o.pc(14,u,n.loading)),o.Db(2),o.mc("ngClass",o.pc(16,b,n.loading)),o.Db(3),o.mc("placeholder",n.isLogin?"Email":"What's your email?"),o.Db(2),o.mc("placeholder",n.isLogin?"Password":"Choose a password"),o.Db(1),o.Cc("opacity",n.isLogin?0:1),o.Db(1),o.mc("required",!n.isLogin),o.Db(1),o.mc("ngClass",o.pc(18,m,!n.isSignup)),o.Db(2),o.Gc(" ",n.isLogin?"Sign in":"Sign up"," "),o.Db(1),o.mc("ngIf",!n.isSignup))},directives:[l.j,l.l,r,g.y,g.r,g.s,g.c,g.q,g.t,g.w,g.d,g.m],styles:[".loading[_ngcontent-%COMP%]{position:absolute;left:50%;top:30%;transform:translate(-50%);text-align:center;display:none}.loading.show[_ngcontent-%COMP%]{display:block}.auth-container[_ngcontent-%COMP%]{display:flex;flex-direction:column;height:100vh}.hole-logo[_ngcontent-%COMP%]{display:block;margin:auto;width:15vw;max-width:140px}.form-container[_ngcontent-%COMP%]{padding:30px}.form-container[_ngcontent-%COMP%]   form[_ngcontent-%COMP%]{display:flex;flex-direction:column;justify-content:space-between;top:25%;width:100%}.form-container[_ngcontent-%COMP%]   .form-group[_ngcontent-%COMP%]{width:100%;text-align:center;display:block;margin:15px auto 0}.form-container[_ngcontent-%COMP%]   .form-group[_ngcontent-%COMP%]   input[_ngcontent-%COMP%]{max-width:340px;width:80%;border-radius:0;border:none;border-bottom:1px solid #918e8a;text-align:center;background-color:transparent}.actions[_ngcontent-%COMP%]{margin:14px auto;width:100%;flex-direction:column;align-items:center}.actions[_ngcontent-%COMP%]   button#auth-submit[_ngcontent-%COMP%]{border:1px solid #333;color:#333;width:230px;padding:4px;height:auto;font-size:18px;margin:20px auto;background:none;transition:all .5s ease-in-out}.actions[_ngcontent-%COMP%]   button#auth-submit[_ngcontent-%COMP%]:hover{opacity:1}.actions.auth-actions[_ngcontent-%COMP%]   button#auth-submit[_ngcontent-%COMP%]:hover{background-color:#c29f38}.actions[_ngcontent-%COMP%]   p[_ngcontent-%COMP%]{display:block;text-align:center;margin:20px auto auto;font-style:italic;color:#d3d3d3}#login-toggle[_ngcontent-%COMP%]{font-size:12px;font-style:italic}div.other-opts[_ngcontent-%COMP%]{margin-top:20px}div.other-opts[_ngcontent-%COMP%]   p[_ngcontent-%COMP%]{margin-top:10px}span.other-actions[_ngcontent-%COMP%]{cursor:pointer;transition:all .5s;color:#382e2e;font-style:normal}span.other-actions[_ngcontent-%COMP%]:hover{color:#c29f38}.mf-or[_ngcontent-%COMP%]{margin:0 7px 0 4px;font-size:14px}.auth-dialog[_ngcontent-%COMP%]{height:auto}.auth-dialog[_ngcontent-%COMP%]   .form-container[_ngcontent-%COMP%]{overflow:hidden}.auth-dialog[_ngcontent-%COMP%]   .form-container[_ngcontent-%COMP%]   input[_ngcontent-%COMP%]{color:#fff;border-bottom:1px solid #fff}.auth-dialog[_ngcontent-%COMP%]   .form-container[_ngcontent-%COMP%]   .actions[_ngcontent-%COMP%]   button#auth-submit[_ngcontent-%COMP%]{margin-bottom:0;margin-top:40px;border:1px solid #fff;color:#fff}"]}),t})()},WN5f:function(t,n,i){"use strict";i.d(n,"a",(function(){return b}));var o=i("fXoL"),e=i("0IaG"),a=i("ofXK");function c(t,n){if(1&t){const t=o.Vb();o.Ub(0,"a",7),o.Ub(1,"span",8),o.cc("click",(function(){return o.wc(t),o.gc().closeDialog()})),o.Ec(2,"clear"),o.Tb(),o.Tb()}}function s(t,n){if(1&t&&(o.Ub(0,"h2"),o.Ec(1),o.Tb()),2&t){const t=o.gc();o.Db(1),o.Fc(t.title)}}function l(t,n){if(1&t&&o.Qb(0,"img",9),2&t){const t=o.gc();o.mc("src",t.imagePath,o.yc)}}function r(t,n){1&t&&o.Qb(0,"p",10),2&t&&o.mc("innerHtml",n.$implicit,o.xc)}const g=function(t,n,i){return{"btn-primary":t,"btn-secondary":n,"btn-danger":i}};function d(t,n){if(1&t){const t=o.Vb();o.Ub(0,"button",13),o.cc("click",(function(){o.wc(t);const i=n.$implicit,e=o.gc(2);return i.go(e.mdDialogRef)})),o.Tb()}if(2&t){const t=n.$implicit;o.mc("ngClass",o.rc(2,g,t.primary,!t.primary&&!t.danger,t.danger))("innerHtml",t.text,o.xc)}}function h(t,n){if(1&t&&(o.Ub(0,"div",11),o.Dc(1,d,1,6,"button",12),o.Tb()),2&t){const t=o.gc();o.Db(1),o.mc("ngForOf",t.actions)}}let p=(()=>{class t{constructor(t,n){this.dialog=t,this.mdDialogRef=n,this.data=this.dialog.dialogData,this.title=this.data.title,this.lines=this.data.lines||[],this.actions=this.data.actions||[],this.class=this.data.class,this.hideClose=!1}ngOnInit(){this.imagePath=this.data.image?"/assets/images/"+this.data.image:null,console.log("img: ",this.imagePath),"string"==typeof this.data.lines&&(this.lines=[this.data.lines]),this.actions.forEach((t,n,i)=>{1===this.actions.length&&"string"==typeof t?i[n]={text:t,primary:!0,go:!0}:2===this.actions.length&&"string"==typeof t&&(i[n]={text:t,primary:1===n,go:0!==n||void 0});const o=i[n];if("function"!=typeof o.go){const t=o.go;o.go=()=>{this.dialog.close(t)}}})}closeDialog(){this.dialog.close()}}return t.\u0275fac=function(n){return new(n||t)(o.Pb(b),o.Pb(e.c))},t.\u0275cmp=o.Jb({type:t,selectors:[["app-alert"]],decls:7,vars:6,consts:[[1,"dialog","dialog-simple",3,"ngClass"],["class","close-x",4,"ngIf"],[1,"dialog-content"],[4,"ngIf"],[3,"src",4,"ngIf"],[3,"innerHtml",4,"ngFor","ngForOf"],["class","dialog-actions",4,"ngIf"],[1,"close-x"],[1,"material-icons",3,"click"],[3,"src"],[3,"innerHtml"],[1,"dialog-actions"],["id","actionBtn","class","btn",3,"ngClass","innerHtml","click",4,"ngFor","ngForOf"],["id","actionBtn",1,"btn",3,"ngClass","innerHtml","click"]],template:function(t,n){1&t&&(o.Ub(0,"div",0),o.Dc(1,c,3,0,"a",1),o.Ub(2,"div",2),o.Dc(3,s,2,1,"h2",3),o.Dc(4,l,1,1,"img",4),o.Dc(5,r,1,1,"p",5),o.Tb(),o.Dc(6,h,2,1,"div",6),o.Tb()),2&t&&(o.mc("ngClass",n.class),o.Db(1),o.mc("ngIf",!n.hideClose),o.Db(2),o.mc("ngIf",n.title),o.Db(1),o.mc("ngIf",n.imagePath),o.Db(1),o.mc("ngForOf",n.lines),o.Db(1),o.mc("ngIf",n.actions.length))},directives:[a.j,a.l,a.k],styles:[".dialog[_ngcontent-%COMP%]{max-width:560px;min-width:210px}img[_ngcontent-%COMP%]{width:63px;align-self:center;margin:15px}.dialog-content[_ngcontent-%COMP%]{display:flex;flex-direction:column}.dialog-actions[_ngcontent-%COMP%]{text-align:center}button[_ngcontent-%COMP%]{margin:15px 10px 0;padding:0 20px;height:40px}h2[_ngcontent-%COMP%]{text-align:center;margin:auto;color:#031a5d}p[_ngcontent-%COMP%]{letter-spacing:.5px;font-family:Rosario;margin:10px auto}.btn-danger[_ngcontent-%COMP%]{background-color:rgba(255,0,0,.27);border-color:rgba(255,0,0,0)}.btn-danger[_ngcontent-%COMP%]:hover{background-color:#ffd7d5;border-color:#ffd7d5}.close-x[_ngcontent-%COMP%]{position:absolute;right:15px;top:15px;cursor:pointer}"]}),t})();var u=i("GJmQ");let b=(()=>{class t{constructor(t){this.mdDialog=t,this.dialogStack=[]}show(t,n,i){this.dialogData=n;const o=this.mdDialog.open(t,i);return this.current=o,this.dialogStack.push(o),o.afterClosed().subscribe(()=>{if(1===this.dialogStack.length)this.dialogStack=[],this.current=null,this.dialogData=null;else{const t=this.dialogStack.indexOf(o);this.dialogStack.splice(t,1),this.current=this.dialogStack[this.dialogStack.length-1]}}),o}close(t){this.current.close(t),this.dialogData=null}alert(t){console.log("img: ",t);const n=this.show(p,t,{disableClose:!0});return this.observeDialog(n)}observeDialog(t){return t.afterClosed().pipe(Object(u.a)(t=>void 0!==t))}}return t.\u0275fac=function(n){return new(n||t)(o.Yb(e.a))},t.\u0275prov=o.Lb({token:t,factory:t.\u0275fac,providedIn:"root"}),t})()}}]);