(self.webpackChunk_N_E=self.webpackChunk_N_E||[]).push([[129],{4633:(e,t,s)=>{"use strict";s.r(t),s.d(t,{default:()=>c});var r=s(5155),a=s(2115);let o=["time","person","year","way","day","thing","man","world","life","hand","part","child","eye","woman","place","work","week","case","point","government","company","number","group","problem","fact","money","water","month","lot","right","study","book","eye","job","word","business","issue","side","kind","head","house","service","friend","father","power","hour","game","line","end","member","law","car","city","community","name","president","team","minute","idea","kid","body","information","back","parent","face","others","level","office","door","health","person","art","war","history","party","result","change","morning","reason","research","girl","guy","moment","air","teacher","force","education","book","rhythm","future","mountain","journey","galaxy"],n=e=>{let t=[()=>e+"s",()=>e+"ed",()=>e+"ing",()=>e+"er",()=>{if(e.length<3)return e+"s";let t=Math.floor(Math.random()*(e.length-2))+1,s=e.split("");return[s[t],s[t+1]]=[s[t+1],s[t]],s.join("")},()=>{if(e.length<2)return e+"s";let t=Math.floor(Math.random()*e.length);return e.slice(0,t)+e[t]+e.slice(t)},()=>"re"+e,()=>"un"+e];return(0,t[Math.floor(Math.random()*t.length)])()};function l(e){let{onGameOver:t}=e,[s,l]=(0,a.useState)(3),[c,i]=(0,a.useState)(0),[d,m]=(0,a.useState)(""),[h,x]=(0,a.useState)(new Set),[u,b]=(0,a.useState)([...o]),[f,w]=(0,a.useState)(""),[g,y]=(0,a.useState)([]);(0,a.useEffect)(()=>{d||v()},[]);let p=(0,a.useCallback)(e=>{console.log(e),y(t=>[e,...t.slice(0,19)])},[]),v=(0,a.useCallback)(()=>{if(0===u.length){p("No more available words, game over"),t(c);return}let e=Math.floor(Math.random()*u.length),s=u[e];b(t=>t.filter((t,s)=>s!==e)),m(s),p("Selected new word: ".concat(s)),w("New word: ".concat(s))},[u,c,t,p]),N=(0,a.useCallback)(()=>{if(0===h.size){p("No seen words available, selecting a new word"),v();return}let e=Array.from(h);if(.3>Math.random()){let t=e[Math.floor(Math.random()*e.length)];m(t),p("Showing exact seen word: ".concat(t)),w("Showing exact seen word: ".concat(t))}else{let t=e[Math.floor(Math.random()*e.length)],s=n(t);if(h.has(s)){p("Modified word (".concat(s,") already seen, trying again")),N();return}m(s),p("Showing modified word: ".concat(s," (from ").concat(t,")")),w("Modified from: ".concat(t))}},[h,v,p]),j=(0,a.useCallback)(()=>{if(0===h.size){v();return}let e=Math.min(80,30+5*h.size),t=100*Math.random()<e;p("Deciding next word (".concat(e,"% chance of seen word): ").concat(t?"SEEN":"NEW")),t?N():v()},[h,v,N,p]);return(0,r.jsxs)("div",{className:"w-full max-w-lg bg-white rounded-lg shadow p-8 flex flex-col items-center",children:[(0,r.jsxs)("div",{className:"mb-10 text-center w-full",children:[(0,r.jsx)("div",{className:"text-5xl font-bold mb-10 text-gray-800",children:d}),(0,r.jsxs)("div",{className:"flex gap-6 justify-center",children:[(0,r.jsx)("button",{onClick:()=>{if(p('Player clicked SEEN for: "'.concat(d,'"')),h.has(d)){let e=c+1;i(e),p("✓ Correct! Score now: ".concat(e)),w('✓ Correct: "'.concat(d,'" has been seen before'))}else{let e=s-1;if(l(e),p("✗ Incorrect! Lives now: ".concat(e)),w('✗ Incorrect: "'.concat(d,'" is a new word')),x(e=>new Set(e).add(d)),e<=0){p("Game over with score: ".concat(c)),t(c);return}}setTimeout(()=>j(),400)},className:"bg-blue-600 text-white py-3 px-10 rounded-md text-lg font-semibold hover:bg-blue-700 transition-colors",children:"SEEN"}),(0,r.jsx)("button",{onClick:()=>{if(p('Player clicked NEW for: "'.concat(d,'"')),h.has(d)){let e=s-1;if(l(e),p("✗ Incorrect! Lives now: ".concat(e)),w('✗ Incorrect: "'.concat(d,'" has been seen before')),e<=0){p("Game over with score: ".concat(c)),t(c);return}}else{let e=c+1;i(e),p("✓ Correct! Score now: ".concat(e)),w('✓ Correct: "'.concat(d,'" is a new word'))}x(e=>new Set(e).add(d)),setTimeout(()=>j(),400)},className:"bg-green-600 text-white py-3 px-10 rounded-md text-lg font-semibold hover:bg-green-700 transition-colors",children:"NEW"})]})]}),(0,r.jsxs)("div",{className:"flex gap-16 text-center",children:[(0,r.jsxs)("div",{children:[(0,r.jsx)("div",{className:"text-3xl font-bold text-blue-600",children:c}),(0,r.jsx)("div",{className:"text-gray-600",children:"Score"})]}),(0,r.jsxs)("div",{children:[(0,r.jsx)("div",{className:"text-3xl font-bold text-blue-600",children:s}),(0,r.jsx)("div",{className:"text-gray-600",children:"Lives"})]})]}),!1]})}function c(){let[e,t]=(0,a.useState)(!1),[s,o]=(0,a.useState)(null);return(0,r.jsxs)("div",{className:"min-h-screen flex flex-col",children:[(0,r.jsx)("div",{className:"bg-purple-500 text-white",children:(0,r.jsxs)("div",{className:"container mx-auto px-4 py-16 text-center",children:[(0,r.jsx)("h1",{className:"text-5xl font-bold mb-4",children:"Verbal Memory Test"}),(0,r.jsxs)("p",{className:"text-xl max-w-2xl mx-auto",children:["Keep as many words in memory as possible.",(0,r.jsx)("br",{}),"Watch out for tricky variations of words you've seen before!"]})]})}),(0,r.jsx)("div",{className:"flex-grow bg-purple-500 flex items-center justify-center pb-16",children:e?(0,r.jsx)(l,{onGameOver:e=>{o(e),t(!1)}}):(0,r.jsxs)("div",{className:"bg-white rounded-lg p-8 w-full max-w-lg mx-4 text-center",children:[null!==s?(0,r.jsxs)("div",{className:"mb-8",children:[(0,r.jsx)("h2",{className:"text-3xl font-bold mb-4 text-gray-800",children:"Game Over"}),(0,r.jsx)("p",{className:"text-6xl font-bold mb-4 text-purple-600",children:s}),(0,r.jsx)("p",{className:"text-gray-600 mb-8",children:"words remembered"})]}):(0,r.jsxs)("div",{className:"mb-8",children:[(0,r.jsx)("h2",{className:"text-2xl font-bold mb-4 text-gray-800",children:"How it works"}),(0,r.jsx)("p",{className:"mb-6 text-gray-700",children:"You'll be shown words one at a time. For each word, you need to decide if you've seen it before in this game."}),(0,r.jsxs)("p",{className:"mb-6 text-gray-700",children:[(0,r.jsx)("span",{className:"font-semibold",children:"SUPERHUMAN TWIST:"})," You'll see tricky variations of words you've seen before, with added letters, or subtle misspellings designed to confuse you!"]}),(0,r.jsx)("p",{className:"text-gray-600 mb-4",children:"You start with 3 lives. Each mistake reduces your lives by 1."})]}),(0,r.jsx)("button",{onClick:()=>{t(!0),o(null)},className:"bg-purple-600 text-white py-3 px-8 rounded-md hover:bg-purple-700 transition-colors font-semibold",children:null!==s?"Play Again":"Start"})]})}),(0,r.jsx)("div",{className:"bg-gray-100 py-12",children:(0,r.jsx)("div",{className:"container mx-auto px-4",children:(0,r.jsx)("div",{className:"max-w-2xl mx-auto",children:(0,r.jsxs)("div",{className:"bg-white p-6 rounded-lg shadow-sm",children:[(0,r.jsx)("h3",{className:"text-xl font-bold mb-4 text-gray-800",children:"About the test"}),(0,r.jsx)("p",{className:"text-gray-600 mb-4",children:"This test measures how many words you can keep in short-term memory at once."}),(0,r.jsx)("p",{className:"text-gray-600",children:"Our superhuman version adds a twist: words will be modified with added letters or subtle misspellings to confuse you. Can you still recognize which words you've seen?"})]})})})})]})}},6459:(e,t,s)=>{Promise.resolve().then(s.bind(s,4633))}},e=>{var t=t=>e(e.s=t);e.O(0,[441,684,358],()=>t(6459)),_N_E=e.O()}]);