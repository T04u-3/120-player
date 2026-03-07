let audioCtx = new (window.AudioContext || window.webkitAudioContext)()

let gain = audioCtx.createGain()
let filter = audioCtx.createBiquadFilter()
let reverbGain = audioCtx.createGain()

gain.connect(filter)
filter.connect(reverbGain)
reverbGain.connect(audioCtx.destination)

filter.type = "lowpass"
filter.frequency.value = 2000

let oscillators = {}

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

if(type===144 && vel>0){

noteOn(note,vel)

}else if(type===128 || (type===144 && vel===0)){

noteOff(note)

}

if(type===176){

let cc = note
let val = vel

if(cc===2){

let v = val/127
gain.gain.value = v

document.getElementById("level").style.width=(v*100)+"%"

}

}

}

function noteOn(note,vel){

let osc = audioCtx.createOscillator()

let freq = noteToFreq(note)

osc.type="sawtooth"

osc.frequency.value=freq

osc.connect(gain)

osc.start()

oscillators[note]=osc

document.getElementById("note").textContent = noteName(note)

}

function noteOff(note){

if(oscillators[note]){

oscillators[note].stop()

delete oscillators[note]

}

}

document.getElementById("connect").onclick=connectMIDI

document.getElementById("brightness").oninput=e=>{
filter.frequency.value=e.target.value
}

document.getElementById("reverb").oninput=e=>{
reverbGain.gain.value=e.target.value
}
