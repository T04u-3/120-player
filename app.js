let audioCtx = new (window.AudioContext || window.webkitAudioContext)()

let gain = audioCtx.createGain()
let filter = audioCtx.createBiquadFilter()
let reverbGain = audioCtx.createGain()

gain.connect(filter)
filter.connect(reverbGain)
reverbGain.connect(audioCtx.destination)

filter.type = "lowpass"
filter.frequency.value = 2000

let currentOsc = null
let currentNote = null
let breath = 0

function noteToFreq(note){
return 440 * Math.pow(2,(note-69)/12)
}

function noteName(n){
const names=["C","C#","D","D#","E","F","F#","G","G#","A","A#","B"]
return names[n%12]+Math.floor(n/12-1)
}

async function connectMIDI(){

let midi = await navigator.requestMIDIAccess()

for(let input of midi.inputs.values()){
input.onmidimessage = handleMIDI
}

}

function handleMIDI(msg){

let [cmd,note,vel] = msg.data
let type = cmd & 0xf0

// NOTE ON
if(type===144 && vel>0){

startNote(note)

}

// NOTE OFF
if(type===128 || (type===144 && vel===0)){

stopNote()

}

// CC
if(type===176){

let cc = note
let val = vel

// BREATH CONTROL
if(cc===2){

breath = val/127

gain.gain.value = breath

document.getElementById("level").style.width=(breath*100)+"%"

// 息が止まったら音止める
if(breath < 0.02){
stopNote()
}

}

}

}

function startNote(note){

// 前の音止める
stopNote()

if(breath <= 0.02) return

let osc = audioCtx.createOscillator()

osc.type="sawtooth"
osc.frequency.value = noteToFreq(note)

osc.connect(gain)

osc.start()

currentOsc = osc
currentNote = note

document.getElementById("note").textContent = noteName(note)

}

function stopNote(){

if(currentOsc){

currentOsc.stop()
currentOsc.disconnect()

currentOsc = null
currentNote = null

document.getElementById("note").textContent="---"

}

}

document.getElementById("connect").onclick=connectMIDI

document.getElementById("brightness").oninput=e=>{
filter.frequency.value=e.target.value
}

document.getElementById("reverb").oninput=e=>{
reverbGain.gain.value=e.target.value
}
